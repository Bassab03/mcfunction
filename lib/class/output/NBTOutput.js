const Output = require("../Output");

/**
 * An output for nbt data tags
 */
class NBTOutput extends Output {

  /**
   * display, description, default value = {}
   */
  constructor(display, description, def="{}") {
    super({
      description,
      displayText: display,
      text: def,
      type: "nbt"
    });
  }

};

module.exports = NBTOutput;
