const path = require("path");

class Output {
  constructor() {
    this.snippet = null;
    this.text = null;
    this.displayText = null;
    this.type = null;
    this.leftLabelHTML = null;
    this.rightLabelHTML = null;
    this.iconHTML = null;
    this.description = null;
  }

  setText(text) {
    this.text = `${text}`;
    return this;
  }

  setSnippet(snippet) {
    this.snippet = `${snippet}`;
    return this;
  }

  setDisplayText(text) {
    this.displayText = `${text}`;
    return this;
  }

  setType(type) {
    this.type = `${type}`;
    return this;
  }

  setLeftLabel(html) {
    this.leftLabelHTML = `${html}`;
    return this;
  }

  setRightLabel(html) {
    this.rightLabelHTML = `${html}`;
    return this;
  }

  setIcon(iconPath) {
    if (iconPath.indexOf(".") === -1) {
      this.iconHTML = `<span class="icon-plain">${iconPath.replace(/</gm, "&lt;").replace(/>/gm, "&gt;")}</span>`;
    } else {
      this.iconHTML = `<span class="icon-${this.type}"><img src="${path.join(__dirname, iconPath)}"></span>`;
    }
    return this;
  }

  setDescription(description) {
    this.description = `${description}`;
    return this;
  }

  matchesWith(string, line) {
    const str = this.displayText ?? this.snippet ?? this.text ?? "";
    return str.toLowerCase().indexOf(string.toLowerCase()) !== -1;
  }

}

module.exports = Output;
