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


#import "CDVClock.h"

@import TrueTime;

@implementation CDVClock

- (void)pluginInitialize
{
  self->trueTimeClient = [TrueTimeClient sharedInstance];
  [self->trueTimeClient startWithPool:@[@"time.apple.com"] port:123];
}

- (void)now:(CDVInvokedUrlCommand*)command
{
  [self.commandDelegate sendPluginResult: [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString: [[[self->trueTimeClient referenceTime] now] timeIntervalSince1970]] callbackId: command.callbackId];
}

@end
