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

package com.totalpave.clock;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.LOG;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.IOException;

import com.instacart.library.truetime.TrueTime;

public class Clock extends CordovaPlugin {
    private static final String LOG_TAG = "TotalPaveClock";
    private static final String DEFAULT_NTP_HOST = "pool.ntp.org";
    private String serviceName = "Clock";

    @Override
    protected void pluginInitialize() {
      cordova.getThreadPool().execute(new Runnable() {
          public void run() {
            try {
              // int myInt = 0;
              // if (false) {
              //   throw new IOException();
              // }
              TrueTime.build().initialize();
              TrueTime.withNtpHost(DEFAULT_NTP_HOST);
            } catch(IOException e) {
              LOG.e(LOG_TAG, "Failed to initialize TrueTime.", e);
            }
          }
      });
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        // cordova.getActivity().runOnUiThread(new Runnable() {

        // Returns the number of milliseconds as a string since January 1, 1970, 00:00:00 GMT from right now.
        if (action.equals("now")) {
          // We could convert long to int; but, there's the question of possibly lossy conversion. So instead of thinking about that, why not just use string?
          callbackContext.success(Long.toString(TrueTime.now().getTime()));
          return true;
        }
        
        return false;
    }
}
