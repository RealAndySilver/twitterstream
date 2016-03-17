var express = require('express');
var router = express.Router();
var schema = require('./schema');

/* GET users listing. */
router.get('/:date/:date2?', function(req, res, next) {
	var dateNow = new Date(req.params.date);
	var dateEnd = new Date(dateNow.getTime() + (1*60*60*1000));
	if(req.params.date2){
		dateEnd = new Date(req.params.date2);
	}
	var i = 0;
	var html = '';
	var items = {};
	var total = {tweets:0,retweets:0};
	var trackTotal = {tweets:0,retweets:0};
	var minuteTotal = {tweets:0,retweets:0};
	var lastTotal = {tweets:0,retweets:0};
	var currentTotal = {tweets:0,retweets:0};
	var flagInitialValue = true;
	var firstTweetArrays = {tweets:[],retweets:[]};
	var lastTweetArrays = {tweets:[],retweets:[]};
	var finalTweetArrays = {tweets:[],retweets:[]};
	var itemsArray = [];
	var subjectObject = {
		name:'',
		totalTweets : 0,
		totalRetweets : 0,
		percent : 0,
		words : []
	};
	schema.Sample.find({date_created: {$gte:dateNow, $lte:dateEnd}, project_id:"56de705be4b088c9371bec18"})
	.exec(function(err,samples){
		if(samples.length>0){
			items.subjects = samples[0].items; 
			items.info = samples[0].info; 
			console.log(samples.length);
			html += '<html><meta charset="utf-8"><body style="font-family:Helvetica;"><div style="width:680px; margin:0 auto;">';
			for(sample in samples){
				if(sample==0){
					console.log('Yay..0',samples[sample].tweets);
					firstTweetArrays = samples[sample].tweets;
				}
				if(sample==samples.length-1){
					console.log('Yay..',sample);
					lastTweetArrays = samples[sample].tweets;
				}
			}
							//console.log(sample,'. Total: ',totalTweets);
			html += '<div style="background:pink; margin-top:10px; height:100px; width:680px;">';
			
			
			for(i=0;i<firstTweetArrays.length;i++){
				finalTweetArrays.tweets.push(lastTweetArrays[i].tweets - firstTweetArrays[i].tweets);
				finalTweetArrays.retweets.push(lastTweetArrays[i].retweets - firstTweetArrays[i].retweets);
			}

			
			total.tweets = finalTweetArrays.tweets.reduce(function(prev,current){return prev + current;});
			total.retweets = finalTweetArrays.retweets.reduce(function(prev,current){return prev + current;});
			
			for(i=0;i<items.subjects.length;i++){
				
				itemsArray.push({
					name:items.subjects[i].name,
					id: items.subjects[i].id,
					//words : items.info[i].mostUsedWords.words,
					tweetTotal: {tweets:finalTweetArrays.tweets[i], retweets:finalTweetArrays.retweets[i]},
					tweetPercent: {
							tweets: Math.round(((finalTweetArrays.tweets[i]*100) / total.tweets)*10)/10 , 
							retweets: Math.round(((finalTweetArrays.retweets[i]*100)/total.retweets)*10)/10
					},
					avatar: items.subjects[i].avatar,
					total:total,
					dateStart : dateNow,
					dateEnd: dateEnd
				});				
				//html += '<div style="width:100px; height:100px; float:left;"><img src='+samples[sample].items[item].avatar+' width="100";/></div>'	
			}
			html += '</div>';			
			html += '</div></body></html>';
			
			function compare(a,b) {
					if (b.tweetPercent.tweets < a.tweetPercent.tweets)
						return -1;
					else if (b.tweetPercent.tweets > a.tweetPercent.tweets)
						return 1;
					else 
						return 0;
				}
			itemsArray.sort(compare);
			
			//console.log('First Total: ', firstTweetArrays);
			//console.log('Last Total: ', lastTweetArrays);
			console.log('Final Total: ', finalTweetArrays);
			console.log('Total: ', total);
			console.log('Total: ', itemsArray);

			res.send(html);
			//res.json({response:samples});
		}
	});
});

module.exports = router;