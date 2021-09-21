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

  getOutput() {
    return this.sanitize();
  }

  sanitize(data=this) {
    if (data.text) {
      const split = data.text.match(/\w*$/)[0];
      data.text = split;
    }
    return data;
  }
}

module.exports = Output;
