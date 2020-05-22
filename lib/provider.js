const nbtpath = require("./id/path.json");
const commands = require("./commands.json");
const selectors = require("./selectors.json");

// main
let blocks = require("./id/block.json");
let effects = require("./id/effect.json");
let advancements = require("./id/advancement.json");
let enchantments = require("./id/enchantment.json");
let items = require("./id/item.json");
let loots = require("./id/loot_table.json");
let recipes = require("./id/recipe.json");
const slots = require("./id/slot.json");
let entities = require("./id/entity.json");
const structures = require("./id/structures.json");
let biomes = require("./id/biomes.json");
let particles = require("./id/particle.json");
let sounds = require("./id/sounds.json");
let attributes = require("./id/attribute.json");

// To generate all stuff for objectives.
(()=>{
  const tmp = [];
  for(let it of items){
    tmp.push("minecraft.picked_up" + it.replace(":","."));
    tmp.push("minecraft.dropped:" + it.replace(":","."));
    tmp.push("minecraft.crafted:" + it.replace(":","."));
    tmp.push("minecraft.broken:" + it.replace(":","."));
    tmp.push("minecraft.used:" + it.replace(":","."));
  }
  for(let it of entities){
    tmp.push("minecraft.killed:" + it.replace(":","."));
    tmp.push("minecraft.killed_by:" + it.replace(":","."));
  }
  for(let it of blocks){
    tmp.push("minecraft.mined:" + it.replace(":","."));
  }
  slots.objective = slots.objective.concat(tmp);
  slots.objective.sort();
})();
// To generate all stuff for loot tables.
(()=>{
  const tmp = [];
  for(let it of blocks){
    tmp.push("minecraft:blocks/" + it);
    tmp.push("minecraft:mine/" + it);
  }
  loots = loots.concat(tmp);
})();
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
recipes.sort();
blocks.sort();
enchantments.sort();
effects.sort();
advancements.sort();
particles.sort();
sounds.sort();
entities.sort();
effects.sort();
loots.sort();
attributes.sort();
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
const recipes2 = recipes.slice();
const attributes2 = attributes.slice();

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
    recipes = recipes2.slice();
    attributes = attributes2.slice();
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
    noMC(recipes);
    noMC(attributes);
  }
});

