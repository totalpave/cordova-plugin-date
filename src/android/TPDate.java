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

package com.totalpave.tpdate;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.LOG;

import org.json.JSONArray;
import org.json.JSONException;

import java.io.IOException;

import com.instacart.library.truetime.TrueTime;

public class TPDate extends CordovaPlugin {
    private static final String LOG_TAG = "TotalPaveTPDate";
    // I don't know the full details behind the "why"; but, I don't think TrueTime works with hosts that don't suppirt ipv6.
    // This holds true even if we only use ipv4.
    // time.apple.com (originally used in the iOS code) doesn't support ipv6. TrueTime wouldn't initiate properly.
    // time.google.com supports both v4 and v6. TrueTime initiates properly.
    private static final String DEFAULT_NTP_HOST = "time.google.com";
    private String serviceName = "TPDate";

    @Override
    protected void pluginInitialize() {
      TPDate self = this;
      cordova.getThreadPool().execute(new Runnable() {
          public void run() {
            self.reinit();
          }
      });
    }

    private void reinit() {
      if (!TrueTime.isInitialized()) {
        try {
          // int myInt = 0;
          // if (false) {
          //   throw new IOException();
          // }
          // See full example at https://github.com/instacart/truetime-android/blob/master/app/src/main/java/com/instacart/library/sample/App.java
          TrueTime.build()
            .withNtpHost(DEFAULT_NTP_HOST)
            .withSharedPreferencesCache(cordova.getActivity().getApplication())
            .initialize();
        } catch(IOException e) {
          LOG.e(LOG_TAG, "Failed to initialize TrueTime.", e);
        }
      }
    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        // cordova.getActivity().runOnUiThread(new Runnable() {

        // Returns the number of milliseconds as a string since January 1, 1970, 00:00:00 GMT from right now.
        if (action.equals("now")) {
          // We could convert long to int; but, there's the question of possibly lossy conversion. So instead of thinking about that, why not just use string?
          callbackContext.success(Long.toString(TrueTime.now().getTime()));
          return true;
        } else if (action.equals("reinit")) {
          reinit();
          callbackContext.success();
          return true;
        }
        
        return false;
    }
}
