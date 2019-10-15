/*
   Copyright 2019 Total Pave Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var exec = require('cordova/exec'),
   channel = require('cordova/channel'),
   utils = require('cordova/utils');

const CLASS_NAME = "TPDate";

// Tell cordova channel to wait on the CordovaDateReady event
// channel.waitForInitialization('onCordovaDateReady');

const ERRORS = {
   "TRUE_TIME_VALUE_NOT_READY": 0
};

// Time sync delay when the update errored out. Used when we suspect that the difference could be inaccurate and the update failed.
const TIME_SYNC_ERROR_DELAY = 60000; //1 minute

var date = {
   // The different in millisecond between JS time and native time. There will be a marginal error due to time spent on the Cordova Bridge and JS between running new Date() and setting _difference.
   // This marginal error should be rather small though. Like a couple of milliseconds.
   _logger: console,
   _difference: null,
   ERRORS: ERRORS,
   _updateErrorInterval: null,
   _updateInterval: null,
   _hasCalledInit: false,
   _messageToCode: function(error) {
      switch(error) {
         case "You need to call init() on TrueTime at least once.":
            return ERRORS.TRUE_TIME_VALUE_NOT_READY;
         default: 
            return error;
      }
   },
   _startUpdateErrorInterval: function() { 
      if(!date._updateErrorInterval) {
         date._updateErrorInterval = window.setInterval(() => {
            date.update(() => {
               window.clearInterval(date._updateErrorInterval);
               date._updateErrorInterval = null;
            }, date._logger.log);
         }, TIME_SYNC_ERROR_DELAY);
      }
   },
   reinit: function(success, fail) {
      exec(success, fail, CLASS_NAME, "reinit");
   },
   // success/fail are required callbacks. 
   // logger is an optional parameter to change the logger the plugin will use. logger, if provided, must have the "log" function"
   // timeSyncDelay is the number of milliseconds between every time sync. Defaults to 10 minutes.
	init: function(success, fail, logger, timeSyncDelay) {
      logger && date.setLogger(logger);
      if (typeof timeSyncDelay !== 'number' || timeSyncDelay < 0) { 
         timeSyncDelay = 600000; //10 (minutes) * 60 (seconds in a minute) * 1000 (milliseconds in a second) = 600 000
      }
      var local = localStorage.totalpave ? JSON.parse(localStorage.totalpave) : null;
      if (local && local.date && local.date.difference) {
         date._difference = local.date.difference;
      } else {
         date._difference = null;
      }
      date._hasCalledInit = true;
      date.update = date.update.bind(date);
      // deviceready should already have been fired by the time this happens. It shouldn't be getting fired a second time.
      // document.addEventListener("deviceready", date.update);
      document.addEventListener("resume", () => {
         date.update(null, (error) => {
            date._logger.log(error);
            // We failed to get new truetime value after a resume event. The time could have changed. 
            // We'll work with what we have; but, we really want a fresh real time value now.
            date._startUpdateErrorInterval();
         });
      });
      date._updateInterval = window.setInterval(() => {
         date.update(null, date._logger.log);
      }, timeSyncDelay); 
      date.update(success, (error) => {
         // We failed to get new truetime value during init. The time could have changed since the last time the app was opened.
         // We'll work with what we have; but, we really want a fresh real time value now.
         date._startUpdateErrorInterval();
         date._logger.log('[ERROR] Error initializing Cordova: ' + error);
         fail && fail(error);
      });
      // date._hasCalledInit = true;
      // channel.onCordovaReady.subscribe(function () {
      //    date.update = date.update.bind(date);
      //    document.addEventListener("deviceready", date.update);
      //    document.addEventListener("resume", date.update);
      //    date.update(() => {
      //       channel.onCordovaDateReady.fire();
      //    }, (error) => {
      //       utils.alert('[ERROR] Error initializing Cordova: ' + error);
      //    });
      // });
	},
   setLogger: function(logger) {
      if(logger && !logger.log) {
         //Doesn't use _logger; because, this function sets _logger.
         console.log('[ERROR] Date.init logger parameter, if provided, must have the function "log". Defaulting to the current logger.');
         // The plugin is already setup to use console.log, so we don't need to set _logger.
      } else if(logger) {
         date._logger = logger;
      }
   },
   update: function(success, fail) {
      if(!date._hasCalledInit) {
         throw new Error("date.init has not been called yet. Can not run date.update.");
      }
      exec((milliseconds) => {
         date._difference = new Date().getTime() - milliseconds;
         localStorage.totalpave = JSON.stringify({
            date: {
               difference: date._difference
            }
         });
         (typeof success === 'function') && success();
      }, fail, CLASS_NAME, "now");
   },
   getTime: function() {
      if(!date._hasCalledInit || date._difference === null) {
         throw new Error("date.init has not been called yet. Can not run date.getTime.");
      }
      return new Date().getTime() - date._difference;
   },
   now: function() {
      return new Date(date.getTime());
   },
   // No explicit arguments. Implicitly there is the same arguments that native JS date constructor has.
   getDate: function() {
      // Does not use the saved _difference; because, when arguments are passed in the User wants a date at a specific time rather than now.
      return new Date(...arguments);
   }
};

// Application needs to call this manually now.
// date.init();
module.exports = date;
