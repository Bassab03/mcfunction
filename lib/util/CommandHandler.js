const VersionLoader = require("./VersionLoader"),
  versions = require("../data/versions.json"),
  commands = require("../commands");

module.exports = function CommandHandler(tokens, editor, bufferPosition, isAfterExecuteCommand) {
  const currentVersion = VersionLoader.getVersion(),
    outputs = [];
  // find matching commands
  for (let i = 0; i < commands.length; i++) {
    const commandData = commands[i],
      currentVersionIndex = versions.indexOf(currentVersion),
      firstToken = tokens[0];
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
    const command = new commandData[usedVersion];
    if (command.name.startsWith(firstToken)) {
      outputs.push(...(command.handleSuggestions(tokens, editor, bufferPosition, isAfterExecuteCommand) ?? []));
    }
  }
  return outputs.map(output => output.getOutput());
};
