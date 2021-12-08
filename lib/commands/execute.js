const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  SelectorOutput = require("../class/output/SelectorOutput"),
  CoordinateOutput = require("../class/output/CoordinateOutput"),
  StringOutput = require("../class/output/StringOutput"),
  BlockOutput = require("../class/output/BlockOutput"),
  EnumOutput = require("../class/output/EnumOutput");

class ExecuteCommand12 extends BaseCommand {
  constructor() {
    super("execute");
  }

  handleSuggestions(tokens) {
    if (tokens.length > 6 && tokens[5].getValue() !== "detect") {
      return;
    }
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("execute", "Execute commands as entities in certain locations.")];
      }
      case 2: {
        return [new SelectorOutput("The targets to run the command as.", "targets")];
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
        return [new CoordinateOutput(["x", "y", "z"].slice(tokens.length - 7), "~", 10 - tokens.length, "Position relative to previous location to check the block.")];
      }
      case 10: {
        return [new BlockOutput("The block id to detect.", "block")];
      }
      case 11: {
        return [
          new StringOutput("${1:state}", "The data value, or block state to check for. -1 and * are also valid.", true, "state")
        ];
      }
    }
  }
}

class ExecuteCommand13 extends BaseCommand {
  constructor() {super("execute");}

  handleSuggestions(tokens) {
    if (tokens.length === 1) {
      return [new CommandNameOutput("execute", "Execute commands as entities in certain locations and criteria.")];
    }
    const currentSubCommand = [];
    // Get current execute sub command
    for (let i = 1; i < tokens.length; i++) {
      currentSubCommand.push(tokens[i]);
      const isDone = this.isSubCommandDone(currentSubCommand);
      if (isDone) {
        if (isDone === 1) {
          currentSubCommand.splice(0, currentSubCommand.length - 1);
        } else {
          currentSubCommand.splice(0);
        }
      } 
    }
    if (currentSubCommand.length <= 1) {
      return [new EnumOutput(
        ["align", "Modification Sub Command", "Updates execute position aligning it to the block position (flooring)."],
        ["anchored", "Modificaiton Sub Command", "Sets execute anchor to eyes/feet."],
        ["as", "Modification Sub Command", "Sets the command's executor(s)."],
        ["at", "Modification Sub Command", "Sets the command's position/rotation/dimension to match that of an entity."],
        ["facing", "Modification Sub Command", "Sets the exeuction rotation to face a point from the anchor."],
        ["in", "Modification Sub Command", "Sets the execution dimension/position."],
        ["positioned", "Modification Sub Command", "Sets the execute position."],
        ["rotated", "Modification Sub Command", "Sets the execution rotation."],
        ["if", "Conditional Sub Command", "Runs if the condition is true."],
        ["unless", "Conditional Sub Command", "Runs if the condition is false."],
        ["store", "Store Sub Command", "Stores the result somewhere."],
        ["run", "Execution Sub Command", "End the execute command, run a different command."]
      )];
    }
    const subCommand = currentSubCommand[0].getValue();
    switch (subCommand) {
      case "align": {
        if (currentSubCommand.length === 2) {
          return [new EnumOutput(
            ["x", "axes"],
            ["y", "axes"],
            ["z", "axes"],
            ["xy", "axes"],
            ["xz", "axes"],
            ["yz", "axes"],
            ["xyz", "axes"]
          )];
        }
        break;
      }
      case "anchored": {
        if (currentSubCommand.length === 2) {
          return [new EnumOutput(
            ["eyes", "anchor"],
            ["feet", "anchor"]
          )];
        }
        break;
      }
      case "at":
      case "as": {
        if (currentSubCommand.length === 2) {
          return [new SelectorOutput("Entities to run the command as/at", "targets")];
        }
        break;
      }
      case "in": {
        if (currentSubCommand.length === 2) {
          const namespaces = atom.config.get("mcfunction-lang.showNamespace");
          return [new EnumOutput(
            [`${namespaces ? "minecraft:" : ""}overworld`, "dimension"],
            [`${namespaces ? "minecraft:" : ""}the_nether`, "dimension"],
            [`${namespaces ? "minecraft:" : ""}the_end`, "dimension"]
          )];
        }
        break;
      }
      case "positioned": {
        if (currentSubCommand.length === 2) {
          return [
            new StringOutput("as", "Position as an entity"),
            new CoordinateOutput("x y z", "~", 3, "Coordinate to position at")
          ];
        } else if (currentSubCommand.length > 2) {
          if (currentSubCommand[1].getValue() === "as") {
            return [new SelectorOutput("Target entities to position as", "targets")];
          } else {
            return [new CoordinateOutput(
              ["y", "z"].slice(currentSubCommand.length - 3),
              "~",
              5 - currentSubCommand.length,
              "Coordinate to position at"
            )];
          }
        }
        break;
      }
      case "rotated": {
        if (currentSubCommand.length === 2) {
          return [
            new StringOutput("as", "Position as an entity"),
            new CoordinateOutput("x z", "~", 2, "Coordinate to position at")
          ];
        } else if (currentSubCommand.length > 2) {
          if (currentSubCommand[1].getValue() === "as") {
            return [new SelectorOutput("Target entities to position as", "targets")];
          } else {
            return [new CoordinateOutput(
              ["z"].slice(currentSubCommand.length - 3),
              "~",
              4 - currentSubCommand.length,
              "Coordinate to position at"
            )];
          }
        }
        break;
      }
      case "facing": {
        if (currentSubCommand.length === 2) {
          return [
            new StringOutput("entity", "Face towards an entity"),
            new CoordinateOutput("x y z", "~", 3, "Coordinate to face towards")
          ];
        } else if (currentSubCommand.length > 2) {
          if (currentSubCommand[1].getValue() === "entity") {
            return [new SelectorOutput("Target entities to face towards", "targets")];
          } else {
            return [new CoordinateOutput(
              ["y", "z"].slice(currentSubCommand.length - 3),
              "~",
              5 - currentSubCommand.length,
              "Coordinate to face towards"
            )];
          }
        }
        break;
      }
    }
  }

