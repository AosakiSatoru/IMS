cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
                  {
                  "id": "cordova-plugin-console.console",
                  "file": "plugins/cordova-plugin-console/www/console-via-logger.js",
                  "pluginId": "cordova-plugin-console",
                  "clobbers": [
                               "console"
                               ]
                  },
                  {
                  "id": "cordova-plugin-console.logger",
                  "file": "plugins/cordova-plugin-console/www/logger.js",
                  "pluginId": "cordova-plugin-console",
                  "clobbers": [
                               "cordova.logger"
                               ]
                  }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "cordova-plugin-console": "1.0.3"
};
// BOTTOM OF METADATA
});