const BaseCommand = require("../class/BaseCommand"),
  VersionLoader = require("../util/VersionLoader");

/**
 * advancement [grant, revoke, test] [selector] [advancement] [string]
 */
class AdvancementCommand12 extends BaseCommand {

}

module.exports = {
  "1.12": AdvancementCommand12
};
