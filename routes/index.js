var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var data = require('./data');
var schema = require('./schema');

/*var client = new Twitter({

  consumer_key: '9DQU6wdH1mt9vdI7lFit2G3cF',
  consumer_secret: 'YKtdJnQ6cQbhg9SAno1EfAZLVUuLYaOVM1v2ODBcfW8vE0kQeK',
  access_token_key: '56472418-SN5Sk96CexrIlRJUloQkcVKUob0fkjtMiByMrjp3B',
  access_token_secret: '2LsQYoGpnRgyAUeGcdffoXmruZ6WBOc9UV4u9jVjiCMMl'

  consumer_key: 'gQpVPNgXKQ5Y2a9dcQZ8hj5tL',
  consumer_secret: 'ZRENQ6QZCvziWHjJoSoMfyHF2VsDowvF8noAL3UFx59BFHAUpL',
  access_token_key: '56472418-2vwXMEJj5Y6nzNAlsD6IVLefmkbmibNZrhDj7SQ5u',
  access_token_secret: 'Gl85KINH7os2Sq68BbRPAAaXQwL37AyD6P7IkIPGwm6im'
});*/
//twitter client
var client = {};
//Project id obtained from the project in the DB
var project_id = '';
//List of words that wont be measured. Comes from the DB
var notMeasured = '';
//Stores the last server start date
var laststart = null;
//Checks if is the first time it starts
var globalStarted = false;
//Concatenates the items keywords for twitter track
var about = '';
//Items brought from the DB
var items = [];
//Test
var items2 = [];
//Total tweets object array
var totalTweetsArray = [];
//sortable array for overall most used words
var sortable = [];
//sortable array of objects to store individual most used words
var indSortable = [];
//keywords array for excluding words
var keywords = [];
//tracking time
var tracking_time = 0;

var lowCase = '';
var newDate = new Date();
var total = {tweets:0, retweets:0};
var partial = {tweets:0, retweets:0};
var numbers = [];
var wordsCount = {};
var indWordsCount = {};
var topWords = {time:null, words:[]};
var timerFlag = true;

var i = 0;
var j = 0;
var keywordsArray = []; 
var words = '';
var keywordsString = '';

var email = 'andres.abril@iamstudio.co';



