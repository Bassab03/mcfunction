const BaseCommand = require("../class/BaseCommand"),
  CommandNameOutput = require("../class/output/CommandNameOutput"),
  EnumOutput = require("../class/output/EnumOutput"),
  SelectorOutput = require("../class/output/SelectorOutput");

class XPCommand12 extends BaseCommand {
}

module.exports = {
  "1.12": new XPCommand12
};