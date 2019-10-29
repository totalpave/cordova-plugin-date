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


#import "CDVTPDate.h"

@import TrueTime;

@implementation CDVTPDate

- (void)pluginInitialize
{
  [self init];
}

- (void)init
{
  self->trueTimeClient = [TrueTimeClient sharedInstance];
  // I don't know the full details behind the "why"; but, I don't think TrueTime works with hosts that don't support ipv6.
  // This holds true even if we only use ipv4.
  // time.apple.com doesn't support ipv6. TrueTime wouldn't initiate properly.
  // time.google.com supports both v4 and v6. TrueTime initiates properly.
  // port was originally for time.apple.com; but, appears to work with google anyways. 
  [self->trueTimeClient startWithPool:@[@"time.google.com"] port:123];
}

- (void)reinit:(CDVInvokedUrlCommand*)command 
{
  [self init];
}

- (void)now:(CDVInvokedUrlCommand*)command
{
  NSTimeInterval now = [[[self->trueTimeClient referenceTime] now] timeIntervalSince1970];
  NSString* value = [[NSNumber numberWithDouble:(now * 1000)] stringValue];

  // On a fresh install of an app using this plugin, opening the app without internet. The app was receiving "0" milliseconds for the date. 
  // We are updating the plugin to take this result and mimick how the Android side reacts to this scenario. Android threw exception.
  // The error message we are using was copied and pasted from TrueTime's Android library.
  if([value isEqualToString:@"0"]) {
    [self.commandDelegate sendPluginResult: [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"You need to call init() on TrueTime at least once."] callbackId: command.callbackId];
  } else {
    [self.commandDelegate sendPluginResult: [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:value] callbackId: command.callbackId];
  }
}

@end
