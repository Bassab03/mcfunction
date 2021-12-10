const hasProperty = require("./hasProperty"),
  VersionLoader = require("./VersionLoader"),
  BaseOption = require("../class/BaseOption"),
  versions = require("../data/versions.json"),
  commands = require("../commands"),
  range = require("./range");

/**
 * @type {String[]}
 */
let currentLine = null,
  /**
   * @type {BaseOption[]}
   */
  currentOutput = null,
  /**
   * @type {Generator<BaseOption, any, BaseOption>}
   */
  currentCommand = null;

/**
 * Determines if the command being edited is a different one from the current cached version.
 * 
 * @param {String[]} tokens The tokens of the current line
 * @returns {Boolean} Whether the command body changed
 */
function bodyHasChanged(tokens) {
  if (currentLine === null) {return true;}
  if (currentLine.length < tokens.length - 1) {
    return true;
  }
  for (const i of range(tokens.length - 1)) {
    if (currentLine[i] !== tokens[i]) {
      return true;
    }
  }
  return false;
}

/**
 * Handles commands and gets the suggestions and outputs.
 * 
 * @param {String[]} tokens The list of tokens
 * @param {TextEditor} editor The atom text editor
 * @param {Pos} bufferPosition The buffer position of the event
 * @returns {{text: String, displayText: String, snippet: String, iconHTML: String, type: String}[]} The output
 */
function CommandHandler(tokens, editor, bufferPosition) {
  const currentVerison = VersionLoader.getVersion(),
    [firstToken] = tokens,
    lastToken = tokens[tokens.length] - 1;
  if (bodyHasChanged(tokens)) {
    currentLine = tokens;
    currentOutput = [];
    currentCommand = null;
  } else {
    if (tokens.length !== currentLine.length) {
      currentLine = tokens;
      currentOutput = currentCommand.next();
    }
    return currentOutput; // TODO: map to actual output object
  }
  for (const commandData of commands) {
    const currentVersionIndex = versions.indexOf(currentVerison);
    let usedVersion;
    for (const i of range(versions.length - 1, -1, -1)) {
      const version = versions[i];
      if (currentVersionIndex < i) {continue;}
      if (hasProperty(commandData, version)) {
        usedVersion = version;
        break;
      }
    }
    const command = commandData[usedVersion];
    if (!command) {continue;}
    const { name, builder } = command;
  }
}

module.exports = CommandHandler;