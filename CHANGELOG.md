# Changelog

## 0.0.5-dev
- [#12](https://github.com/totalpave/cordova-plugin-date/pull/12) - (Android) Upgraded TrueTime back to `3.4`. Omit `withSharedPreferences` configuration.
- [#13](https://github.com/totalpave/cordova-plugin-date/pull/13) - (iOS) Avoid potential crash in iOS
- Updated JS to detect when the native side has not properly initiated and automatically call `_reinit` and `update` until an TrueTime value can be obtained.
- (iOS) Updated `_reinit` to not go across the cordova bridge on iOS devices. As of [#13](https://github.com/totalpave/cordova-plugin-date/pull/13), iOS `_reinit` does nothing.


## 0.0.4 (November 18, 2019)
- [#9](https://github.com/totalpave/cordova-plugin-date/pull/9) - (Android) Downgraded TrueTime to `3.2`

## 0.0.3 (October 29, 2019)
- Renamed ios class from CDVDate to TPDate. 
- Updated javascript to use TPDate instead of Date as the CLASS_NAME.
- Fixed typo in Android package name.

## 0.0.2 (October 9, 2019)
- [#5](https://github.com/totalpave/cordova-plugin-date/pull/5) - CocoaPod fix
- [#6](https://github.com/totalpave/cordova-plugin-date/pull/6) - Updated README

## 0.0.1 (October 4, 2019)
- Initial release

## 0.0.0 (August 13, 2019)
- Initial creation of the Changelog.
