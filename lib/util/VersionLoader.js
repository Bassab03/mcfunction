const VERSIONS = require("../data/versions.json"),
  IDS = [
    "advancement",
    "biomes",
    "block",
    "enchantment",
    "entity",
    "gamerule",
    "item",
    "loot_table",
    "particle",
    "recipe",
    "slot",
    "sounds",
    "structures"
  ];

// TODO: loop through everything, replace <item> or <block>, etc with actual ids?

class VersionLoader {

  constructor() {
    this.ids = {};
    this.version = null;
    atom.config.observe("mcfunction-lang.version", (version) => {this.updateIDs(version)});
  }

  updateIDs(currentVersion) {
    if (currentVersion === "latest") {currentVersion = VERSIONS[VERSIONS.length - 1]}
    this.version = currentVersion;
    for (const version of VERSIONS) {
      for (const id of IDS) {
        this.ids[id] = this.ids[id] || new Set;
        const data = require(`../data/versions/${version}/${id}`),
          add = data.add || {},
          remove = data.remove || {};
        if (Array.isArray(add)) {
          for (const item of add) {this.ids[id].add(item);}
        } else {
          for (const key in add) {
            for (const item of add[key]) {this.ids[id].add(item);}
          }
        }
        if (Array.isArray(remove)) {
          for (const item of remove) {this.ids[id].delete(item);}
        } else {
          for (const key in remove) {
            for (const item of remove[key]) {this.ids[id].delete(item);}
          }
        }
      }
      if (currentVersion === version) {break;}
    }
  }

  getVersion() {
    return this.version;
  }
}

module.exports = new VersionLoader;
