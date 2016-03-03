var express = require('express');
var router = express.Router();
var Twitter = require('twitter');


var client = new Twitter({
  consumer_key: '9DQU6wdH1mt9vdI7lFit2G3cF',
  consumer_secret: 'YKtdJnQ6cQbhg9SAno1EfAZLVUuLYaOVM1v2ODBcfW8vE0kQeK',
  access_token_key: '56472418-SN5Sk96CexrIlRJUloQkcVKUob0fkjtMiByMrjp3B',
  access_token_secret: '2LsQYoGpnRgyAUeGcdffoXmruZ6WBOc9UV4u9jVjiCMMl'
});
  var numTweets1 = 0;
  var numTweets2 = 0;
  var about = ['trump','hillary'];
  var lowCase = '';
  var strRes = [];
  var newDate = new Date();
/*
client.stream('statuses/filter', {track: about.join()}, function(stream) {
	stream.on('data', function(tweet) {
		if(tweet.text){
			
			lowCase = tweet.text.toLowerCase();
			if(lowCase.indexOf(about[0])>-1){
				numTweets1 += 1; 
			}
			if(lowCase.indexOf(about[1])>-1){
				numTweets2 += 1;
			}
			

			console.log('Tweets about ',about, ' : ',numTweets1,' ',numTweets2);
		//console.log(tweet.text);
			
		}
	});
	
	stream.on('error', function(error) {
		console.log('ERROR!!!!!!!!!')
		throw error;
	});
});
*/

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });

	client.stream('statuses/filter', {track: about.join()}, function(stream) {
		stream.on('data', function(tweet) {
			if(tweet.text){
				
				lowCase = tweet.text.toLowerCase();
				if(lowCase.indexOf(about[0])>-1){
					numTweets1 += 1; 
				}
				if(lowCase.indexOf(about[1])>-1){
					numTweets2 += 1;
				}
				
				res.io.sockets.volatile.emit("socketToMe", {data1:numTweets1, data2:numTweets2, items:about, date:newDate});
				//console.log('Tweets about ',about, ' : ',numTweets1,' ',numTweets2);
			//console.log(tweet.text);
			}
		});
		
		stream.on('error', function(error) {
			console.log('ERROR!!!!!!!!!')
			//throw error;
		});
	});
	res.sendFile(__dirname+'/index.html');
	res.status(200);
  
});

module.exports = router;
