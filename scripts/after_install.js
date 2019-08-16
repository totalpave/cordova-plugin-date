#!/usr/bin/env node

// var xcode = require('xcode'),
var fs = require('fs'),
    path = require("path"),
    plist = require('plist');

module.exports = function(context) {
	//var cordova_util = context.requireCordovaModule("cordova-lib/src/cordova/util"),
    var ConfigParser = context.requireCordovaModule('cordova-common/src/ConfigParser/ConfigParser'),
      platforms = context.requireCordovaModule('cordova-lib/src/cordova/platforms'),
      xml = cordova_util.projectConfig(projectRoot),
      cfg = new ConfigParser(xml);
	console.log(context.opts.plugin.pluginInfo);
	console.log(context.opts.plugin.pluginInfo.getConfigFiles());
    // var projectPath = context.opts.projectRoot 'myproject.xcodeproj/project.pbxproj',
	   //  workspacePath = 'myproject.xcworkspace/xcshareddata/WorkspaceSettings.xcsettings',
	   //  myProj = xcode.project(projectPath);
}


// {
// 	"ios": {
// 		"debug": {
// 			"buildFlag": {
// 				"ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES=YES"
// 			}
// 		}
// 	}
// }