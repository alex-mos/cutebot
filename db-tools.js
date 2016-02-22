'use strict';

var fs = require('fs');
var mongo = require('mongodb').MongoClient;
var Path = require('path');


var category = 'cute'; // Имя папки, изображения из которой попадут в одноимённую коллекцию.

var url = 'mongodb://localhost:27017/cutepics';
var path = 'images/' + category;

mongo.connect(url, function(err, db) { // todo: соединение не закрыто. Разобраться как закрыть.
	if (err) throw err;

	var collection = db.collection(category);

	fs.readdir(path, (err, stats) => {
		if (err) throw err;

		stats.forEach((filename, index) => {

			collection.insert({
				index: index + 1,
				path: Path.join(path, filename)
			}, function(err, data) {
				if (err) throw err;

				console.log(JSON.stringify(data));
			});
		});

	});

});


