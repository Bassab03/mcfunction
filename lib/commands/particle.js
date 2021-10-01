const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  EnumOutput = require("../class/output/EnumOutput"),
  StringOutput = require("../class/output/StringOutput"),
  CoordinateOutput = require("../class/output/CoordinateOutput"),
  NumberOutput = require("../class/output/NumberOutput"),
  SelectorOutput = require("../class/output/SelectorOutput"),
  ParticleOutput = require("../class/output/ParticleOutput"),
  BlockOutput = require("../class/output/BlockOutput"),
  ItemOutput = require("../class/output/ItemOutput");

class ParticleCommand12 extends BaseCommand {
  constructor() {
    super("particle");
  }

  handleSuggestions(tokens) {
    switch (tokens.length) {
      case 1: {
        return [new CommandNameOutput("particle", "Create particle effects.")];
      }
      case 2: {
        return [new ParticleOutput(null, "particle")];
      }
      case 3:
      case 4:
      case 5: {
        return [new CoordinateOutput("position", "~", 6 - tokens.length, "Location to start showing the particles.")];
      }
      case 6:
      case 7:
      case 8: {
        const delta = new CoordinateOutput(
          "delta",
          "1",
          9 - tokens.length,
          "The bounding box particles can appear in. For certain particles, this could be rgb values, motion values, or change in rgb values");
        delta.descriptionMoreURL = "https://minecraft.fandom.com/wiki/Commands/particle#Arguments";
        return [delta];
      }
      case 9: {
        const speed = new NumberOutput("speed", "The speed of movement for particles", "0");
        speed.descriptionMoreURL = "https://minecraft.fandom.com/wiki/Commands/particle#Arguments";
        return [speed];
      }
      case 10: {
        return [
          (new NumberOutput("count", "The number of particles to display", "1")).optional()
        ];
      }
      case 11: {
        return [
          (new EnumOutput(
            ["force", "displayMode", "Blocks are displayed up to 512 blocks away."],
            ["normal", "displayMode", "Default value. Particles are displayed up to 32 blocks away."]
          )).optional()
        ];
      }
      case 12: {
        return [(new SelectorOutput).optional()];
      }
      default: {
      // TODO: https://minecraft.fandom.com/wiki/Commands/particle?oldid=1123037
      // specific stuff for certain particles
        return [(new StringOutput(tokens[tokens.length - 1].getValue() || " ", null, false, "params")).optional()];
      }
    }
  }
}

module.exports = {
  "1.12": new ParticleCommand12
};
