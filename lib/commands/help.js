const { CommandBuilder } = require("../class/builders");

const helpCommandBuilder12 = new CommandBuilder("help")
  .addAlias("?")
  .setDescription("Gets help for commands.")
  .addNumberOption("page", (opt) => {
    opt.setOptional()
      .setParallel()
      .setDescription("Specifies which page of the help list to display.")
      .setDefaultValue("1")
      .setDisplayText("page")
      .setType("int");
  })
  .addStringOption("command", (opt) => {
    opt.setOptional()
      .setDescription("The command to get help for")
      .setDisplayText("command name")
      .setSnippet("${1:command}");
  });

module.exports = {
  "1.12": {
    name: ["help", "?"],
    builder: helpCommandBuilder12
  }
};