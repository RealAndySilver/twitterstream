var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var data = require('./data');
var schema = require('./schema');
var client = new Twitter({

  /*consumer_key: '9DQU6wdH1mt9vdI7lFit2G3cF',
  consumer_secret: 'YKtdJnQ6cQbhg9SAno1EfAZLVUuLYaOVM1v2ODBcfW8vE0kQeK',
  access_token_key: '56472418-SN5Sk96CexrIlRJUloQkcVKUob0fkjtMiByMrjp3B',
  access_token_secret: '2LsQYoGpnRgyAUeGcdffoXmruZ6WBOc9UV4u9jVjiCMMl'*/

  consumer_key: 'gQpVPNgXKQ5Y2a9dcQZ8hj5tL',
  consumer_secret: 'ZRENQ6QZCvziWHjJoSoMfyHF2VsDowvF8noAL3UFx59BFHAUpL',
  access_token_key: '56472418-2vwXMEJj5Y6nzNAlsD6IVLefmkbmibNZrhDj7SQ5u',
  access_token_secret: 'Gl85KINH7os2Sq68BbRPAAaXQwL37AyD6P7IkIPGwm6im'
});
  

  
var items = data.items();
var lowCase = '';
var newDate = new Date();
var total = {tweets:0, retweets:0};
var numbers = [];
var wordsCount = {};
var indWordsCount = {};
var topWords = {time:null, words:[]};
var timerFlag = true;
var about = items.map(function(elem){return elem.twSearch}).join();
var i = 0;
var j = 0;
var keywordsArray = []; 
var words = '';
var keywordsString = '';
router.get('/', function(req, res, next) {
  	
  	//console.log(about);
	client.stream('statuses/filter', {track: about}, function(stream) {
		stream.on('data', function(tweet) {
			if(tweet.text){
				
				
				lowCase = tweet.text.toLowerCase();
				//lowCase = lowCase.replace(/'/g, ' ');//Regex for quotes
				lowCase = lowCase.replace(/\s\s+/g, '');//Regex for tabs newlines & spaces
				lowCase = lowCase.replace(/(?:https?|ftp):\/\/[\n\S]+/g,'');//Regex for http &https
				lowCase = lowCase.replace(/[^\w\s]/gi,'');//Regex for special characters
				lowCase = lowCase.replace(/\n/,'');
				lowCase = lowCase.replace(/\B@[a-z0-9_-]+/gi,'');//Regex for twitter usernames
				lowCase = lowCase.replace(/\s\s+/g,'');
				lowCase = lowCase.replace(/rt/ig,'');
				
				words = lowCase.split(/\b/);

				for(i=0; i<items.length; i++){
					if(!items[i].total){
						items[i].total = {tweets:0, retweets:0};
					}
					keywordsArray = items[i].twSearch.split(/[ ,.]+/);
					//keywordsArray = items[i].twSearch.split(',');
					for(j=0; j<keywordsArray.length; j++){
						
						if(lowCase.indexOf(keywordsArray[j])>-1){
							if(tweet.text.indexOf('RT ') == -1){
								numbers[i] = numbers[i] ? numbers[i]+1:1;
								items[i].total.tweets = numbers[i];
								//console.log('TT ',tweet.text);
							}
							else{
								items[i].total.retweets = items[i].total.retweets ? items[i].total.retweets+1:1;
								for(var m = 0; m < words.length; m++){
									wordsCount["_" + words[m]] = (wordsCount[/*"_" +*/ words[m]] || 0) + 1;
									if(!indWordsCount[items[i].id]){
										indWordsCount[items[i].id] = {}
										indWordsCount[items[i].id].wordsCount = {};
									}
									indWordsCount[items[i].id].wordsCount[/*"_" +*/ words[m]] = (indWordsCount[items[i].id].wordsCount[/*"_" +*/ words[m]] || 0) + 1;
								}
							}
							break;
						}
					}
					keywordsArray = [];
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
					words: {time:topWords.time, words:topWords.words.length > 0 ? topWords.words:[]}
				});
				
			}
		});		
		stream.on('error', function(error) {/*console.log('error: '+error)*/});
	});
	if(timerFlag){
		timerFlag = false;
		setInterval(function(){
			//var keysSorted = Object.keys(wordsCount).sort(function(a,b){return wordsCount[b]-wordsCount[a]})
			var sortable = [];
			var indSortable = [];
			var keywords = [];
			for (var word in wordsCount){
				if(	word.length>3 && data.notMeasuredWords.indexOf(word) == -1){
						sortable.push([word.replace('_',''), wordsCount[word]]);
				};
			}
			for(var item in items){
				keywords = items[item].twSearch.split(',');
				keywords = keywords.concat(data.notMeasuredWords).concat(items[item].exclude);
				if(!items[item].wordsCount)
					items[item].wordsCount = [];
				if(indWordsCount[items[item].id]){
					for (var indWord in indWordsCount[items[item].id].wordsCount){
						
						if(	indWord.length>3 && keywords.indexOf(indWord) == -1){	
							if(!indSortable[items[item].id]){
								indSortable[items[item].id] = [];
							}
							indSortable[items[item].id].push([indWord.replace('_',''), indWordsCount[items[item].id].wordsCount[indWord]]);				
						}		
					}
				}
			}
			
			for(var j=0;j<items.length;j++){
				if(indSortable[items[j].id]){
					indSortable[items[j].id].sort(function(a, b) {return b[1] - a[1]});
					//Items[trace] defines how many mostusedwords will be stored - needs to be managed in data
					indSortable[items[j].id].splice(items[j].trace, indSortable[items[j].id].length);
					items[j].mostUsedWords = {date: new Date, words:indSortable[items[j].id]};
				}
			}
			
			sortable.sort(function(a, b) {return b[1] - a[1]});
			sortable.splice(10, sortable.length);
			//console.log('Words: ',indSortable);
			topWords.words = sortable;
			topWords.time = new Date;
			sortable = [];
			wordsCount = [];
			indSortable = [];
			indWordsCount = [];
		},60000);
	}
	res.sendFile(__dirname+'/index.html');
	res.status(200);
});

module.exports = router;
