const path = require("path");

function getIcon(type) {
  switch (type) {

  }
}

class Output {

  constructor({
    text,
    snippet,
    displayText,
    type,
    leftLabel,
    leftLabelHTML,
    rightLabel,
    rightLabelHTML,
    className,
    iconHTML,
    description
  }) {
    this.text = text;
    this.snippet = snippet;
    this.displayText = displayText;
    this.type = type;
    this.leftLabel = leftLabel;
    this.rightLabel = rightLabel;
    this.leftLabelHTML = leftLabelHTML;
    this.rightLabelHTML = rightLabelHTML;
    this.className = className ?? `mcfunction_${type}`;
    this.iconHTML = iconHTML ?? getIcon(type);
    this.description = description;
  }

  optional() {
    return new OptionalOutput(this);
  }

  getOutput() {
    return this.sanitize();
  }

  sanitize(data=this, currentData) {
    const originalText = data.text;
    if (data.text) {
      if (currentData) {
        const data2 = currentData.match(/^.*?(?=\w*$)/)[0];
        data.text = data.text.slice(data2.length);
        if (data.displayText === originalText) {
          data.displayText = originalText.slice(data2.length);
        }
      } else {
        const split = data.text.match(/\w*$/)[0];
        data.text = split;
        if (data.displayText === originalText) {
          data.displayText = split;
        }
      }
    }
    return data;
  }
}

class OptionalOutput extends Output {
  constructor(parent) {
    super(parent);
    this.leftLabel = "(optional)";
    this.parent = parent;
  }

  getOutput(lastToken) {
    return this.parent.getOutput.call(this, lastToken);
  }

  sanitize(data=this, currentData) {
    return this.parent.sanitize.call(this, data, currentData);
  }
}

module.exports = Output;
