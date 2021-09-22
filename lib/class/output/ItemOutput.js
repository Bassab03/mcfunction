/* global atom */
const Output = require("../Output"),
  VersionLoader = require("../../util/VersionLoader");

class ItemOutput extends Output {
  constructor() {
    super({});
  }

  getOutput(lastToken) {
    const {item:items} = VersionLoader.ids,
      appendNamespace = atom.config.get("mcfunction-lang.showNamespace"),
      output = [],
      tokenValue = lastToken.getValue(),
      tokenSplit = tokenValue.split(/^minecraft:/),
      itemName = tokenSplit[0] === "" ? tokenSplit[1] : tokenSplit[0];
    for (const item of items) {
      if (appendNamespace) {
        if ("minecraft".startsWith(tokenValue)) {
          output.push({
            type: "item",
            text: `minecraft:${item}`,
            displayText: `minecraft:${item}`
          });
          continue;
        } else if (tokenValue.startsWith("minecraft:")) {
          if (item.startsWith(itemName)) {
            output.push(this.sanitize({
              type: "item",
              text: `${item}`,
              displayText: `${item}`
            }, itemName));
          }
          continue;
        }
      }
      if (item.startsWith(itemName)) {
        output.push(this.sanitize({
          type: "item",
          text: item,
          displayText: item
        }, itemName));
      }
    }
    return output;
  }
}

module.exports = ItemOutput;
