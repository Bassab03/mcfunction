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

  getOutput(lastToken) {
    if (this.snippet) {
      const tokenValue = lastToken.getValue();
      if (tokenValue === "") {
        return this;
      } else {
        delete this.snippet;
        this.text = tokenValue;
        return this.sanitize(this);
      }
    } else {
      return super.getOutput();
    }
  }

};

module.exports = CommandNameOutput;
