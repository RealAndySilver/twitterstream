//////////////////////////////////
//Dependencies////////////////////
//////////////////////////////////
var mongoose = require('mongoose');
var express = require('express');
//////////////////////////////////
//End of Dependencies/////////////
//////////////////////////////////

//////////////////////////////////
//MongoDB Connection /////////////
//////////////////////////////////
//mongooseMain = mongoose.createConnection("CONSTANTS.ALL.MONGOLAB_KEYS.DEV");

//Production
//We check if we are in testmode and point to the right server
mongooseMain = mongoose.createConnection("mongodb://iAmUser:iAmStudio1@ds023408.mlab.com:23408/tweetmeter");

//////////////////////////////////
//Project Schema////////////////////
//////////////////////////////////
var ProjectSchema= new mongoose.Schema({
	email: {type: String, required: true,unique: false,},
	projectname: {type: String, required: true,unique: false,},
	twitterkeys: {type: Object, required: false,unique: false,},
	notmeasured: {type: Array},
	date_created: {type: Date, default: new Date()},
	laststart_date: {type: Date},
}),
	Project= mongooseMain.model('Project',ProjectSchema);
	exports.Project = Project;
//////////////////////////////////
//End of Admin Schema/////////////
//////////////////////////////////

var SubjectSchema= new mongoose.Schema({
	id: {type: String, required: true,unique: true,},
	name: {type: String, required: true,unique: false,},
	project_id: {type: String, required: true,unique: false,},
	twittername: {type: String, required: false,unique: false,},
	twsearch: {type: String, required: false,unique: false,},
	avatar: {type: String},
	exclude: {type: Array},
	trace: {type: Number},
	total: {type: Object},
}),
	Subject= mongooseMain.model('Subject',SubjectSchema);
	exports.Subject = Subject;

var SampleSchema= new mongoose.Schema({
	project_id: {type: String, required: true,unique: false,},
	date_created: {type: Date, default: new Date()},
	items:  {type: Object},
	info:  {type: Object},
	tweets: {type: Array},
}),
	Sample= mongooseMain.model('Sample',SampleSchema);
	exports.Sample = Sample;