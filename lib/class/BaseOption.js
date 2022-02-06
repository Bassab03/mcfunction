/* eslint-disable no-unused-vars */

function noop() {}

/**
 * @callback optionCallback
 * @param {BaseOption} option
 */
/**
 * @callback textValidator
 * @param {String} token
 * @param {String[]} tokenList
 */
/**
 * @typedef {{
 *   text: String?,
 *   snippet: String?,
 *   displayText: String?,
 *   replacementPrefix: String?,
 *   type: String?,
 *   leftLabel: String?,
 *   leftLabelHTML: String?,
 *   rightLabel: String?,
 *   rightLabelHTML: String?,
 *   className: String?,
 *   iconHTML: String?,
 *   description: String?,
 *   descriptionMoreURL: String?,
 *   characterMatchIndices: Number[]?
 * }} providerOutput
 */

/**
 * Represents an option for a command
 */
class BaseOption {

  /**
   * The label of this option
   * 
   * @type {String}
   */
  label

  /**
   * The description of this option
   * 
   * @type {String}
   */
  description

  /**
   * A function to validate the token
   * 
   * @type {textValidator}
   */
  customTokenValidator

  /**
   * The display text of this option
   * 
   * @type {String}
   */
  displayText

  /**
   * The snippet text of this option
   * 
   * @type {String}
   */
  snippet

  /**
   * The callback to be called on itself
   * 
   * @type {optionCallback}
   */
  callback = noop;

  /**
   * Whether the option is 'parallel' and can be outputted in addition to other options.
   * 
   * @type {Boolean}
   */
  isParallel = false

  /**
   * 
   * @param {String} label The short label describing what it is about.
   */
  constructor(label) {
    this.label = label;
  }

  /**
   * Sets the default value of this option.
   * 
   * @param {String} defaultValue The default text value of this option
   */
  setDefaultValue(defaultValue) {
    this.snippet = `\${1:${defaultValue}}`;
    return this;
  }

  /**
   * Sets this option's display text.
   * 
   * @param {String} displayText The text to set the display to
   */
  setDisplayText(displayText) {
    this.displayText = displayText;
    return this;
  }

  /**
   * Sets the option modifier callback.
   * 
   * @param {optionCallback} callback The function to modify the option
   */
  setCallback(callback) {
    if (typeof callback === "function") {
      this.callback = () => {
        callback(this);
      };
    }
    return this;
  }

  /**
   * Sets the custom text validator.
   * 
   * @param {textValidator} callback The function to validate the text
   */
  setCallback(callback) {
    if (typeof callback === "function") {
      this.customTokenValidator = callback;
    }
    return this;
  }

  /**
   * Executes the callback
   */
  executeCallback() {
    this.callback();
  }

  /**
   * Makes the option 'parallel'.
   */
  setParallel() {
    this.isParallel = true;
    return this;
  }

  /**
   * Determines if this option is parallel.
   * 
   * @returns {Boolean} Whether this option is parallel
   */
  isParallel() {
    return this.isParallel;
  }

  /**
   * Sets the description of this option.
   * 
   * @param {String} description The description of this option
   */
  setDescription(description) {
    this.description = description;
    return this;
  }

  /**
   * Determines if the text written for this option is valid.
   * 
   * @param {String} mytoken The token for this option
   * @param {String[]} tokens The tokens of the full command
   * @returns {Number} Whether it is valid or not. 0 = invalid, 1 = valid, 2 = warn
   */
  isValid(mytoken, tokens) {
    if (this.customTokenValidator) {
      return this.customTokenValidator(mytoken, tokens);
    }
    return 1;
  }

  /**
   * Compiles an output that the Provider API uses.
   * 
   * @returns {providerOutput|providerOutput[]}
   */
  reformatOutput() {
    return {
      text: this.label,
      snippet: this.snippet,
      description: this.description,
      displayText: this.displayText
    };
  }

}

module.exports = BaseOption;