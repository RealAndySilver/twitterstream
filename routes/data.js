var express = require('express');

exports.items = function(){
	var subject1 = {
	  id: 'donaldtrump',
	  name : 'Donald Trump',
	  twSearch : 'trump,realdonaldtrump',
	  avatar:'https://pbs.twimg.com/profile_images/1980294624/DJT_Headshot_V2.jpg',
	  exclude: ['trumps','donald'],
	  trace:10
  };
  var subject2 = {
	  id: 'hillaryclinton',
	  name : 'Hillary Clinton',
	  twSearch : 'hillary,hillaryclinton',
	  avatar:'https://pbs.twimg.com/profile_images/705242833637265408/I4RZo3K4.jpg',
	  exclude: ['clinton'],
	  trace:10
  }; 
  var subject3 = {
	  id: 'mittromney',
	  name : 'Mitt Romney',
	  twSearch : 'romney,MittRomney',
	  avatar:'https://pbs.twimg.com/profile_images/563745525522890752/x3xEIlYL.jpeg',
	  exclude: ['mitt'],
	  trace:10
  };
  var subject4 = {
	  id: 'berniesanders',
	  name : 'Bernie Sanders',
	  twSearch : 'sanders,SenSanders',
	  avatar:'https://pbs.twimg.com/profile_images/649202007723499524/lBGS6rs6.png',
	  exclude: ['bernie'],
	  trace:10
  };
  var subject5 = {
	  id: 'tedcruz',
	  name : 'Ted Cruz',
	  twSearch : 'ted cruz,tedcruz',
	  avatar:'https://pbs.twimg.com/profile_images/478888071518093312/Rdiy3UhY.jpeg',
	  exclude: ['cruz'],
	  trace:10
  };
  var subject6 = {
	  id: 'marcorubio',
	  name : 'Marco Rubio',
	  twSearch : 'marco rubio,marcorubio',
	  avatar:'https://pbs.twimg.com/profile_images/676932291885727744/02ydNw0Y.jpg',
	  exclude: ['marco','rubio'],
	  trace:10
  };
  var subject7 = {
	  id: 'barackobama',
	  name : 'Barack Obama',
	  twSearch : 'barac obama,obama,BarackObama',
	  avatar:'https://pbs.twimg.com/profile_images/451007105391022080/iu1f7brY.png',
	  exclude: [],
	  trace:10
  };
  var subject8 = {
	  id: 'jimmyfallon',
	  name : 'Jimmy Fallon',
	  twSearch : 'jimmy fallon,jimmyfallon',
	  avatar:'https://pbs.twimg.com/profile_images/1194467116/new-resize-square.jpg',
	  exclude: [],
	  trace:10
  };
  return [subject1,subject2, subject3, subject4, subject5, subject6, /*subject7, subject8*/];
};

exports.notMeasuredWords =  [
		'of' 	,
		'is' 	,
		'and' 	,
		'the' 	,
		'isnt' 	,
		'arent' ,
		'says' 	,
		'in' 	,
		'on' 	,
		'we' 	,
		'if' 	,
		'has' 	,
		'at' 	,
		'about' ,
		'but' 	,
		'why' 	,
		'our' 	,
		'as' 	,
		'its' 	,
		'be' 	,
		'do' 	,
		'he' 	,
		'she' 	,
		'her' 	,
		'it' 	,
		'me' 	,
		'an' 	,
		'so' 	,
		'all' 	,
		'to' 	,
		'than'	,
		'for' 	,
		'you' 	,
		'your' 	,
		'dont'	,
		'youre'	,
		'his' 	,
		'him' 	,
		'im' 	,
		'ive' 	,
		'who' 	,
		'are' 	,
		'this'	,
		'by' 	,
		'with' 	,
		'will' 	,
		'http' 	,
		'https'	,
		'wont' 	,
		'they' 	,
		'them' 	,
		'that' 	,
		'what' 	,
		'did' 	,
		'too' 	,
		'was' 	,
		'had' 	,
		'put' 	,
		'from' 	,
		'would'	,
		'have'	,
		//'can' ,
		//'cant' ,
		' ' 	,
		'  ' 
	];