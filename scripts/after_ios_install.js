#!/usr/bin/env node

//actually not in use. It was used when library search path was not being setup; but, then the next week came and the path was magically being setup again.

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
  if (!context.opts.cordova.platforms.includes('ios')) return;

	var cordova_util = context.requireCordovaModule("cordova-lib/src/cordova/util"),
    ConfigParser = context.requireCordovaModule('cordova-common/src/ConfigParser/ConfigParser'),
    platforms = context.requireCordovaModule('cordova-lib/src/platforms/platforms'),
    xml = cordova_util.projectConfig(context.opts.projectRoot),
    cfg = new ConfigParser(xml),
    projectName = cfg.doc.getroot().findall("name")[0].text,
    projectPath = context.opts.projectRoot + '/platforms/ios/' + projectName + '.xcodeproj/project.pbxproj',
    project = xcode.project(projectPath);

  project.parseSync();

  // console.log(project.getBuildProperty(consts.LIBRARY_SEARCH_PATH));
  // console.log(xcode.searchPathForFile({ path: consts.SWIFT_LIBRARY_SEARCH_PATH }, project));

  // // Do changes
  // var librarySearchPaths = project.getBuildProperty(consts.LIBRARY_SEARCH_PATH);
  // if(!librarySearchPaths || librarySearchPaths.indexOf(SWIFT_LIBRARY_SEARCH_PATH) === 0) {
  // project.addToLibrarySearchPaths({ path: consts.SWIFT_LIBRARY_SEARCH_PATH});
  project.addToLibrarySearchPaths(consts.SWIFT_LIBRARY_SEARCH_PATH);
  // console.log(project.getBuildProperty(consts.LIBRARY_SEARCH_PATH));
  // var config = project.pbxXCBuildConfigurationSection();
  // for (var ref in config) {
  //     !(ref.indexOf('_comment') > -1) && console.log(ref);
  //     !(ref.indexOf('_comment') > -1) && config[ref] && config[ref].buildSettings && console.log(config[ref].buildSettings.PRODUCT_NAME, config[ref].buildSettings.PRODUCT_NAME == projectName);

  //     if (ref.indexOf('_comment') > -1 || config[ref].buildSettings.PRODUCT_NAME != projectName) continue;
  //     console.log("rawr", config[ref].buildSettings.PRODUCT_NAME);
  //     var lib = config[ref].buildSettings.LIBRARY_SEARCH_PATHS;
  //     console.log(lib[1].indexOf(libPath) > -1);
  // }
  // console.log(xcode.searchPathForFile({ path: consts.SWIFT_LIBRARY_SEARCH_PATH }, project));
  //   console.log(project.getBuildProperty(consts.LIBRARY_SEARCH_PATH));
  // } else {
  //   console.log(`Library Search Path ${consts.SWIFT_LIBRARY_SEARCH_PATH} already defined.`);
  // }

  // project.removeFromLibrarySearchPaths({ path: consts.SWIFT_LIBRARY_SEARCH_PATH});
  // console.log(project.getBuildProperty(consts.LIBRARY_SEARCH_PATH));



  // Save changes
  //error happens inside writeFileSync, we already tested project.writeSync
  fs.writeFileSync(projectPath, project.writeSync());

  console.log("adfskl;j adfskl");
}
