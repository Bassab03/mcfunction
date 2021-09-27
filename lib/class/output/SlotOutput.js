const Output = require("../Output"),
  VersionLoader = require("../../util/VersionLoader");

class SlotOutput extends Output {
  constructor() {
    super({});
  }

  getOutput(lastToken) {
    const {slot} = VersionLoader.ids,
      {inventory} = slot,
      output = [],
      tokenValue = lastToken.getValue();
    console.log(slot)
    for (const slot of inventory) {
      if (slot.toLowerCase().startsWith(tokenValue.toLowerCase())) {
        output.push({
          type: "slot",
          text: slot,
          displayText: slot
        });
      }
    }
    return output;
  }
}

module.exports = SlotOutput;