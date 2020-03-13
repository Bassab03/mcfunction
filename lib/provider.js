const nbtpath = require("./id/path.json");
const commands = require("./commands.json");

// main
let blocks = require("./id/block.json");
let effects = require("./id/effect.json");
let advancements = require("./id/advancement.json");
let enchantments = require("./id/enchantment.json");
let items = require("./id/item.json");
let loots = require("./id/loot_table.json");
const slots = require("./id/slot.json");
let entities = require("./id/entity.json");
const structures = require("./id/structures.json");
let biomes = require("./id/biomes.json");
let particles = require("./id/particle.json");
let sounds = require("./id/sounds.json");

// To generate all stuff for slots.
for(let cat in slots){
  for(let item in slots[cat]){
    const tmp = [];
    const original = slots[cat][item].toString();
    if(/<item>/gm.test(original)){
      for(let it of items){
        tmp.push(original.replace(/<item>/gm,it));
      }
    }else if(/<block>/gm.test(original)){
      for(let it of blocks){
        tmp.push(original.replace(/<block>/gm,it));
      }
    }else if(/<entity>/gm.test(original)){
      for(let it of entities){
        tmp.push(original.replace(/<entity>/gm,it));
      }
    }
    slots[cat] = slots[cat].concat(tmp);
  }
  slots[cat].sort();
}
// To generate all stuff for loot tables.
for(let cat in loots){
  const tmp = [];
  const original = loots[cat].toString();
  if(/<item>/gm.test(original)){
    for(let it of items){
      tmp.push(original.replace(/<item>/gm,it));
    }
  }else if(/<block>/gm.test(original)){
    for(let it of blocks){
      tmp.push(original.replace(/<block>/gm,it));
    }
  }else if(/<entity>/gm.test(original)){
    for(let it of entities){
      tmp.push(original.replace(/<entity>/gm,it));
    }
  }
  loots = loots.concat(tmp);
}
// To generate all stuff for particles.
for(let cat in particles){
  const tmp = [];
  const original = particles[cat].toString();
  if(/<item>/gm.test(original)){
    for(let it of items){
      tmp.push(original.replace(/<item>/gm,it));
    }
  }else if(/<block>/gm.test(original)){
    for(let it of blocks){
      tmp.push(original.replace(/<block>/gm,it));
    }
  }else if(/<entity>/gm.test(original)){
    for(let it of entities){
      tmp.push(original.replace(/<entity>/gm,it));
    }
  }
  particles = particles.concat(tmp);
}
// To generate spawn eggs
for(let ent of entities){
  items.push(`${ent}_spawn_egg`);
}

function noMC(array){
  for(let i in array){
    array[i] = array[i].replace("minecraft:","");
  }
}

// To sort the files in case.
items.sort();
blocks.sort();
enchantments.sort();
effects.sort();
advancements.sort();
particles.sort();
sounds.sort();
entities.sort();
effects.sort();
loots.sort();
structures.sort();

// copies
const blocks2 = blocks.slice();
const effects2 = effects.slice();
const advancements2 = advancements.slice();
const enchantments2 = enchantments.slice();
const entities2 = entities.slice();
const biomes2 = biomes.slice();
const sounds2 = sounds.slice();
const loots2 = loots.slice();
const particles2 = particles.slice();
const items2 = items.slice();

atom.config.observe("mcfunction-lang.showmc", (val)=>{
  if(val || typeof(val) == "undefined"){ // default to true
    blocks = blocks2.slice();
    effects = effects2.slice();
    advancements = advancements2.slice();
    enchantments = enchantments2.slice();
    items = items2.slice();
    loots = loots2.slice();
    entities = entities2.slice();
    biomes = biomes2.slice();
    particles = particles2.slice();
    sounds = sounds2.slice();
  }else{
    noMC(blocks);
    noMC(effects);
    noMC(advancements);
    noMC(enchantments);
    noMC(items);
    noMC(loots);
    noMC(entities);
    noMC(biomes);
    noMC(particles);
    noMC(sounds);
  }
});

