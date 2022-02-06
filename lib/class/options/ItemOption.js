/* global atom */
const BaseOption = require("../BaseOption"),
  VersionLoader = require("../../util/VersionLoader");

/**
 * Represents an 'enum' option, an option which is a list of strings.
 */
class ItemOption extends BaseOption {

  reformatOutput(lastToken) {
    const { item:items } = VersionLoader.ids,
      appendNamespace = atom.config.get("mcfunction-lang.showNamespace"),
      tokenSplit = lastToken.split(/^minecraft:/),
      itemName = tokenSplit[0] === "" ? tokenSplit[1] : tokenSplit[0],
      result = [];
    for (const item of items) {
      const output = super.reformatOutput();
      if (appendNamespace && "minecraft".startsWith(lastToken)) {
        Object.assign(output, {
          text: `minecraft:${item}`
        });
      } else if (item.startsWith(itemName) || lastToken === "") {
        Object.assign(output, {
          text: item
        });
      } else {
        continue;
      }
      result.push(output);
    }
    return result;
  }

}

module.exports = ItemOption;