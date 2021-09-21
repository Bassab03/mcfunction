// display, description, snippet (default text)
const Output = require("../Output");

/**
 * An output for command names
 */
class CommandNameOutput extends Output {

  constructor(display, description, isSnippet) {
    const data = {
      description,
      type: "string"
    };
    if (isSnippet) {
      data.snippet = display;
    } else {
      data.text = display;
    }
    super(data);
  }

};

module.exports = CommandNameOutput;
