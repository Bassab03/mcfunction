/* eslint-disable no-unused-vars */
const CommandBuilder = require("../class/CommandBuilder"),
  Section = require("../class/options/Section"),
  hasProperty = require("./hasProperty"),
  VersionLoader = require("./VersionLoader"),
  BaseOption = require("../class/BaseOption"),
  versions = require("../data/versions.json"),
  commands = require("../commands");

/**
 * @typedef {{
 *   text: String?,
 *   snippet: String?,
 *   displayText: String?,
 *   replacementPrefix: String?,
 *   type: String?,
 *   leftLabel: String?,
 *   leftLabelHTML: String?,
 *   rightLabel: String?,
 *   rightLabelHTML: String?,
 *   className: String?,
 *   iconHTML: String?,
 *   description: String?,
 *   descriptionMoreURL: String?,
 *   characterMatchIndices: Number[]?
 * }} providerOutput
 */

/**
 * @type {String[]}
 */
let currentLine = null,
  /**
   * @type {BaseOption[]}
   */
  currentOutput = null,
  /**
   * @type {Generator<BaseOption[], BaseOption[], BaseOption[]>}
   */
  currentCommand = null,
  /**
   * @type {Section}
   */
  currentBuilder = null;

/**
 * Determines if the command being edited is a different one from the current cached version.
 * 
 * @param {String[]} tokens The tokens of the current line
 * @returns {Boolean} Whether the command body changed
 */
function bodyHasChanged(tokens) {
  if (currentLine === null) {return true;}
  if (tokens.length === 1) {return true;}
  if (currentLine.length < tokens.length - 1) {return true;}
  if (currentLine.length > tokens.length) {return true;}
  for (let i = 0; i < tokens.length - 2; i++) {
    if (currentLine[i] !== tokens[i]) {
      return true;
    }
  }
  return false;
}

/**
 * Checks for sections in the option and returns which section/command should still be used.
 * 
 * @param {Generator<BaseOption[], BaseOption[], BaseOption[]>} command The CommandBuilder currently being used
 * @param {Section} builder
 * @param {BaseOption[]} output The output being checked
 * @param {String} token The current token
 * @param {String[]} tokens The list of tokens
 * @returns {[Generator<BaseOption[], BaseOption[], BaseOption[]>, Section]} The section/builder to use
 */
function updateCurrentCommand(command, builder, output, token, tokens) {
  const newBuilder = output.find((opt) => {
      if (opt instanceof Section && !(opt instanceof CommandBuilder)) {
        // TODO: nested sections
        opt.setTokens(tokens);
        const testBuild = opt.build(),
          [testVal] = testBuild.next().value;
        return testVal.tokenIsApplicable(token);
      }
    }),
    newCmd = newBuilder?.build() ?? command;
  return [ newCmd, newBuilder ?? builder ];
}

/**
 * Gets the provider data from options.
 * 
 * @param {BaseOption[]} optionList The raw options to grab data from.
 * @param {String} lastToken
 * @returns {providerOutput[]} The formatted output
 */
function getFormattedOutput(optionList, lastToken) {
  // TODO: Sanitization
  // - If snippet, and text is not empty, do not replace string
  // - For outputs with non \w characters, ensure the correct stuff is outputted.
  const output = [];
  for (let option of optionList) {
    if (option instanceof Section && !(option instanceof CommandBuilder)) {
      [option] = option.build().next().value;
      // TODO: edge case: nested sections, or multiple outputs here
    }
    const result = option.reformatOutput(lastToken);
    if (Array.isArray(result)) {
      output.push(...result);
    } else {
      output.push(result);
    }
  }
  if (lastToken !== "") {
    const [ partMatch ] = lastToken.match(/^(\w+[^\w])+/) ?? [""],
      lastWord = lastToken.slice(partMatch.length);
    for (const option of output) {
      if (option.snippet) {
        option.snippet = null;
        option.text = lastWord;
      } else if (option.text && option.text.startsWith(partMatch)) {
        option.text = option.text.slice(partMatch.length);
      }
    }
  }
  return output;
}

/**
 * Handles commands and gets the suggestions and outputs.
 * 
 * @param {String[]} tokens The list of tokens
 * @param {TextEditor} editor The atom text editor
 * @param {Pos} bufferPosition The buffer position of the event
 * @returns {providerOutput[]} The formatted output
 */
function CommandHandler(tokens, editor, bufferPosition) {
  const currentVerison = VersionLoader.getVersion(),
    [firstToken] = tokens,
    lastToken = tokens[tokens.length - 1];
  /* 
  TODO: if the tokens gain a lot of items
  but current line is a subsequence of tokens,
  run currentCommand.next() multiple times,
  rather than recreating the entire path again
  */
  if (bodyHasChanged(tokens)) {
    currentCommand = null;
    currentBuilder = null;
  } else if (currentCommand !== null) {
    if (tokens.length !== currentLine.length) {
      currentLine = tokens;
      currentBuilder.setTokens(tokens);
      // Check if the previous token results in a different path
      const oldCommand = currentCommand;
      [ currentCommand, currentBuilder ] = updateCurrentCommand(currentCommand, currentBuilder, currentOutput, tokens[tokens.length - 2], tokens);
      // Fast forward one step so its using the actual current value.
      currentBuilder.setTokens(tokens);
      if (oldCommand !== currentCommand) {currentCommand.next();}
      const val = currentCommand.next();
      if (val.done) {
        currentOutput = [];
        return;
      }
      currentOutput = [...val.value];
    }
    currentLine = tokens;
    return getFormattedOutput(currentOutput, lastToken);
  }
  // New stuff, clear output
  currentOutput = [];
  currentLine = tokens;
  for (const commandData of commands) {
    const currentVersionIndex = versions.indexOf(currentVerison);
    let usedVersion;
    for (let i = versions.length - 1; i >= 0; i--) {
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
    let isWithinCommand = false;
    if (Array.isArray(name)) {
      // Check all names
      for (let i = 0; i < name.length; i++) {
        if (firstToken === name[i]) {
          isWithinCommand = true;
          break;
        }
      }
    } else if (firstToken === name) {
      isWithinCommand = true;
    }
    // Get current output
    if (isWithinCommand) {
      currentBuilder = builder;
      currentCommand = currentBuilder.build();
      for (let i = 0; i < tokens.length; i++) {
        currentBuilder.setTokens(tokens);
        let val = currentCommand.next();
        const oldCommand = currentCommand;
        if (val.done) {return;}
        [ currentCommand, currentBuilder ] = updateCurrentCommand(currentCommand, currentBuilder, val.value, tokens[i], tokens);
        if (oldCommand !== currentCommand) {
          currentBuilder.setTokens(tokens);
          val = currentCommand.next();
        }
        currentOutput = [...val.value];
      }
      return getFormattedOutput(currentOutput, lastToken);
    } else if (tokens.length === 1) {
      const cmd = builder.build(),
        output = cmd.next();
      currentOutput.push(...output.value);
    }
  }
  return getFormattedOutput(currentOutput, lastToken);
}

module.exports = CommandHandler;