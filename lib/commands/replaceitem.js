const BaseCommand = require("../class/BaseCommand"),
  NullCommand = require("../class/NullCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  SelectorOutput = require("../class/output/SelectorOutput"),
  NumberOutput = require("../class/output/NumberOutput"),
  SlotOutput = require("../class/output/SlotOutput"),
  NBTOutput = require("../class/output/NBTOutput"),
  EnumOutput = require("../class/output/EnumOutput"),
  ItemOutput = require("../class/output/ItemOutput"),
  CoordinateOutput = require("../class/output/CoordinateOutput");

class ReplaceitemCommand12 extends BaseCommand {
  constructor() {super("replaceitem");}

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("replaceitem", "Replaces items in entities and blocks.")];
      }
      case 2: {
        return [new EnumOutput(
          ["block", "Target Type"],
          ["entity", "Target Type"]
        )];
      }
      default: {
        const choice2 = tokens[1].getValue();
        let index = 0;
        switch (choice2) {
          case "block": {
            index = -2;
            switch (tokens.length) {
              case 3:
              case 4:
              case 5: {
                return [new CoordinateOutput(["x", "y", "z"].slice(tokens.length - 3), "~", 6 - tokens.length)];
              }
            }
            break;
          }
          case "entity": {
            if (tokens.length === 3) {
              return [new SelectorOutput];
            }
          }
            switch (index + tokens.length) {
              case 4: {
                return [new SlotOutput];
              }
              case 5: {
                return [new ItemOutput];
              }
              case 6: {
                return [new NumberOutput("amount", "The item count.", "1")];
              }
              case 7: {
                return [new NumberOutput("data", "The damage/data number of the item", "0")];
              }
              case 8: {
                return [new NBTOutput("dataTag", "The NBT data to be applied to the replacement items.")];
              }
            }
        }
      }
    }
  }
}

module.exports = {
  "1.12": new ReplaceitemCommand12,
  "1.17": new NullCommand
};
