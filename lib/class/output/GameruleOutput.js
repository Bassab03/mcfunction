const Output = require("../Output"),
 VersionLoader = require("../../util/VersionLoader");

class GameruleOutput extends Output {
  constructor() {
    super({});
  }

  getOutput(lastToken) {
    const {gamerule:gamerules} = VersionLoader.ids,
      output = [],
      tokenValue = lastToken.getValue();
    for (const gamerule of gamerules) {
      if (gamerule.startsWith(tokenValue)) {
        output.push({
          type: "gamerule",
          text: gamerule,
          displayText: gamerule
        });
      }
    }
    return output;
  }
}

module.exports = GameruleOutput;
