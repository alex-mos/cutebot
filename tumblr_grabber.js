const tumblr = require('tumblr')
const settings = require('./secret-settings')

var oauth = {
  consumer_key: settings.tumblr_consumer_key,
  consumer_secret: settings.tumblr_consumer_secret,
  token: 'OAuth Access Token',
  token_secret: 'OAuth Access Token Secret'
}

var blog = new tumblr.Blog('football-collection-hqs.tumblr.com', oauth)

blog.text({limit: 2}, (err, response) => {
  if (err) throw err
  console.log(response.posts)
})

var user = new tumblr.User(oauth)

user.info((err, response) => {
  if (err) throw err
  console.log(response.user)
})
