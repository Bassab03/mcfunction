const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput");

/**
 * clear <target> [item] [data] [max] [dataTag]
 */
class ClearCommand12 extends BaseCommand {
  constructor() {
    super("clear");
  }

  handleSuggestions(tokens) {
    switch(tokens.length) {
      case 1: {
        return [new CommandNameOutput("clear", "Clears items from a player's inventory.")];
      }
      case 2: {
        return [new SelectorOutput];
      }
      case 3: {
        return [new ItemOutput(["The item id to clear"])];
      }
      case 4: {
        return [new NumberOutput(
          ["data", "item data/damage number"]
        )];
      }
      case 5: {
        return [
          new NumberOutput(
            ["max", "max number of items to remove", "1"]
          )
        ];
      }
      case 6: {
        return [new NBTOutput("dataTag", "NBT Data to match item")];
      }
    }
  }
}

module.exports = {
  "1.12": ClearCommand12
};
