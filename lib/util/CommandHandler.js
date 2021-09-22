const VersionLoader = require("./VersionLoader"),
  versions = require("../data/versions.json"),
  commands = require("../commands");

module.exports = function CommandHandler(tokens, editor, bufferPosition, isAfterExecuteCommand) {
  const currentVersion = VersionLoader.getVersion(),
    outputs = [],
    firstToken = tokens[0],
    lastToken = tokens[tokens.length - 1];
  // find matching commands
  for (let i = 0; i < commands.length; i++) {
    const commandData = commands[i],
      currentVersionIndex = versions.indexOf(currentVersion);
    let usedVersion = null;
    // get the version to use
    for (let j = versions.length - 1; j >= 0; j--) {
      const version = versions[j];
      if (currentVersionIndex < j) {continue;}
      if (commandData.hasOwnProperty(version)) {
        usedVersion = version;
        break;
      }
    }
    const command = commandData[usedVersion];
    if (!command) {return;}
    if (command.name.startsWith(firstToken.getValue()) && firstToken.getValue() !== "") {
      outputs.push(...(command.handleSuggestions(tokens, editor, bufferPosition, isAfterExecuteCommand) ?? []));
    }
  }
  const finalOutput = [];
  for (let i = 0; i < outputs.length; i++) {
    const output = outputs[i],
      out = output.getOutput(lastToken);
    if (Array.isArray(out)) {
      finalOutput.push(...out);
    } else {
      finalOutput.push(out);
    }
  }
  return finalOutput;
};
