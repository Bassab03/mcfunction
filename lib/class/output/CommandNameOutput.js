const Output = require("../Output");

/**
 * An output for command names
 */
class CommandNameOutput extends Output {

  constructor(name, description) {
    super({
      text: name,
      type: "command",
      description
    });
  }

}

module.exports = CommandNameOutput;
