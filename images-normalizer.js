'use strict';

var df = require('./dir-flatten'); // Использовать, если папка с изображениями имеет сложную структуру и лень вытаскивать все картинки вручную.
var colCreator = require('./collection-creator');


colCreator('cute');
colCreator('dita');
colCreator('tamasina');
//df('images/tamasina');