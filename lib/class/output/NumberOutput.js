const Output = require("../Output");

/**
 * An output for numbers
 */
class NumberOutput extends Output {

  /**
   * displayed text, description, default=0
   */
  constructor(display, description, def) {
    super({
      text: def,
      displayText: display,
      description
    });
  }

};

module.exports = NumberOutput;
