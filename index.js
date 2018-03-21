'use strict'; 

const Alexa= require("alexa-sdk");
const startEc2 = require('./functions/startEc2Instances');
const stopEc2 = require('./functions/stopEc2Instances')
const getRegion = require('./functions/regions')

// Constants
//var constants = require('./constants/constants');
const exitSpeech = `Thank you!`;
let instances =['i-0000488283abd1207'];

exports.handler = function(event, context, callback){
  const alexa = Alexa.handler(event, context);
  
  alexa.appId = 'amzn1.ask.skill.e6136043-2988-44b8-b99b-883713cbd7b1';
  //alexa.dynamoDBTableName = constants.dynamoDBTableName;

  // Register State handlers
  alexa.registerHandlers(handlers);

  alexa.execute();
};

const handlers = {

  'LaunchRequest' : function() {
    this.emit(':ask', `Welcome to the marx systems operations, How can I help you`, `Please repeat`);
  },

  'TurnOnIntent' : function() {
    const self=this;
    let awsRegion  = this.event.request.intent.slots.region.resolutions.resolutionsPerAuthority[0].values[0].value.id;
    let RegionName = this.event.request.intent.slots.region.value
    console.log ("aws region = ", awsRegion)
    console.log ("Region Name = ", RegionName)

    startEc2(instances, awsRegion, function(err,data){
      console.log("Data : ", data)
      if (err) {
          self.emit(':tell', ` Failed to start instances, probably already running`);
      } else {
          self.emit(':tell', `Turning on your instances in Oregon`);
      }
    });
  },

  'TurnOffIntent' : function() {
    const self=this;
    let awsRegion = (this.event.request.intent.slots.region.resolutions.resolutionsPerAuthority[0].values[0].value.id);
    let RegionName = this.event.request.intent.slots.region.value
    console.log ("aws region = ", awsRegion)
    console.log ("Region Name = ", RegionName)

    stopEc2(instances, awsRegion, function(err,data){
      console.log("Data : ", data)
      if (err) {
          self.emit(':tell', ` Failed to stop the instances, they are probably already stopped`)
      } else {
          self.emit(':tell', `Turning off your instances in Oregon`);
      }
    });
  },

  'AMAZON.YesIntent' : function() {
    
    this.emit(':tell', `Got to the yes intent`);
    //this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent' : function() {
    // emit a tell, but keep the session open.
    
    this.emit(':tell', `Got to the help intent`);
  },

  'AMAZON.NoIntent' : function() {
    
    this.emit(':tell', `You have entered the no intent`);
  },

  'AMAZON.CancelIntent' : function() {
    
    this.emit(':tell', `you have entered the cancel intent`);
  },

  'AMAZON.StopIntent' : function() {
    
    this.emit(':tell', `you have entered the stop intent`);
  },

  'Unhandled' : function() {
    
    //this.emit(':saveState', true);
    this.emit(':tell', `you entered the unhandled intent`);
  },
 
  'SessionEndedRequest': function () {
    
    // Force State Save When User Times Out
    //this.emit(':saveState', true);
    this.emit(':tell', `you have entered the Session Ended Request`);
  },
}