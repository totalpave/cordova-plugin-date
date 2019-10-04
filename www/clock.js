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

const CLASS_NAME = "Clock";

// Tell cordova channel to wait on the CordovaClockReady event
// channel.waitForInitialization('onCordovaClockReady');

const ERRORS = {
   "TRUE_TIME_VALUE_NOT_READY": 0
};

// Time sync delay when the update errored out. Used when we suspect that the difference could be inaccurate and the update failed.
const TIME_SYNC_ERROR_DELAY = 60000; //1 minute

var clock = {
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
      if(!clock._updateErrorInterval) {
         clock._updateErrorInterval = window.setInterval(() => {
            clock.update(() => {
               window.clearInterval(clock._updateErrorInterval);
               clock._updateErrorInterval = null;
            }, clock._logger.log);
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
      logger && clock.setLogger(logger);
      if (typeof timeSyncDelay !== 'number' || timeSyncDelay < 0) { 
         timeSyncDelay = 600000; //10 (minutes) * 60 (seconds in a minute) * 1000 (milliseconds in a second) = 600 000
      }
      var local = localStorage.totalpave ? JSON.parse(localStorage.totalpave) : null;
      if (local && local.clock && local.clock.difference) {
         clock._difference = local.clock.difference;
      } else {
         clock._difference = null;
      }
      clock._hasCalledInit = true;
      clock.update = clock.update.bind(clock);
      // deviceready should already have been fired by the time this happens. It shouldn't be getting fired a second time.
      // document.addEventListener("deviceready", clock.update);
      document.addEventListener("resume", () => {
         clock.update(null, (error) => {
            clock._logger.log(error);
            // We failed to get new truetime value after a resume event. The time could have changed. 
            // We'll work with what we have; but, we really want a fresh real time value now.
            clock._startUpdateErrorInterval();
         });
      });
      clock._updateInterval = window.setInterval(() => {
         clock.update(null, clock._logger.log);
      }, timeSyncDelay); 
      clock.update(success, (error) => {
         // We failed to get new truetime value during init. The time could have changed since the last time the app was opened.
         // We'll work with what we have; but, we really want a fresh real time value now.
         clock._startUpdateErrorInterval();
         clock._logger.log('[ERROR] Error initializing Cordova: ' + error);
         fail && fail(error);
      });
      // clock._hasCalledInit = true;
      // channel.onCordovaReady.subscribe(function () {
      //    clock.update = clock.update.bind(clock);
      //    document.addEventListener("deviceready", clock.update);
      //    document.addEventListener("resume", clock.update);
      //    clock.update(() => {
      //       channel.onCordovaClockReady.fire();
      //    }, (error) => {
      //       utils.alert('[ERROR] Error initializing Cordova: ' + error);
      //    });
      // });
	},
   setLogger: function(logger) {
      if(logger && !logger.log) {
         //Doesn't use _logger; because, this function sets _logger.
         console.log('[ERROR] Clock.init logger parameter, if provided, must have the function "log". Defaulting to the current logger.');
         // The plugin is already setup to use console.log, so we don't need to set _logger.
      } else if(logger) {
         clock._logger = logger;
      }
   },
   update: function(success, fail) {
      if(!clock._hasCalledInit) {
         throw new Error("clock.init has not been called yet. Can not run clock.update.");
      }
      exec((milliseconds) => {
         clock._difference = new Date().getTime() - milliseconds;
         localStorage.totalpave = JSON.stringify({
            clock: {
               difference: clock._difference
            }
         });
         (typeof success === 'function') && success();
      }, fail, CLASS_NAME, "now");
   },
   getTime: function() {
      if(!clock._hasCalledInit || clock._difference === null) {
         throw new Error("clock.init has not been called yet. Can not run clock.getTime.");
      }
      return new Date().getTime() - clock._difference;
   },
   now: function() {
      return new Date(clock.getTime());
   },
   // No explicit arguments. Implicitly there is the same arguments that native JS date constructor has.
   getDate: function() {
      // Does not use the saved _difference; because, when arguments are passed in the User wants a date at a specific time rather than now.
      return new Date(...arguments);
   }
};

// Application needs to call this manually now.
// clock.init();
module.exports = clock;
