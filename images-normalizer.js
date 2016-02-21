'use strict';

var fs = require('fs');

/* Модуль приведения загруженных фотографий к плоской структуре с инкрементирующимися названиями файлов */



// Очистка промежуточной директории.
var checkTempDir = function() {
	fs.access('images/tamasina', fs.W_OK, function(err) {
		if (err) {
			console.log('No access to images folder');
			return false;
		}

		fs.access('images/tamasina/_temp', fs.F_OK, function (err) {
			if (err) {
				createTempDir();
			} else {
				// Удаляем существующую временную директорию.
				fs.rmdir('images/tamasina/_temp', function() {
					console.log('Old _temp dir removed.');
					createTempDir();
				});
			}
		});
	});
};



// Создание временной директории
var createTempDir = function() {

	fs.mkdir('images/tamasina/_temp', function(err) {
		if (err) throw err;

		// Вызываем функцию копирования файлов из поддиректорий.

	});
};

checkTempDir();