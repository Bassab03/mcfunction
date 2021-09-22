const Output = require("../Output");

/**
 * A generic output for types
 */
class EnumOutput extends Output {

  // text, label, description
  constructor(...list) {
    super({});
    this.list = list;
  }

  getOutput(lastToken) {
    const tokenValue = lastToken.getValue(),
      output = [];
    for (let i = 0; i < this.list.length; i++) {
      const list = this.list[i],
        [text, label, description] = list;
      if (text.startsWith(tokenValue)) {
        output.push(this.sanitize({
          text,
          rightLabel: label,
          description,
          type: "enum"
        }));
      }
    }
    return output;
  }

}

module.exports = EnumOutput;
