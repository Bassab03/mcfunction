const CommandBuilder = require("../class/CommandBuilder");

const giveCommandBuilder12 = new CommandBuilder()
  .setDescription("Give items to players");
  

module.exports = {
  "1.12": {
    name: "give",
    builder: giveCommandBuilder12
  }
};