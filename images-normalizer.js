const fs = require('fs')
const df = require('./dir-flatten') // Использовать, если папка с изображениями имеет сложную структуру и лень вытаскивать все картинки вручную. Пример: df('images/tamasina')
const colCreator = require('./collection-creator')

fs.readdir('images', (err, items) => {
  if (err) throw err

  items.forEach(function(item) {
    if (item !== '.DS_Store') {
      colCreator(item)
    }
  })
})