router.get('/', function(req, res, next) {
	if(globalStarted){
		showPage(req,res);
		return;
	}
	schema.Project.findOne({email:email})
	.exec(function(err,project){
		if(err){
		  	
		}
		else{
			if(project){
				client = new Twitter(project.twitterkeys);
				project_id = project.project_id;
				notMeasured = project.notmeasured;
				laststart = project.laststart_date;
				schema.Subject.find({project_id:project._id})
				.exec(function(err,subjectlist){
					if(err){
					  	
					}
					else{
						if(subjectlist.length>0){
							globalStarted = true;
							notMeasured = project.notmeasured;
							tracking_time = project.tracking_time;
							items = JSON.parse(JSON.stringify(subjectlist));
							items2 = JSON.parse(JSON.stringify(subjectlist));
							about = items.map(function(elem){return elem.twSearch}).join();
							twitterStart(req,res);
							return;
						}
						else{
							res.json({status:false, response:"No subjects found.."});
						}
					}
				
				});
			  	
			}
			else{
				res.json({status:false, response:"No project found.."});
			}
		}
	});
});
var twitterStart = function(req,res){
		//console.log(about);
		client.stream('statuses/filter', {track: about}, function(stream) {
			stream.on('data', function(tweet) {
				if(tweet.text){
					
					
					lowCase = tweet.text.toLowerCase();
					//lowCase = lowCase.replace(/'/g, ' ');//Regex for quotes
					lowCase = lowCase.replace(/\s\s+/g, '');//Regex for tabs newlines & spaces
					lowCase = lowCase.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');//Regex for http &https
					//lowCase = lowCase.replace(/\B@[a-z0-9_-]+/gi,'');//Regex for twitter usernames
					//lowCase = lowCase.replace(/[^\w\s]/gi, '');//Regex for special characters
					lowCase = lowCase.replace(/\n/,'');
					lowCase = lowCase.replace(/\s\s+/g, '');
					lowCase = lowCase.replace(/rt/ig, '');
					
					words = lowCase.split(/[ ,]+/);
					//console.log('Original: ',tweet.text);
					//console.log('Total: ',total.tweets, ' ',total.retweets);
					//console.log('Modified: ', lowCase);
					//console.log('Words: ', words);
					for(i=0; i<items.length; i++){
						
						if(!totalTweetsArray[i]){
							totalTweetsArray[i] = {tweets:0, retweets:0};
						}
						keywordsArray = items[i].twSearch.split(/[ ,.]+/);
						//keywordsArray = items[i].twSearch.split( ',');
						
						for(j=0; j<keywordsArray.length; j++){
							if(lowCase.indexOf(keywordsArray[j])>-1){
								//Is not a retweet
								if(tweet.text.indexOf('RT ') == -1){
									//console.log(keywordsArray);
									numbers[i] = numbers[i] ? numbers[i]+1:1;
									totalTweetsArray[i].tweets = numbers[i];
									total.tweets ++;
									//Iterate and save words
									for(var m = 0; m < words.length; m++){
										//Check if there are twitter usernames. If found, do not store the word.
										if(!words[m].match(/\B@[a-z0-9_-]+/gi)){
											//Save overall words
											wordsCount["_" + words[m]] = (wordsCount[/*"_" +*/ words[m]] || 0) + 1;
											if(!indWordsCount[items[i].id]){
												indWordsCount[items[i].id] = {}
												indWordsCount[items[i].id].wordsCount = {};
											}	
											//Save individual words
											indWordsCount[items[i].id].wordsCount[/*"_" +*/ words[m]] = (indWordsCount[items[i].id].wordsCount[/*"_" +*/ words[m]] || 0) + 1;
										}
									}
								}
								//It is a retweet
								else{
									totalTweetsArray[i].retweets = totalTweetsArray[i].retweets ? totalTweetsArray[i].retweets+1:1;
									total.retweets ++;
								}
								break;
							}
						}
						keywordsArray = [];
					}
					
					if(tweet.text.indexOf('RT ') == -1){
						//total.tweets ++;
					}
					else{
						//total.retweets ++;
					}
					//console.log(totalTweetsArray);
					
					res.io.sockets.volatile.emit("broadcast", {
						numbers: 0, 
						individual_tweets: totalTweetsArray,
						total:total, 
						items:items, 
						items2: items2,
						date:newDate, 
						words: {time:topWords.time, words:topWords.words.length > 0 ? topWords.words:[]},
						tracking_time:tracking_time
					});
					
				}
			});		
			stream.on('error', function(error) {console.log('error: '+error)});
		});
		if(timerFlag){
			timerFlag = false;
			
			
		setInterval(function(){
			
			schema.Project.findOne({email:email})
			.exec(function(err,project){
				if(err){
				
				}
				else{
					if(project){
						
						notMeasured = project.notmeasured;
						tracking_time = project.tracking_time;
						laststart = project.laststart_date;
						schema.Subject.find({project_id:project._id})
						.exec(function(err,subjectlist){
							if(err){
							  	
							}
							else{
								if(subjectlist.length>0){
									items = JSON.parse(JSON.stringify(subjectlist));
									about = items.map(function(elem){return elem.twSearch}).join()
						
									for (var word in wordsCount){
										if(	word.length>3 && data.notMeasuredWords.indexOf(wordsCount) == -1){
											sortable.push([word.replace('_',''), wordsCount[word]]);
										};
									}
									
									for(var item in items){
										keywords = items[item].twSearch.split(',');
										keywords = keywords.concat(data.notMeasuredWords).concat(items[item].exclude);
										
										if(!items2[item].wordsCount){
											items2[item].wordsCount = [];
										}
											
										if(indWordsCount[items[item].id]){
											for (var indWord in indWordsCount[items[item].id].wordsCount){
												if(	indWord.length>3 && keywords.indexOf(indWord) == -1){
													if(!indSortable[items[item].id]){
														indSortable[items[item].id] = [];
													}
													indSortable[items[item].id].push([indWord.replace('_',''), indWordsCount[items[item].id].wordsCount[indWord]]);
													//break;					
												}
											}
										}
									}
									
									for(var j=0;j<items.length;j++){
										if(indSortable[items[j].id]){
											indSortable[items[j].id].sort(function(a, b) {return b[1] - a[1]});
											//Items[trace] defines how many mostusedwords will be stored - needs to be managed in data
											indSortable[items[j].id].splice(items[j].trace, indSortable[items[j].id].length);
											//items[j].mostUsedWords = {date: new Date, words:indSortable[items[j].id]};
											items2[j].mostUsedWords = {date: new Date, words:indSortable[items[j].id]};
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
									keywords = '';
									
									/*
new schema.Sample({
										project_id: project._id,
										date_created: new Date,
										items: items,
										info:items2,
										tweets: totalTweetsArray,
									}).save();
*/
								}
							}
						});
					}
				}
			});
			
		},tracking_time*60000);

	}
		showPage(req,res);
}
var showPage = function(req,res){
	res.sendFile(__dirname+'/index2.html');
	res.status(200);
};
module.exports = router;
