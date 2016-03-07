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
  var wordsCount = {};
  var topWords = [];
router.get('/', function(req, res, next) {
  	var about = items.map(function(elem){return elem.twSearch}).join();
  	var i = 0;
  	var j = 0;
  	var searchArray = []; 
  	var words = '';
  	//console.log(about);
	client.stream('statuses/filter', {track: about}, function(stream) {
		stream.on('data', function(tweet) {
			if(tweet.text){
				
				
				lowCase = tweet.text.toLowerCase();
				//lowCase = lowCase.replace(/'/g, ' ');//Regex for quotes
				lowCase = lowCase.replace(/\s\s+/g, '');//Regex for tabs newlines & spaces
				lowCase = lowCase.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');//Regex for http &https
				lowCase = lowCase.replace(/[^\w\s]/gi, '');//Regex for special characters
				lowCase = lowCase.replace(/\n/,'');
				lowCase = lowCase.replace(/\B@[a-z0-9_-]+/gi,'');
				lowCase = lowCase.replace(/\s\s+/g, '');
				lowCase = lowCase.replace(/rt/ig, '');
				
				words = lowCase.split(/\b/);

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
								for(var m = 0; m < words.length; m++){
									//words[m] = words.replace(,);
									wordsCount["_" + words[m]] = (wordsCount["_" + words[m]] || 0) + 1;
								}
								items[i].total.retweets = items[i].total.retweets ? items[i].total.retweets+1:1;
							}
						}
					}
				}
				//console.log('Words ',words);
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
					words: topWords.length > 0 ? topWords:[]
				});
				
			}
		});		
		stream.on('error', function(error) {/*console.log('error: '+error)*/});
	});
	setInterval(function(){
		//var keysSorted = Object.keys(wordsCount).sort(function(a,b){return wordsCount[b]-wordsCount[a]})
		var sortable = [];
		for (var word in wordsCount){
			if(	word.length>3 	&& 
				word!= '_of' 	&&
				word!= '_is' 	&&
				word!= '_and' 	&&
				word!= '_the' 	&&
				word!= '_in' 	&&
				word!= '_on' 	&&
				word!= '_we' 	&&
				word!= '_if' 	&&
				word!= '_has' 	&&
				word!= '_at' 	&&
				word!= '_but' 	&&
				word!= '_why' 	&&
				word!= '_our' 	&&
				word!= '_as' 	&&
				word!= '_its' 	&&
				word!= '_be' 	&&
				word!= '_do' 	&&
				word!= '_he' 	&&
				word!= '_she' 	&&
				word!= '_her' 	&&
				word!= '_it' 	&&
				word!= '_me' 	&&
				word!= '_an' 	&&
				word!= '_so' 	&&
				word!= '_to' 	&&
				word!= '_than'	&&
				word!= '_for' 	&&
				word!= '_you' 	&&
				word!= '_his' 	&&
				word!= '_him' 	&&
				word!= '_im' 	&&
				word!= '_who' 	&&
				word!= '_are' 	&&
				word!= '_this'	&&
				word!= '_by' 	&&
				word!= '_with' 	&&
				word!= '_will' 	&&
				word!= '_http' 	&&
				word!= '_wont' 	&&
				word!= '_they' 	&&
				word!= '_them' 	&&
				word!= '_that' 	&&
				word!= '_what' 	&&
				word!= '_did' 	&&
				word!= '_too' 	&&
				word!= '_was' 	&&
				word!= '_had' 	&&
				//word!= '_can' &&
				//word!= '_cant' &&
				word!= '_ ' &&
				word!= '_  ' ){
					
					sortable.push([word.replace('_',''), wordsCount[word]]);
				
			}
		}
		sortable.sort(function(a, b) {return b[1] - a[1]});
		sortable.splice(10, sortable.length);
		topWords = sortable;
		sortable = [];
		wordsCount = [];
		//console.log('Words Count: ',sortable);
	},10000);
	res.sendFile(__dirname+'/index.html');
	res.status(200);
});

module.exports = router;
