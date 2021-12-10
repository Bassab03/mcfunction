// https://stackoverflow.com/questions/5364928/node-js-require-all-files-in-a-folder
/**
 * @callback commandBuilder
 * @returns {??} TODO
 */
/**
 * @typedef {{name: String|String[], builder: commandBuilder}} commandItem
 */
/**
 * @typedef {Object.<string, commandItem>} commandVersionList
 */
/**
 * @type {commandVersionList[]}
 */
const list = [];

require("fs").readdirSync(__dirname + "/commands/").forEach(function(file) {
  if (file.match(/\.js$/) && file !== "index.js") {
    /**
     * @type {commandVersionList}
     */
    const command = require("./commands/" + file);
    list.push(command);
  }
});

module.exports = list;
