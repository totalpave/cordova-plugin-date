#!/usr/bin/env node

//actually not in use. It was being developed when I realized the library search path wasn't being removed; but, then the path was magically being removed again.

var consts = require("./Constants.js"),
  xcode = require('xcode'),
  fs = require('fs'),
  path = require("path"),
  plist = require('plist'),
  elementtree = require('elementtree');
var ElementTree = elementtree.ElementTree;
var Element = elementtree.Element;
var SubElement = elementtree.SubElement;

module.exports = function(context) {
	var cordova_util = context.requireCordovaModule("cordova-lib/src/cordova/util"),
    ConfigParser = context.requireCordovaModule('cordova-common/src/ConfigParser/ConfigParser'),
    platforms = context.requireCordovaModule('cordova-lib/src/platforms/platforms'),
    xml = cordova_util.projectConfig(context.opts.projectRoot),
    cfg = new ConfigParser(xml),
    projectName = cfg.doc.getroot().findall("name")[0].text,
    projectPath = context.opts.projectRoot + '/platforms/ios/' + projectName + '.xcodeproj/project.pbxproj',
    project = xcode.project(projectPath);

  project.parseSync();

  console.log("removing", project.getBuildProperty(consts.LIBRARY_SEARCH_PATH));

  // Do changes
  var librarySearchPaths = project.getBuildProperty(consts.LIBRARY_SEARCH_PATH);
  console.log(librarySearchPaths, librarySearchPaths ? librarySearchPaths.indexOf(consts.SWIFT_LIBRARY_SEARCH_PATH) : "n/a");
  if(librarySearchPaths && librarySearchPaths.indexOf(consts.SWIFT_LIBRARY_SEARCH_PATH) > 0) {
    // project.removeFromLibrarySearchPaths({ path: consts.SWIFT_LIBRARY_SEARCH_PATH});
  } else {
    console.log(`Library Search Path ${consts.SWIFT_LIBRARY_SEARCH_PATH} wasn\'t defined.`);
  }

  console.log("removing", project.getBuildProperty(consts.LIBRARY_SEARCH_PATH));

  // Save changes
  //error happens inside writeFileSync, we already tested project.writeSync
  fs.writeFileSync(projectPath, project.writeSync());

  console.log("adfskl;j adfskl");
}