function escapeRegex(str){
  return str.replace("\\","\\\\").replace("(","\\(").replace(")","\\)").replace("[","\\[").replace("]","\\]").replace(".","\\.").replace("{","\\{").replace("}","\\}").replace("^","\\^").replace("$","\\$").replace("+","\\+").replace("?","\\?").replace("|","\\|").replace("*","\\*");
}

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
    var cycle = Array.from(command.cycleMarkers);
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
      if(realStop.type == "option") {
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
        console.log(cycle);
        i += 3;
        c += 1;
        if(args.length < i) return {
          pos: c,
          argPos: i,
          cycle: realStop
        };
      } else if(realStop.type == "particle") {
        if(args[0] == "block" || args[0] == "minecraft:block"){
          cycle.splice(c + 1,0,{
            type: "block",
            value: "block"
          });
        } else if (args[0] == "item" || args[0] == "minecraft:item") {
          cycle.splice(c + 1,0,{
            type: "item",
            value: "item"
          });
        } else if(args[0] == "dust" || args[0] == "minecraft:dust"){
          cycle.splice(c + 1,0,{
            type: "number",
            value: "R",
            default: 1.0
          },
          {
            type: "number",
            value: "G",
            default: 1.0
          },
          {
            type: "number",
            value: "B",
            default: 1.0
          });
        }
        i++;
        c++;
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

      var splitText = lineText.match(/(?:[^\s\[{}\]"]+|"[^"]*"?|\[[^[\[\]]*\]?|\{[^{}]*\}?)+/g);
      if(lineText[lineText.length - 1] == " "){
        splitText.push("");
      }
      var lastText = splitText[splitText.length - 1];

      if(commands.commands[current] == null) {
        return null;
      }
      var stop = this.getCommandStop(lineText, commands.commands[current]);
      if(stop == null) {

        return [];
      }

      out = this.getOutput(lastText, stop);

    }
    return out;
  },

  getOutput: function (lastText, stop, n) {
    // returns the string with/without "minecraft:"
    function shouldPrependMC(data,n) { // credits to jan00bl
      data = (n && "!" || "") + data;
      if (data.startsWith(lastText) || data.replace("minecraft:","").startsWith(lastText)) {
        let cut = lastText;
        let output = data;
        if(data.replace((n && "!" || "") + "minecraft:","").startsWith(lastText) && lastText != ""){
          output = data.replace((n && "!" || "") + "minecraft:","");
        }
        while(/\.|:|\//g.test(cut)){ // find last string after ". : or /"
          cut = cut.replace(cut.slice(0,cut.search(/\.|:|\//g) + 1),"");
          output = output.replace(output.slice(0,output.search(/\.|:|\//g) + 1),"");
        }
        return output;
      } else {
        return data;
      }
    }
    let out = [];
    switch(stop.type){
      case "command":
        out = this.getCommandOption(lastText);
        break;
      case "option":
        for(var opt of stop.value) {
          if (typeof opt == "object" && new RegExp(opt.match,"g").test(lastText)) {
            out = out.concat(this.getOutput(lastText,opt));
          } else if(opt.startsWith(lastText)) {
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
              text: shouldPrependMC(block),
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
              text: shouldPrependMC(effect),
              type: "effect",
              iconHTML: "<i class=\"icon effect\">e</i>"
            });
          }
        }
        break;
      case "advancement":
        for(var adv of advancements) {
          if(adv.search(escapeRegex(lastText)) != -1) {
            out.push({
              text: shouldPrependMC(adv),
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
              text: shouldPrependMC(ench),
              type: "enchantment",
              iconHTML: "<i class=\"icon enchantment\" ><img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/enchantment.svg\"></i>"
            });
          }
        }
        break;
      case "entity-id":
        for(var ent of entities) {
          if(((n && "!" || "") + ent).startsWith(lastText) || ((n && "!" || "") + ent).replace("minecraft:","").startsWith(lastText)) {
            out.push({
              text: shouldPrependMC(ent,n),
              type: "entity-id",
              iconHTML: "<i class=\"icon entity\">a</i>"
            });
          }
        }
        break;
      case "attribute":
        for(var attr of attributes) {
          if(attr.startsWith(lastText) || attr.replace("minecraft:","").startsWith(lastText)) {
            out.push({
              text: shouldPrependMC(attr),
              type: "enchantment",
              iconHTML: "<i class=\"icon attribute\" >ATR</i>"
            });
          }
        }
        break;
      case "item":
        for(var item of items) {
          if(item.startsWith(lastText) || item.replace("minecraft:","").startsWith(lastText)) {
            out.push({
              text: shouldPrependMC(item),
              type: "item",
              iconHTML: "<i class=\"icon item\" ><img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/item.svg\"></i>"
            });
          }
        }
        break;
      case "loot":
        for(var loot of loots) {
          if(loot.search(escapeRegex(lastText)) != -1) {
            out.push({
              text: shouldPrependMC(loot),
              type: "loot",
              iconHTML: "<i class=\"icon loot\">LT</i>"
            });
          }
        }
        break;
      case "recipe":
        for(var recipe of recipes) {
          if(recipe.startsWith(lastText) || recipe.replace("minecraft:","").startsWith(lastText)) {
            out.push({
              text: shouldPrependMC(recipe),
              type: "recipe",
              iconHTML: "<i class=\"icon recipe\" ><img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/recipe.svg\"></i>"
            });
          }
        }
        break;
      case "particle":
        for(var part of particles) {
          if(part.search(escapeRegex(lastText)) != -1) {
            out.push({
              text: shouldPrependMC(part),
              type: "particle",
              iconHTML: "<i class=\"icon particle\">P</i>"
            });
          }
        }
        break;
      case "sound":
        for (let s of sounds) {
          if(s.search(escapeRegex(lastText)) != -1) {
            out.push({
              text: shouldPrependMC(s),
              type: "sound",
              iconHTML: "<i class=\"icon sound\">P</i>"
            });
          }
        }
        break;
      case "inventory-slot":
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
          if(slot.search(escapeRegex(lastText)) != -1) {
            out.push({
              text: shouldPrependMC(slot),
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
              text: shouldPrependMC(biome),
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
        if(/\[/g.test(lastText)){
          // in selector
          out = this.getSelectorOption(lastText);
          break;
        }
        for(var sel of ["@s","@a","@e","@p","@r"]) {
          if(!sel.startsWith(lastText)){
            continue;
          }
          out.push({
            text: shouldPrependMC(sel),
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
    return out;
  },

  getSelectorOption: function (text) {
    let out = [];
    let selectorText;
    try{
      selectorText = text.match(/(?<=([@][a-z])\[).*/)[0];
      if(selectorText.split("{").length % 2 == selectorText.split("}").length % 2){ // closed
        const sels = selectorText.split(",");
        const lastText = sels[sels.length - 1];
        for(let sel of selectors){
          if(/=/g.test(lastText) && lastText.split("=")[0].replace(/\s/g,"") == sel.name){ // use value
            out = this.getOutput(lastText.split("=")[1].replace(/(^\s+)|(\s+$)/g,""),sel);
            if(sel.negative && sel.type != "entity-id"){
              const copy = this.getOutput(lastText.split("=")[1].replace(/(^\s+)|(\s+$)/g,""),sel,true);
              for(let item in copy){
                if(copy[item].snippet){
                  copy[item].snippet = copy[item].snippet.split(":")[0] + ":!" + copy[item].snippet.split(":")[1];
                }else if(copy[item].text){
                  copy[item].text = "!" + copy[item].text;
                }
                if(copy[item].displayText){
                  copy[item].displayText = "!" + copy[item].displayText;
                }
              }
              out = out.concat(copy);
            }else if(sel.type == "entity-id"){
              out = out.concat(this.getOutput(lastText.split("=")[1].replace(/(^\s+)|(\s+$)/g,""),sel,true));
            }
            break;
          }else if(sel.name.startsWith(lastText.replace(/\s/g,""))){
            out.push({
              text: sel.name,
              type: "selector",
              iconHTML: "<i class=\"icon selector\">s</i>"
            });
          }
        }
      }
    }catch(err){}
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
