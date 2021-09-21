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

module.exports = Output;
