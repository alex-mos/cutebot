'use strict'

const fs = require('fs')
const mongo = require('mongodb').MongoClient
const Path = require('path')

const url = 'mongodb://localhost:27017/cutepics'

var createCollectionByDir = (category) => { // category - имя папки, изображения из которой попадут в одноимённую коллекцию.
	var path = 'images/' + category

	mongo.connect(url, function(err, db) {
		if (err) throw err

		var collection = db.collection(category)

		// Очищаем коллекцию
		collection.remove({}, function() {

			fs.readdir(path, (err, stats) => {
				if (err) throw err

				stats.forEach((filename, index) => {

					collection.insert({
						index: index + 1,
						path: Path.join(path, filename)
					}, function(err, data) {
						if (err) throw err

						console.log(JSON.stringify(data))
					})
				})
			})
		})
	})
}

module.exports = createCollectionByDir