module.exports = {

  selector: ".source.mcfunction13",
  disableForSelector: ".source.mcfunction13 .comment",

  inclusionPriority: 1,

  suggestionPriority: 2,

  getCurrentCommand: function (editor, bufferPosition) {
    var text = editor.getTextInBufferRange([[bufferPosition.row, 0], bufferPosition]);
    var matches = text.match(/^\w+/g);
    if(matches == null) return null;
    var cmd = matches[0];
    return cmd;
  },

  getCommandStop: function (text, command) {

    if(command == null) return null;

    //replace all non arg seperating spaces with an _

    var block = [];

    var aux = "";
    for(var c of text) {
      if(c == "{") {
        block.push("}");
        aux += c;
      } else if(c == "[") {
        block.push("]");
        aux += c;
      } else if(c == "\"" && block[block.length - 1] != "\"") {
        block.push("\"");
        aux += c;
      } else if(c == block[block.length - 1]) {
        block.pop();
        aux += c;
      } else if(c == " " && block.length > 0) aux += "_";
      else aux += c;
    }

    var args = aux.split(" ").slice(1, -1);
    if(command.alias != null) return this.runCycle(args, commands.commands[command.alias].cycleMarkers).cycle;
    var cycle = command.cycleMarkers;
    return this.runCycle(args, cycle).cycle;
  },

  runCycle: function(args, cycle) {
    var i = 0;
    var c = 0;
    var realLastStop = null;
    for(; i < args.length; ) {
      var arg = args[i];
      var stop = cycle[c];

      var realStop = stop;
      if (stop.include != null) {
        realStop = commands.reference[stop.include];
      }
      if(realStop.type == "option" && (realStop.anyValue == null || ! realStop.anyValue)) {
        if(!realStop.value.includes(arg)) {
          return {
            pos: cycle.length + 1,
            argPos: args.length + 1,
            cycle: {
              type: "end"
            }
          };
        }
      }
      if (realStop.type == "option" && realStop.change != null && realStop.change[arg] != null) {

        var cycleRun = this.runCycle(args.slice(i + 1), realStop.change[arg]);
        i += cycleRun.argPos + 1;
        c += 1;
        if(cycleRun.cycle != null) return {
          pos: c,
          argPos: i,
          cycle: cycleRun.cycle
        };
      } else if(realStop.type == "coord") {
        i += 3;
        c += 1;
        if(args.length < i) return {
          pos: c,
          argPos: i,
          cycle: realStop
        };
      } else if(realStop.type == "particle") {
        if(args[0] == "block" || args[0] == "minecraft:block"){
          i+=2;
          c+=1;
        }else{
          i++;
          c++;
        }
      } else if(realStop.type == "center" || realStop.type == "rotation") {
        i += 2;
        c += 1;
        if(args.length < i) return {
          pos: c,
          argPos: i,
          cycle: realStop
        };
      } else if (realStop.type == "end") {
        return {
          pos: c,
          argPos: i,
          cycle: cycle[c]
        };
      } else if(realStop.type == "command") {
        var cmd = args[i];
        var newCycle = commands.commands[cmd];
        return {
          pos: cycle.length + 1,
          argPos: args.length + 1,
          cycle: this.getCommandStop(args.slice(i).join(" ") + " !", newCycle)
        };
      } else if(realStop.type == "greedy") {
        return {
          pos: cycle.length + 1,
          argPos: args.length + 1,
          cycle: realStop
        };
      } else {
        i++;
        c++;
      }

      if(c >= cycle.length) return {
        pos: c,
        argPos: i,
        cycle: null
      };
      realLastStop = realStop;
    }

    if(cycle[0] != null) {
      var stop = cycle[c];

      var realStop = stop;
      if (stop.include != null) {
        realStop = commands.reference[stop.include];
      }
      return {
        pos: c,
        argPos: i,
        cycle: realStop
      };
    }
    return {
      pos: c,
      argPos: i,
      cycle: null
    };
  },

  getSuggestions: function (args) {
    if(! atom.config.get("mcfunction-lang.autocomplete")) {
      return;
    }
    var bufferPos = args.bufferPosition;
    var editor = args.editor;
    var current = this.getCurrentCommand(editor, bufferPos);
    var out = [];
    var lineText = editor.getTextInBufferRange([[bufferPos.row, 0], bufferPos]);
    if(!lineText.includes(" ")) {
      out = this.getCommandOption(lineText);
    } else if(current != null) {

      var splitText = lineText.split(" ");
      var lastText = splitText[splitText.length - 1];

      if(commands.commands[current] == null) {
        return null;
      }
      var stop = this.getCommandStop(lineText, commands.commands[current]);
      if(stop == null) {

        return [];
      }

      switch(stop.type){
        case "command":
          out = this.getCommandOption(lastText);
          break;
        case "option":
          for(var opt of stop.value) {
            if(opt.startsWith(lastText)) {
              out.push({
                text: opt,
                type: "option",
                iconHTML: "<i class=\"icon option\">?</i>"
              });
            }
          }
          break;
        case "block":
          for(var block of blocks) {
            if(block.startsWith(lastText) || block.replace("minecraft:","").startsWith(lastText)) {
              out.push({
                text: block,
                type: "block",
                iconHTML: "<img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/block.svg\">"
              });
            }
          }
          break;
        case "effect":
          for(var effect of effects) {
            if(effect.startsWith(lastText) || effect.replace("minecraft:","").startsWith(lastText)) {
              out.push({
                text: effect,
                type: "effect",
                iconHTML: "<i class=\"icon effect\">e</i>"
              });
            }
          }
          break;
        case "advancement":
          for(var adv of advancements) {
            if(adv.search(lastText) != -1) {
              out.push({
                text: adv,
                type: "advancement",
                iconHTML: "<i class=\"icon advancement\">a</i>"
              });
            }
          }
          break;
        case "enchantment":
          for(var ench of enchantments) {
            if(ench.startsWith(lastText) || ench.replace("minecraft:","").startsWith(lastText)) {
              out.push({
                text: ench,
                type: "enchantment",
                iconHTML: "<i class=\"icon enchantment\" ><img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/enchantment.svg\"></i>"
              });
            }
          }
          break;
        case "entity-id":
          for(var ent of entities) {
            if(ent.startsWith(lastText) || ent.replace("minecraft:","").startsWith(lastText)) {
              out.push({
                text: ent,
                type: "entity-id",
                iconHTML: "<i class=\"icon entity\">a</i>"
              });
            }
          }
          break;
        case "item":
          for(var item of items) {
            if(item.startsWith(lastText) || item.replace("minecraft:","").startsWith(lastText)) {
              out.push({
                text: item,
                type: "item",
                iconHTML: "<i class=\"icon item\" ><img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/item.svg\"></i>"
              });
            }
          }
          break;
        case "loot":
          for(var loot of loots) {
            if(loot.search(lastText) != -1) {
              out.push({
                text: loot,
                type: "loot",
                iconHTML: "<i class=\"icon loot\">LT</i>"
              });
            }
          }
          break;
        case "recipe":
          for(var recipe of items) {
            if(recipe.startsWith(lastText) || recipe.replace("minecraft:","").startsWith(lastText)) {
              out.push({
                text: recipe,
                type: "recipe",
                iconHTML: "<i class=\"icon recipe\" ><img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/recipe.svg\"></i>"
              });
            }
          }
          break;
        case "particle":
          for(var part of particles) {
            if(part.search(lastText) != -1) {
              out.push({
                text: part,
                type: "particle",
                iconHTML: "<i class=\"icon particle\">P</i>"
              });
            }
          }
          break;
        case "sound":
          for (let s of sounds) {
            if(s.search(lastText) != -1) {
              out.push({
                text: s,
                type: "sound",
                iconHTML: "<i class=\"icon sound\">P</i>"
              });
            }
          }
          break;
        case "iventory-slot":
          for(let slot of slots.inventory) {
            if(slot.startsWith(lastText)) {
              out.push({
                text: slot,
                type: "slot",
                iconHTML: "<i class=\"icon slot\">s</i>"
              });
            }
          }
          break;
        case "scoreboard-slot":
          for(let slot of slots.scoreboard) {
            if(slot.startsWith(lastText)) {
              out.push({
                text: slot,
                type: "slot",
                iconHTML: "<i class=\"icon slot\">s</i>"
              });
            }
          }
          break;
        case "objective":
          for(let slot of slots.objective) {
            if(slot.search(lastText) != -1) {
              out.push({
                text: slot,
                type: "slot",
                iconHTML: "<i class=\"icon slot\">o</i>"
              });
            }
          }
          break;
        case "biome":
          // TODO: add biome icon
          for(let biome of biomes){
            if(biome.startsWith(lastText) || biome.replace("minecraft:","").startsWith(lastText)){
              out.push({
                text: biome,
                type: "biome",
                iconHTML: "<i class=\"icon biome\">B</i>"
              });
            }
          }
          break;
        case "structure":
          // TODO: add structure icon
          for(let struct of structures){
            if(struct.startsWith(lastText)){
              out.push({
                text: struct,
                type: "structure",
                iconHTML: "<i class=\"icon structure\">S</i>"
              });
            }
          }
          break;
        case "coord":
          out.push({
            text: "~ ~ ~",
            displayText: stop.value,
            type: "coord",
            iconHTML: "<i class=\"icon coord\">~</i>"
          });
          break;
        case "center":
          out.push({
            text: "~ ~",
            displayText: stop.value,
            type: "center",
            iconHTML: "<i class=\"icon coord\">~</i>"
          });
          break;
        case "rotation":
          out.push({
            text: "0",
            displayText: stop.value,
            type: "rotation",
            iconHTML: "<i class=\"icon rotation\">r</i>"
          });
          break;
        case "nbt":
          out.push({
            snippet: "{$1}",
            displayText: stop.value,
            type: "nbt",
            iconHTML: "<i class=\"icon nbt\">{}</i>"
          });
          break;
        case "id":
          out.push({
            snippet: "${1:" + stop.value + "}",
            displayText: stop.value,
            type: "id",
            iconHTML: "<i class=\"icon id\">ID</i>"
          });
          break;
        case "function":
          out.push({
            snippet: "${1:" + stop.value + "}",
            displayText: stop.value,
            type: "function",
            iconHTML: "<i class=\"icon function\">f</i>"
          });
          break;
        case "entity":
          for(var sel of ["@s","@a","@e","@p","@r"]) {
            out.push({
              text: sel,
              type: "id",
              iconHTML: "<i class=\"icon player\">@</i>"
            });
          }
          break;
        case "boolean":
          out.push({
            text: "true",
            type: "boolean",
            iconHTML: "<i class=\"icon string\">s</i>"
          });
          out.push({
            text: "false",
            type: "boolean",
            iconHTML: "<i class=\"icon string\">s</i>"
          });
          break;
        case "number":
          out.push({
            text: String(stop.default || 0),
            displayText: stop.value,
            type: "number",
            iconHTML: "<i class=\"icon number\">123</i>"
          });
          break;
        case "greedy":
          out.push({
            text: "\n",
            displayText: stop.value,
            replacementPrefix: "",
            type: "string",
            iconHTML: "<i class=\"icon string\">s</i>"
          });
          break;
        case "end":
          break;
        case "json-string":
          out.push({
            text: `""`,
            displayText: `"" stop.value`,
            type: "json",
            iconHTML: "<i class=\"icon json\">JS</i>"
          });
          out.push({
            text: `{}`,
            displayText: `{} ${stop.value}`,
            type: "json",
            iconHTML: "<i class=\"icon json\">JS</i>"
          });
          out.push({
            text: `[]`,
            displayText: `[] ${stop.value}`,
            type: "json",
            iconHTML: "<i class=\"icon json\">JS</i>"
          });
          break;
        case "string":
        default:
          out.push({
          snippet: "${1:" + stop.value + "}",
          displayText: stop.value,
          type: "string",
          iconHTML: "<i class=\"icon string\">s</i>"
        });
      }
    }
    return out;
  },

  getCommandOption: function(text) {
    var out = [];
    for(var cmd of Object.values(commands.commands)) {
      if(cmd.name.startsWith(text)) {
        var cmdObj = {
          text: cmd.name,
          type: "command",
          iconHTML: "<i class=\"icon command\">/</i>",
          command: cmd
        };
        out.push(cmdObj);
      }
    }
    return out;
  }
};
