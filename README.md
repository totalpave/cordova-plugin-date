# cordova-plugin-date
Cordova plugin to interface with the Android and iOS TrueTime libraries. 

iOS: https://github.com/instacart/TrueTime.swift

Android: https://github.com/instacart/truetime-android

# How to use
The plugin can be accessed using `window.totalpave.date`.

The app should call `window.totalpave.date.init` on launch.

The idea behind the plugin is to replace `new Date`/`Date.now` usage. You shouldn't be using either of these any more. 
Instead you would use `getTime`, `now`, and `getDate`.

## init
Setups the JavaScript side of the plugin to be used. 
The native side of the plugin should be handled automatically; but, if for some reason something goes wrong, see `reinit`.

This function also sets up an event listener for resume. When the resume event fires, the plugin will automatically attempt to sync the time. 

### Parameters
success, fail - cordova callbacks.

logger - Object to use to log things. Defaults to JavaScript's console object.
Any object will be allowed as long as it defines the function `log`.

timeSyncDelay - Number of milliseconds the plugin waits before attempting sync its time.

## reinit
Runs the native initialize code. Native initialization code does nothing if it's already successfully initialized.

### Parameters
success, fail - cordova callbacks.

## setLogger
Changes the plugin's logger. This is a synchronous function.

### Parameters 
logger - Object to use to log things. Will accept any object that defines the function `log`.

## update
Attempts to sync the time. Can be called manually to immediately attempt a sync instead of waiting for the time sync delay.

### Parameters
success, fail - cordova callbacks

## getTime
Gets the current time in milliseconds. This is a synchronous function.

## now
Gets the current time as an JavaScript Date object. This is a synchronous function.
`now` calls `getTime`. So if you just want the time in milliseconds, `getTime` will be a little faster.

## getDate
Alias for JavaScript's `new Date`. This is a synchronous function. 
As mentioned above, the idea is to completely replace `new Date`/`Date.now` usage. `getDate` handles cases where you are passing arguments into `new Date` to get a specific time instead of current time. 
