var express = require('express');
var router = express.Router();
var Twitter = require('twitter');


var client = new Twitter({
/*
  consumer_key: '9DQU6wdH1mt9vdI7lFit2G3cF',
  consumer_secret: 'YKtdJnQ6cQbhg9SAno1EfAZLVUuLYaOVM1v2ODBcfW8vE0kQeK',
  access_token_key: '56472418-SN5Sk96CexrIlRJUloQkcVKUob0fkjtMiByMrjp3B',
  access_token_secret: '2LsQYoGpnRgyAUeGcdffoXmruZ6WBOc9UV4u9jVjiCMMl'
*/
   consumer_key: 'gQpVPNgXKQ5Y2a9dcQZ8hj5tL',
  consumer_secret: 'ZRENQ6QZCvziWHjJoSoMfyHF2VsDowvF8noAL3UFx59BFHAUpL',
  access_token_key: '56472418-2vwXMEJj5Y6nzNAlsD6IVLefmkbmibNZrhDj7SQ5u',
  access_token_secret: 'Gl85KINH7os2Sq68BbRPAAaXQwL37AyD6P7IkIPGwm6im'
});
  
  var subject1 = {
	  name : 'Donald Trump',
	  twSearch : 'trump,realdonaldtrump',
	  avatar:'https://pbs.twimg.com/profile_images/1980294624/DJT_Headshot_V2.jpg'
  };
  var subject2 = {
	  name : 'Hillary Clinton',
	  twSearch : 'clinton,hillaryclinton',
	  avatar:'https://pbs.twimg.com/profile_images/705242833637265408/I4RZo3K4.jpg'
  }; 
  var subject3 = {
	  name : 'Mitt Romney',
	  twSearch : 'romney,MittRomney',
	  avatar:'https://pbs.twimg.com/profile_images/563745525522890752/x3xEIlYL.jpeg'
  };
  var subject4 = {
	  name : 'Bernie Sanders',
	  twSearch : 'sanders,SenSanders',
	  avatar:'https://pbs.twimg.com/profile_images/649202007723499524/lBGS6rs6.png'
  };
  var subject5 = {
	  name : 'Ted Cruz',
	  twSearch : 'ted cruz,tedcruz',
	  avatar:'https://pbs.twimg.com/profile_images/478888071518093312/Rdiy3UhY.jpeg'
  };
  var subject6 = {
	  name : 'Marco Rubio',
	  twSearch : 'marco rubio,marcorubio',
	  avatar:'https://pbs.twimg.com/profile_images/676932291885727744/02ydNw0Y.jpg'
  };
  var subject7 = {
	  name : 'Barack Obama',
	  twSearch : 'barac obama,obama,BarackObama',
	  avatar:'https://pbs.twimg.com/profile_images/451007105391022080/iu1f7brY.png'
  };
  var subject8 = {
	  name : 'Jimmy Fallon',
	  twSearch : 'jimmy fallon,jimmyfallon',
	  avatar:'https://pbs.twimg.com/profile_images/1194467116/new-resize-square.jpg'
  };
  
  var items = [subject1,subject2, subject3, subject4, subject5, subject6, /*subject7, subject8*/];
  var lowCase = '';
  var newDate = new Date();
  var total = {tweets:0, retweets:0};
  var numbers = [];

router.get('/', function(req, res, next) {
  	var about = items.map(function(elem){return elem.twSearch}).join();
  	var i = 0;
  	var j = 0;
  	var searchArray = []; 
  	//console.log(about);
	client.stream('statuses/filter', {track: about}, function(stream) {
		stream.on('data', function(tweet) {
			if(tweet.text){
				
				
				lowCase = tweet.text.toLowerCase();
				
				for(i=0; i<items.length; i++){
					if(!items[i].total){
						items[i].total = {tweets:0, retweets:0};
					}
					searchArray = items[i].twSearch.split(',');
					for(j=0; j<searchArray.length; j++){
						
						if(lowCase.indexOf(searchArray[j])>-1){
							if(tweet.text.indexOf('RT ') == -1){
								numbers[i] = numbers[i] ? numbers[i]+1:1;
								items[i].total.tweets = numbers[i];
								break;
							}
							else{
								items[i].total.retweets = items[i].total.retweets ? items[i].total.retweets+1:1;
							}
						}
					}
				}
				i = 0;
				j = 0;
				if(tweet.text.indexOf('RT ') == -1){
					total.tweets +=1;
				}
				else{
					total.retweets +=1;
				}
				
				res.io.sockets.volatile.emit("broadcast", {
					numbers: numbers, 
					total:total, 
					items:items, 
					date:newDate, 
				});
				
			}
		});		
		stream.on('error', function(error) {/*console.log('error: '+error)*/});
	});
	res.sendFile(__dirname+'/index.html');
	res.status(200);
});

module.exports = router;