  /**
   * isSubCommandDone - Determines whether a sub command has completed.
   * 
   * @param {Token[]} command 
   * @return {Boolean|Number} Whether the sub command is complete.
   */
  isSubCommandDone(command) {
    const [type] = command
    switch (type.getValue()) {
      case "align": {
        return [
          "x",
          "y",
          "z",
          "xz",
          "xy",
          "yx",
          "yz",
          "zx",
          "zy",
          "xyz",
          "xzy",
          "yxz",
          "yzx",
          "zxy",
          "zyx"
        ].includes(command[1]?.getValue());
      }
      case "anchored": {
        return ["eyes", "feet"].includes(command[1]?.getValue());
      }
      case "at":
      case "in":
      case "as": {
        return command.length > 2 ? 1 : false;
      }
      case "facing": {
        if (command[1]?.getValue() === "entity") {
          return command.length === 3
            && ["eyes", "feet"].includes(command[2]?.getValue());
        } else {
          return command.length > 4 ? 1 : false;
        }
      }
      case "positioned": {
        if (command[1]?.getValue() === "as") {
          return command.length > 3 ? 1 : false;
        } else {
          return command.length > 4 ? 1 : false;
        }
      }
      case "rotated": {
        return command.length > 3 ? 1 : false;
      }
      case "if":
      case "unless": {
        return this.ifUnlessDone(command);
      }
      case "store": {
        return this.storeDone(command);
      }
      default: {return false;}
    }
  }

  /**
   * storeDone - Checks for the store sub command
   * 
   * @param {Token[]} command The subcommand tokens
   * @return {Boolean|Number} Whether the command is done
   */
  storeDone(command) {
    const [,,store_sub] = command;
    switch (store_sub?.getValue()) {
      case "block": {
        return command.length > 9 ? 1 : false;
      }
      case "bossbar": {
        return command.length === 5
          && ["value", "max"].includes(command[4]?.getValue());
      }
      case "entity": {
        return command.length > 7 ? 1 : false;
      }
      case "score": {
        return command.length > 5 ? 1 : false;
      }
      default: {return false;}
    }
  }

  /**
   * ifUnlessDone - Checks for the if/unless conditionals
   * 
   * @param {Token[]} command The subcommand tokens
   * @return {Boolean|Number} Whether the command is done
   */
  ifUnlessDone(command) {
    const [,subcommand] = command;
    switch (subcommand?.getValue()) {
      case "block": {
        return command.length > 6 ? 1 : false;
      }
      case "blocks": {
        return command.length === 12
          && ["all", "masked"].includes(command[11].getValue());
      }
      case "entity": {
        return command.length > 3 ? 1 : false;
      }
      case "score": {
        const if_sub = command[4];
        if (if_sub?.getValue() === "matches") {
          return command.length > 6 ? 1 : false;
        } else {
          return command.length > 7 ? 1 : false;
        }
      }
      default: {return false;}
    }
  }

}

module.exports = {
  "1.12": new ExecuteCommand12,
  "1.13": new ExecuteCommand13
};
