'use strict';

const TelegramBot = require('node-telegram-bot-api');
const settings = require('./secret-settings');
const mongo = require('mongodb').MongoClient;

const dbURL = 'mongodb://localhost:27017/cutepics';

const token = settings.botAccessToken;
const bot = new TelegramBot(token, {polling: true});

const botan = require('botanio')(settings.botanKey);


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
					if (doc.path.slice(doc.path.lastIndexOf('.'), doc.path.length) === '.gif') {
						bot.sendDocument(message.chat.id, photo);
					} else {
						bot.sendPhoto(message.chat.id, photo);
					}
				} else {

					console.log(JSON.stringify(message));

					// botan logging
					botan.track(message, 'Message', function(err, response, body){
						console.log('err: ' + err);
						console.log(body);
					});

					// mongo logging
					var msgTime = new Date(message.date * 1000);

					logCollection.insert({
						date: message.date,
						dateReadable: msgTime.toLocaleString(),
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

		if (message.text === '/help' || message.text === '/help@cute_pic_bot') {
			bot.sendMessage(message.chat.id, 'Отправляешь /cute - получаешь картинку.');
		}

		if (message.text === '/cute' || message.text === '/cute@cute_pic_bot') {
			sendImage(message, 'cute');
		}

		if (message.text === '/tamasina' || message.text === '/tamasina@cute_pic_bot') {
			sendImage(message, 'tamasina');
		}

		if (message.text === '/dita' || message.text === '/dita@cute_pic_bot') {
			sendImage(message, 'dita');
		}

	});
});


// Часть, нужная только для того, чтобы passenger понимал, что приложение работает. @todo разобраться, как запускать его без порта
const http = require('http');

const hostname = '0.0.0.0';
const port = 3000;

http.createServer((req, res) => {

	res.writeHead(200, {
		'Content-Type': 'text/html'
	});

	res.end('<a href="https://telegram.me/cute_pic_bot">Cutebot</a> is working\n');

}).listen(port, hostname);



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
