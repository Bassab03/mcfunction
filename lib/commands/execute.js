const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  SelectorOutput = require("../class/output/SelectorOutput"),
  CoordinateOutput = require("../class/output/CoordinateOutput"),
  StringOutput = require("../class/output/StringOutput"),
  BlockOutput = require("../class/output/BlockOutput");

class ExecuteCommand12 extends BaseCommand {
  constructor() {
    super("execute");
  }

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("execute", "Execute commands as entities in certain locations.")];
      }
      case 2: {
        return [new SelectorOutput]
      }
      case 3:
      case 4:
      case 5: {
        return [
          new CoordinateOutput(["x", "y", "z"].slice(tokens.length - 3), "~", 6 - tokens.length, "Position relative to target entity to execute the command."),
          new StringOutput("${1:~} ${2:~} ${3:~} detect", "(...with block detection)", true, "x y z detect")
        ];
      }
      case 6: {
        return [new StringOutput("detect")];
      }
      case 7:
      case 8:
      case 9: {
        return [new CoordinateOutput(["x", "y", "z"].slice(tokens.length - 7), "~", 10 - tokens.length, "Position relative to previous location to check the block.")]
      }
      case 10: {
        return [new BlockOutput]
      }
      case 11: {
        return [
          new StringOutput("${1:state}", "The data value, or block state to check for. -1 and * are also valid.", true, "state")
        ]
      }
    }
  }
}

module.exports = {
  "1.12": new ExecuteCommand12
};
