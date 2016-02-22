'use strict';

var TelegramBot = require('node-telegram-bot-api');
var settings = require('./secret-settings');
var mongo = require('mongodb').MongoClient;

var dbURL = 'mongodb://localhost:27017/cutepics';

var token = settings.botAccessToken;
var bot = new TelegramBot(token, {polling: true});

var botan = require('botanio')(settings.botanToken);

mongo.connect(dbURL, function(err, db) {
	if (err) throw err;


	var sendImage = function(message, imageCollection) {
		var collection = db.collection(imageCollection);
		var logCollection = db.collection('logs');

		collection.count({}, function(err, count){
			var cursor = collection.find(
				{
					index: Math.ceil(Math.random() * count)
				}
			);

			cursor.each(function(err, doc) {
				if (err) throw err;

				if (doc != null) {
					var photo = doc.path;
					bot.sendPhoto(message.chat.id, photo);
				} else {

					// botan logging
					//console.log(message.from.id);
					//botan.track(settings.botanKey, message.from.id, message, message.text);
					botan.track(message, 'Start');

					// mongo logging
					logCollection.insert({
						date: message.date,
						username: message.chat.username,
						chatType: message.chat.type,
						text: message.text
					});

					//console.log(message.date, message.chat.username + ', ' + message.chat.type + ', ' + message.text);
					//bot.sendMessage(chatId, 'Что-то пошло не так. Бот ушёл на перерыв.');
				}
			});
		});
	};



	bot.on('message', function (message) {

		if (message.text === '/help') {
			bot.sendMessage(message.chat.id, 'Всё просто. Отправляешь /cute - получаешь картинку.');
		}

		if (message.text === '/cute') {
			sendImage(message, 'cute');
		}

		if (message.text === '/tamasina') {
			sendImage(message, 'tamasina');
		}

	});
});



// message example

// var example = {
//	message_id: 33,
//	from: {
//		id: 165698,
//		first_name: 'Alexander',
//		last_name: 'Mospan',
//		username: 'alexander_mospan'
//	},
//	chat: {
//		id: 165698,
//		first_name: 'Alexander',
//		last_name: 'Mospan',
//		username: 'alexander_mospan',
//		type: 'private'
//	},
//	date: 1456145656,
//	text: 'asdf'
//};