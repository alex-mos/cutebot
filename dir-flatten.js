const fs = require('fs')
const Path = require('path')

/*** Модуль приведения загруженных фотографий к плоской структуре с инкрементирующимися названиями файлов todo: оформить жсДоком ***/
var fileNumber = 1
var exclude = ['.DS_Store']

// Проверка, является ли объект в директорией файлом. (факапится, если в названии директории есть точка. todo: придумать что-нибудь получше.)
var isFile = (name) => {
	return name.indexOf('.') > -1
}

// Удаление всех директорий второго уровня.
var removeEmptyDirs = function(path) {

	fs.readdir(path, (err, stats) => {
		if (err) throw err

		stats.forEach((name) => {
			if (!isFile(name)) {
				fs.rmdir(Path.join(path, name), function(err) {
					if (err) throw err
				})
			}
		})
	})
}

// Вытаскивание всех файлов из вложенных директорий и их переименование в последовательность чисел.
// todo: Портит часть файлов в базовой директории, если они есть.
var dirFlatten = function(path) {

	var baseDir = path

	var subdirFilesCopy = (path) => {

		fs.readdir(path, (err, stats) => {
			if (err) throw err

			stats.forEach((name, index) => {
				if (exclude.indexOf(name) != -1) {
					fs.unlink(Path.join(path, name))
					console.log('deleted file ' + name)
				} else if (isFile(name)) {
					// Это файл. Копируем его в базовую директорию.
					fs.rename(Path.join(path, name), Path.join(baseDir, fileNumber.toString() + name.slice(name.lastIndexOf('.'), name.length)))
					fileNumber = fileNumber + 1
				} else {
					// Это директория. Рекурсивно вызываем текущую функцию.
					console.log('Processing directory ' + Path.join(path, name))
					subdirFilesCopy(Path.join(path, name))
				}
			})

			removeEmptyDirs(Path.join(path))
		})
	}

	subdirFilesCopy(baseDir)
}


module.exports = dirFlatten
