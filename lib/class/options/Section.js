const hasProperty = require("../../util/hasProperty"),
  BaseOption = require("../BaseOption"),
  EnumOption = require("./EnumOption"),
  NumberOption = require("./NumberOption"),
  SelectorOption = require("./SelectorOption"),
  ItemOption = require("./ItemOption"),
  NBTOption = require("./NBTOption"),
  range = require("../../util/range"),
  AdvancementOption = require("./AdvancementOption"),
  AttributeOption = require("./AttributeOption"),
  BiomeOption = require("./BiomeOption"),
  BlockOption = require("./BlockOption"),
  BooleanOption = require("./BooleanOption"),
  CoordinateOption = require("./CoordinateOption"),
  DimensionOption = require("./DimensionOption"),
  EffectOption = require("./EffectOption"),
  EnchantmentOption = require("./EnchantmentOption"),
  EntityOption = require("./EntityOption"),
  GameruleOption = require("./GameruleOption"),
  LootTableOption = require("./LootTableOption"),
  ObjectiveOption = require("./ObjectiveOption"),
  ParticleOption = require("./ParticleOption"),
  RecipeOption = require("./RecipeOption"),
  ScoreboardDisplayOption = require("./ScoreboardDisplayOption"),
  SlotOption = require("./SlotOption"),
  SoundOption = require("./SoundOption"),
  StructureOption = require("./StructureOption"),
  StringOption = require("./StringOption");

/**
 * @callback optionCallback
 * @param {BaseOption} option
 */
/**
 * @callback sectionGenerator
 * @returns {BaseOption}
 */

/**
 * Represents a section, which can contain options
 */
class Section extends BaseOption {

  /**
     * The named sections of this section
     * 
     * @type {Object.<string, Section>}
     */
  namedSections = {};

  /**
   * The paths this section can take
   * Contains functions that will return the option
   * 
   * @type {sectionGenerator[]}
   */
  path = [];

  /**
   * Adds a sub command to this section's path.
   * 
   * @param {String} name The name of the sub command
   * @param {optionCallback} subCommandCallback The function to handle the sub command
   */
  addSubCommand(name, subCommandCallback) {
    const SubCommandSection = require("./SubCommandSection"),
      subCommand = new SubCommandSection(name);
    this.addCallbackOptionToPath(subCommand, subCommandCallback);
    return this;
  }

  /**
   * Adds a number option to this section's path.
   * 
   * @param {String} label The label of the number option
   * @param {optionCallback} numberCallback The function to handle the number option
   */
  addNumberOption(label, numberCallback) {
    const numberOption = new NumberOption(label);
    this.addCallbackOptionToPath(numberOption, numberCallback);
    return this;
  }

  /**
   * Adds a string option to this section's path.
   * 
   * @param {String} label The label of the string option
   * @param {optionCallback} stringCallback The function to handle the string option
   */
  addStringOption(label, stringCallback) {
    const stringOption = new StringOption(label);
    this.addCallbackOptionToPath(stringOption, stringCallback);
    return this;
  }

  /**
   * Adds an NBT option to this section's path.
   * 
   * @param {String} label The label of the NBT option
   * @param {optionCallback} nbtCallback The function to handle the NBT option
   */
  addNBTOption(label, nbtCallback) {
    const nbtOption = new NBTOption(label);
    this.addCallbackOptionToPath(nbtOption, nbtCallback);
    return this;
  }

  /**
   * Adds an enum option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} enumCallback The function to handle the enum option
   */
  addEnumOption(label, enumCallback) {
    const enumOption = new EnumOption(label);
    this.addCallbackOptionToPath(enumOption, enumCallback);
    return this;
  }

  /**
   * Adds a selector option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} selectorCallback The function to handle the selector option
   */
  addSelectorOption(label, selectorCallback) {
    const selectorOption = new SelectorOption(label);
    this.addCallbackOptionToPath(selectorOption, selectorCallback);
    return this;
  }

  /**
   * Adds an item option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} itemCallback The function to handle the item option
   */
  addItemOption(label, itemCallback) {
    const itemOption = new ItemOption(label);
    this.addCallbackOptionToPath(itemOption, itemCallback);
    return this;
  }

