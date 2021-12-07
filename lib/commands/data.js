const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  EnumOutput = require("../class/output/EnumOutput"),
  NBTOutput = require("../class/output/NBTOutput"),
  NumberOutput = require("../class/output/NumberOutput"),
  CoordinateOutput = require("../class/output/CoordinateOutput"),
  StringOutput = require("../class/output/StringOutput"),
  SelectorOutput = require("../class/output/SelectorOutput");

class DataCommand13 extends BaseCommand {

  constructor() {super("data");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("data", "Gets and modifies NBT data.")];
      }
      case 2: {
        return [new EnumOutput(
          ["get", "Sub Command", "Get NBT data"],
          ["merge", "Sub Command", "Merge NBT data"],
          ["remove", "Sub Command", "Removes NBT data"]
        )];
      }
    }
    const subCommand = tokens[1].getValue();
    if (tokens.length === 3) {
      return [new EnumOutput(
        ["block", "Source Type"],
        ["entity", "Source Type"]
      )];
    }
    const subCommand2 = tokens[2].getValue();
    let index = tokens.length;
    if (subCommand2 === "entity") {
      index += 2;
    }
    switch (subCommand) {
      case "get": {
        switch (index) {
          case 4:
          case 5:
          case 6: {
            if (index === 6 && subCommand2 === "entity") {
              return [new SelectorOutput("The entity to get the NBT data from", "target")];
            }
            return [new CoordinateOutput(
              ["x", "y", "z"].slice(index - 4),
              "~",
              7 - index,
              "The block position to get NBT data from"
            )];
          }
          case 7: {
            return [(new StringOutput("${1:my.path[0].\"name\"}", "The NBT path to fetch", true, "path")).optional()];
          }
          case 8: {
            return [(new NumberOutput("scale", "The multiplier to scale the returned number", "1")).optional()];
          }
        }
        break;
      }
      case "merge": {
        switch (index) {
          case 4:
          case 5:
          case 6: {
            if (index === 6 && subCommand2 === "entity") {
              return [new SelectorOutput("The entity to get the NBT data from", "target")];
            }
            return [new CoordinateOutput(
              ["x", "y", "z"].slice(index - 4),
              "~",
              7 - index,
              "The block position to get NBT data from"
            )];
          }
          case 7: {
            return [new NBTOutput("nbt", "The NBT data to merge.")];
          }
        }
        break;
      }
      case "remove": {
        switch (index) {
          case 4:
          case 5:
          case 6: {
            if (index === 6 && subCommand2 === "entity") {
              return [new SelectorOutput("The entity to get the NBT data from", "target")];
            }
            return [new CoordinateOutput(
              ["x", "y", "z"].slice(index - 4),
              "~",
              7 - index,
              "The block position to get NBT data from"
            )];
          }
          case 7: {
            return [new StringOutput("${1:my.path[0].\"name\"}", "The NBT path to remove", true, "path")];
          }
        }
      }
    }
  }

}

module.exports = {
  "1.13": new DataCommand13
};