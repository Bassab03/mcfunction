const BaseCommand = require("../class/BaseCommand");

/**
 * clone <x> <y> <z> <x> <y> <z> <x> <y> <z> [maskMode] [cloneMode]
 */
class CloneCommand12 extends BaseCommand {
  constructor() {
    this.name = "clone";
  }

  handleSuggestions(tokens) {
    switch(tokens.length) {
      case 1: {
        return [new CommandNameOutput(
          ["clone", "Clones blocks from one location to another."]
        )];
      }
      case 2:
      case 3:
      case 4: {
        return [new CoordinateOutput([["x1", "y1", "z1"].slice(tokens.length - 2), "~", tokens.length - 3, "First corner to start cloning from"])];
      }
      case 5:
      case 6:
      case 7: {
        return [new CoordinateOutput([["x2", "y2", "z2"].slice(tokens.length - 2), "~", tokens.length - 3, "Second corner to start cloning from"])];
      }
      case 8:
      case 9:
      case 10: {
        return [new CoordinateOutput([["x", "y", "z"].slice(tokens.length - 2), "~", tokens.length - 3, "Location to place the cloned structure at. Places starting at the bottom, northwest corner."])];
      }
      case 11: {
        return [
          new EnumOutput(
            ["replace", "MaskMode", "Replace all blocks with cloned blocks"],
            ["masked", "MaskMode", "Copy all non-air blocks to the location"],
            ["filtered", "MaskMode", "Copy all blocks with the specified id and data"]
          )
        ]
      }
      case 12: {
        return [
          new EnumOutput(
            ["force", "CloneMode", "Force the clone even if source and destination overlap"],
            ["normal", "CloneMode", "Clone the source and then remove the source with air"],
            ["move", "CloneMode", "Clone the source, prevent cloning if source and destination overlap"]
          )
        ];
      }
      case 13: {
        if (tokens[10].getValue() !== "filtered") {return;}
        return [
          new BlockOutput(["Clone filter", "the block id to clone frmo the source"])
        ];
      }
      case 14: {
        if (tokens[10].getValue() !== "filtered") {return;}
        return [
          new NumberOutput(["Block data", "The block damage number to filter the blocks cloned"]),
          new StringOutput(["Block state", "The block state to filter the blocks cloned"])
        ];
      }
    }
  }
}

module.exports = {
  "1.12": CloneCommand12
};