  /**
   * Adds an advancement option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} advancementCallback The function to handle the advancement option
   */
  addAdvancementOption(label, advancementCallback) {
    const advancementOption = new AdvancementOption(label);
    this.addCallbackOptionToPath(advancementOption, advancementCallback);
    return this;
  }

  /**
   * Adds a block option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} blockCallback The function to handle the block option
   */
  addBlockOption(label, blockCallback) {
    const blockOption = new BlockOption(label);
    this.addCallbackOptionToPath(blockOption, blockCallback);
    return this;
  }

  /**
   * Adds a dimension option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} dimensionCallback The function to handle the dimension option
   */
  addDimensionOption(label, dimensionCallback) {
    const dimensionOption = new DimensionOption(label);
    this.addCallbackOptionToPath(dimensionOption, dimensionCallback);
    return this;
  }

  /**
   * Adds an effect option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} effectCallback The function to handle the effect option
   */
  addEffectOption(label, effectCallback) {
    const effectOption = new EffectOption(label);
    this.addCallbackOptionToPath(effectOption, effectCallback);
    return this;
  }

  /**
   * Adds an enchantment option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} enchantmentCallback The function to handle the enchantment option
   */
  addEnchantmentOption(label, enchantmentCallback) {
    const enchantmentOption = new EnchantmentOption(label);
    this.addCallbackOptionToPath(enchantmentOption, enchantmentCallback);
    return this;
  }

  /**
   * Adds an entity option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} entityCallback The function to handle the entity option
   */
  addEntityOption(label, entityCallback) {
    const entityOption = new EntityOption(label);
    this.addCallbackOptionToPath(entityOption, entityCallback);
    return this;
  }

  /**
   * Adds a recipe option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} recipeCallback The function to handle the recipe option
   */
  addRecipeOption(label, recipeCallback) {
    const recipeOption = new RecipeOption(label);
    this.addCallbackOptionToPath(recipeOption, recipeCallback);
    return this;
  }

  /**
   * Adds a sound option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} soundCallback The function to handle the sound option
   */
  addSoundOption(label, soundCallback) {
    const soundOption = new SoundOption(label);
    this.addCallbackOptionToPath(soundOption, soundCallback);
    return this;
  }

  /**
   * Adds an attribute option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} attributeCallback The function to handle the attribute option
   */
  addAttributeOption(label, attributeCallback) {
    const attributeOption = new AttributeOption(label);
    this.addCallbackOptionToPath(attributeOption, attributeCallback);
    return this;
  }

  /**
   * Adds a biome option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} biomeCallback The function to handle the biome option
   */
  addBiomeOption(label, biomeCallback) {
    const biomeOption = new BiomeOption(label);
    this.addCallbackOptionToPath(biomeOption, biomeCallback);
    return this;
  }

  /**
   * Adds a gamerule option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} gameruleCallback The function to handle the gamerule option
   */
  addGameruleOption(label, gameruleCallback) {
    const gameruleOption = new GameruleOption(label);
    this.addCallbackOptionToPath(gameruleOption, gameruleCallback);
    return this;
  }

  /**
   * Adds a loot table option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} lootTableCallback The function to handle the loot table option
   */
  addLootTableOption(label, lootTableCallback) {
    const lootTableOption = new LootTableOption(label);
    this.addCallbackOptionToPath(lootTableOption, lootTableCallback);
    return this;
  }

  /**
   * Adds an objective option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} objectiveCallback The function to handle the objective option
   */
  addObjectiveOption(label, objectiveCallback) {
    const objectionOption = new ObjectiveOption(label);
    this.addCallbackOptionToPath(objectionOption, objectiveCallback);
    return this;
  }

  /**
   * Adds a particle option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} particleCallback The function to handle the particle option
   */
  addParticleOption(label, particleCallback) {
    const particleOption = new ParticleOption(label);
    this.addCallbackOptionToPath(particleOption, particleCallback);
    return this;
  }

  /**
   * Adds a scoreboard display option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} scoreboardDisplayCallback The function to handle the scoreboard display option
   */
  addScoreboardDisplayOption(label, scoreboardDisplayCallback) {
    const scoreboardDisplayOption = new ScoreboardDisplayOption(label);
    this.addCallbackOptionToPath(scoreboardDisplayOption, scoreboardDisplayCallback);
    return this;
  }

