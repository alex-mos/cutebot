'use strict';

var TelegramBot = require('node-telegram-bot-api');
var settings = require('./secret-settings');
var mongo = require('mongodb').MongoClient;

var dbURL = 'mongodb://localhost:27017/cutepics';

var token = settings.botAccessToken;
var bot = new TelegramBot(token, {polling: true});

mongo.connect(dbURL, function(err, db) {
	if (err) throw err;


	bot.on('message', function (msg) {

		if (msg.text === '/cute') {

			var chatId = msg.chat.id;

			var collection = db.collection('cute');

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
						bot.sendPhoto(chatId, photo);
					} else {
						//bot.sendMessage(chatId, 'Что-то пошло не так. Бот ушёл на перерыв.');
					}
				});
			});
		}
	});
});







// message example
var example = {
	message_id: 33,
	from: {
		id: 165698,
		first_name: 'Alexander',
		last_name: 'Mospan',
		username: 'alexander_mospan'
	},
	chat: {
		id: 165698,
		first_name: 'Alexander',
		last_name: 'Mospan',
		username: 'alexander_mospan',
		type: 'private'
	},
	date: 1456145656,
	text: 'asdf'
};






// Matches /echo [whatever]
//bot.onText(/\/echo (.+)/, function (msg, match) {
//	var fromId = msg.from.id;
//	var resp = match[1];
//	bot.sendMessage(fromId, resp);
//});