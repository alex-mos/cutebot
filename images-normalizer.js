'use strict';

var fs = require('fs');
var Path = require('path');


/*** Модуль приведения загруженных фотографий к плоской структуре с инкрементирующимися названиями файлов todo: оформить жсДоком ***/

// Проверка, является ли объект в директорией файлом. (факапится, если в названии директории есть точка. todo: придумать что-нибудь получше.)
var isFile = (name) => {
	return name.indexOf('.') > -1;
};


// Копирование файлов из поддиректорий в корень
var fileNumber = 1;
var baseDir = 'images/test';
var exclude = ['.DS_Store'];


var subdirFilesCopy = (path, callback) => {

	fs.readdir(path, (err, stats, callback) => {
		if (err) throw err;

		stats.forEach((name, index) => {
			if (exclude.indexOf(name) != -1) {
				fs.unlink(Path.join(path, name));
				console.log('deleted file ' + name);
			} else if (isFile(name)) {
				// Это файл. Копируем его в базовую директорию.
				fs.rename(Path.join(path, name), Path.join(baseDir, fileNumber.toString() + name.slice(name.lastIndexOf('.'), name.length)));
				fileNumber = fileNumber + 1;
			} else {
				// Это директория. Рекурсивно вызываем текущую функцию.
				console.log('Processing directory ' + Path.join(path, name));
				subdirFilesCopy(Path.join(path, name));
			}
		}, callback());
	});
};


subdirFilesCopy(baseDir, function() {

	fs.readdir(baseDir, (err, stats) => {
		if (err) throw err;

		stats.forEach((name) => {
			if (!isFile(name)) {
				fs.rmdir(name);
			}
		});
	});

});