  /**
   * Adds a slot option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} slotCallback The function to handle the slot option
   */
  addSlotOption(label, slotCallback) {
    const slotOption = new SlotOption(label);
    this.addCallbackOptionToPath(slotOption, slotCallback);
    return this;
  }

  /**
   * Adds a structure option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} structureCallback The function to handle the structure option
   */
  addStructureOption(label, structureCallback) {
    const structureOption = new StructureOption(label);
    this.addCallbackOptionToPath(structureOption, structureCallback);
    return this;
  }

  /**
   * Adds a boolean option to this section's path.
   * 
   * @param {String} label The label of the option
   * @param {optionCallback} booleanCallback The function to handle the boolean option
   */
  addBooleanOption(label, booleanCallback) {
    const booleanOption = new BooleanOption(label);
    this.addCallbackOptionToPath(booleanOption, booleanCallback);
    return this;
  }

  /**
   * Adds a coordinate option(s) to this section's path.
   * 
   * @param {String} label The label of the option(s)
   * @param {optionCallback} coordinateCallback The function to handle the coordinate option(s)
   * @param {Number} amount The number of 'coordinates' to add
   */
  addCoordinateOption(label, coordinateCallback, amount) {
    for (const i of range(amount)) {
      const coordinateOption = new CoordinateOption(label, amount - i);
      this.addCallbackOptionToPath(coordinateOption, coordinateCallback);
    }
    return this;
  }

  /**
   * Adds a section to the path.
   * 
   * @param {String|optionCallback} section The saved section or a function that accepts a section
   * @throws {ReferenceError} Thrown if the section added does not exist.
   * @throws {TypeError} Thrown if the input is neither a string, nor a function.
   */
  addSectionOption(section) {
    if (typeof section === "string") {
      if (hasProperty(this.namedSections, section)) {
        this.addToPath(this.namedSections[section]);
      } else {
        throw new ReferenceError(`Section '${section}' does not exist.`);
      }
    } else if (typeof section === "function") {
      const newSection = new Section();
      // TODO: verify that this is not a problem
      section(newSection);
      this.addToPath(newSection);
    } else {
      throw new TypeError(`Provided input '${section}' is not a string or a function.`);
    }
    return this;
  }

  /**
   * Adds an option to this section's path and set a callback.
   * 
   * @param {BaseOption} option The option to add to the path
   * @param {optionCallback} callback The callback to run on the option
   */
  addCallbackOptionToPath(option, callback) {
    option.setCallback(callback);
    this.addToPath(option);
  }

  /**
   * Adds an option to this section's path.
   * 
   * @param {BaseOption} option The option to add to the path
   */
  addToPath(option) {
    // The reason for this is to prevent infinite loops with recursive paths
    this.path.push(() => {
      option.executeCallback();
      return option;
    });
  }

  /**
   * Creates a named section, which can be used later.
   * @see {Section#addSectionOption}
   * 
   * @param {String} sectionName The name of the section to be added.
   * @param {optionCallback} sectionCallback A function to handle the new section.
   * @throws {Error} Throw when the section already exists.
   */
  createNamedSection(sectionName, sectionCallback) {
    if (hasProperty(this.namedSections, sectionName)) {
      const section = new Section();
      section.setCallback(sectionCallback);
      this.namedSections[sectionName] = section;
    } else {
      throw new Error(`A section by the name '${sectionName}' already exists.`);
    }
    return this;
  }

  /**
   * Finishes the creation phase of the section and returns a generator function that outputs outputs.
   * 
   * @generator
   * @yields {BaseOption[]}
   * @returns {Generator<BaseOption[], any, BaseOption[]>}
   */
  *build() {
    const output = [];
    for (let i = 0; i < this.path.length; i++) {
      const option = this.path[i]();
      // Check option for specific cases
      // In the case of a sub command, additional sub commands or options may be present
      if (option.isParallel()) {
        // TODO: handle a section as a parallel option...
        output.push(option);
        continue;
      }
      // If the option is a section, keep outputting all the section's options
      if (option instanceof Section) {
        const sectionGenerator = option.build();
        // TODO: handle stuff if there is something in output still
        yield* sectionGenerator;
        continue;
      }
      output.push(option);
      yield output;
      // Done collecting output, clear the output list
      output.splice(0);
    }
  }

}

module.exports = Section;