const Output = require("../Output"),
  VersionLoader = require("../../util/VersionLoader");

class StructureOutput extends Output {
  constructor() {
    super({});
  }

  getOutput(lastToken) {
    const {structures} = VersionLoader.ids,
      output = [],
      tokenValue = lastToken.getValue();
    for (const structure of structures) {
      if (structure.toLowerCase().startsWith(tokenValue.toLowerCase())) {
        output.push({
          type: "structure",
          text: structure,
          displayText: structure
        });
      }
    }
    return output;
  }
}

module.exports = StructureOutput;
