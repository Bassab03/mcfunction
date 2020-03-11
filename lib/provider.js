const commands = require("./commands.json");
const blocks = require("./id/block.json");
const effects = require("./id/effect.json");
const advancements = require("./id/advancement.json");
const enchantments = require("./id/enchantment.json");
const items = require("./id/item.json");
const recipes = require("./id/recipe.json");
const slots = require("./id/slot.json");
const entities = require("./id/entity.json");

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
// To generate spawn eggs
for(let ent of entities){
	items.push(`${ent}_spawn_egg`);
}

// To sort the files in case.
items.sort();
blocks.sort();
enchantments.sort();
effects.sort();
advancements.sort();

function noop(){}

const fs = require("fs");

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
		if(command["alias"] != null) return this.runCycle(args, commands["commands"][command["alias"]]["cycleMarkers"])["cycle"]
		var cycle = command["cycleMarkers"];
		return this.runCycle(args, cycle)["cycle"];
	},

	runCycle: function(args, cycle) {
		var i = 0;
		var c = 0;
		var realLastStop = null;
		for(; i < args.length; ) {
			var arg = args[i];
			var stop = cycle[c];

			var realStop = stop;
			if (stop["include"] != null) {
				realStop = commands["reference"][stop["include"]];
			}
			if(realStop["type"] == "option" && (realStop["anyValue"] == null || ! realStop["anyValue"])) {
				if(! realStop["value"].includes(arg)) {
					return {
						pos: cycle.length + 1,
						argPos: args.length + 1,
						cycle: {
							type: "end"
						}
					}
				}
			}
			if (realStop["type"] == "option" && realStop["change"] != null && realStop["change"][arg] != null) {
				var cycleRun = this.runCycle(args.slice(i + 1), realStop["change"][arg]);
				i += cycleRun["argPos"] + 1;
				c += 1;
				if(cycleRun["cycle"] != null) return {
					pos: c,
					argPos: i,
					cycle: cycleRun["cycle"]
				}
			} else if(realStop["type"] == "coord") {
				i += 3;
				c += 1;
				if(args.length < i) return {
					pos: c,
					argPos: i,
					cycle: realStop
				}
			} else if(realStop["type"] == "center" || realStop["type"] == "rotation") {
				i += 2;
				c += 1;
				if(args.length < i) return {
					pos: c,
					argPos: i,
					cycle: realStop
				}
			} else if (realStop["type"] == "end") {
				return {
					pos: c,
					argPos: i,
					cycle: cycle[c]
				}
			} else if(realStop["type"] == "command") {
				var cmd = args[i];
				var newCycle = commands["commands"][cmd];
				return {
					pos: cycle.length + 1,
					argPos: args.length + 1,
					cycle: this.getCommandStop(args.slice(i).join(" ") + " !", newCycle)
				}
			} else if(realStop["type"] == "greedy") {
				return {
					pos: cycle.length + 1,
					argPos: args.length + 1,
					cycle: realStop
				}
			} else {
				i++;
				c++;
			}

			if(c >= cycle.length) return {
				pos: c,
				argPos: i,
				cycle: null
			}
			realLastStop = realStop;
		}

		if(cycle[0] != null) {
			var stop = cycle[c];

			var realStop = stop;
			if (stop["include"] != null) {
				realStop = commands["reference"][stop["include"]];
			}
			return {
				pos: c,
				argPos: i,
				cycle: realStop
			}
		}
		return {
			pos: c,
			argPos: i,
			cycle: null
		}
	},

	getSuggestions: function (args) {
		if(! atom.config.get("mcfunction-lang.autocomplete")) return;
		var bufferPos = args.bufferPosition;
		var editor = args.editor;
		var current = this.getCurrentCommand(editor, bufferPos);
		var out = [];
		var lineText = editor.getTextInBufferRange([[bufferPos.row, 0], bufferPos]);
		if(! lineText.includes(" ")) {
			out = this.getCommandOption(lineText);
		} else if(current != null) {

			var splitText = lineText.split(" ");
			var lastText = splitText[splitText.length - 1];

			if(commands["commands"][current] == null) return null;
			var stop = this.getCommandStop(lineText, commands["commands"][current]);
			if(stop == null) return [];

			if(stop["type"] == "command") out = this.getCommandOption(lastText);
			else if(stop["type"] == "option") for(var opt of stop["value"]) {
				if(opt.startsWith(lastText)) out.push({
					text: opt,
					type: "option",
					iconHTML: "<i class=\"icon option\">?</i>"
				});
			} else if(stop["type"] == "block") {
				for(var block of blocks) if(block.startsWith(lastText) || block.replace("minecraft:","").startsWith(lastText)) out.push({
					text: block,
					type: "block",
					iconHTML: "<img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/block.svg\">"
				});
			} else if(stop["type"] == "effect") {
				for(var effect of effects) if(effect.startsWith(lastText) || effect.replace("minecraft:","").startsWith(lastText)) out.push({
					text: effect,
					type: "effect",
					iconHTML: "<i class=\"icon effect\">e</i>"
				});
			} else if(stop["type"] == "advancement") {
				for(var adv of advancements) if(adv.startsWith(lastText) || adv.replace("minecraft:","").startsWith(lastText)) out.push({
					text: adv,
					type: "advancement",
					iconHTML: "<i class=\"icon advancement\">a</i>"
				});
			} else if(stop["type"] == "enchantment") {
				for(var ench of enchantments) if(ench.startsWith(lastText) || ench.replace("minecraft:","").startsWith(lastText)) out.push({
					text: ench,
					type: "enchantment",
					iconHTML: "<i class=\"icon enchantment\" ><img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/enchantment.svg\"></i>"
				});
			} else if(stop["type"] == "entity-id") {
				for(var ent of entities) if(ent.startsWith(lastText) || ent.replace("minecraft:","").startsWith(lastText)) out.push({
					text: ent,
					type: "entity-id",
					iconHTML: "<i class=\"icon entity\">a</i>"
				});
			} else if(stop["type"] == "item") {
				for(var item of items) if(item.startsWith(lastText) || item.replace("minecraft:","").startsWith(lastText)) out.push({
					text: item,
					type: "item",
					iconHTML: "<i class=\"icon item\" ><img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/item.svg\"></i>"
				});
			} else if(stop["type"] == "recipe") {
				for(var recipe of recipes) if(recipe.startsWith(lastText) || recipe.replace("minecraft:","").startsWith(lastText)) out.push({
					text: recipe,
					type: "recipe",
					iconHTML: "<i class=\"icon recipe\" ><img style=\"width:1.5em; height:1.5em;\" src=\"" + __dirname + "/svgicon/recipe.svg\"></i>"
				});
			} else if(stop["type"] == "iventory-slot") {
				for(var slot of slots["inventory"]) if(slot.startsWith(lastText)) out.push({
					text: slot,
					type: "slot",
					iconHTML: "<i class=\"icon slot\">s</i>"
				});
			} else if(stop["type"] == "scoreboard-slot") {
				for(var slot of slots["scoreboard"]) if(slot.startsWith(lastText)) out.push({
					text: slot,
					type: "slot",
					iconHTML: "<i class=\"icon slot\">s</i>"
				});
			} else if(stop["type"] == "objective") {
				for(var slot of slots["objective"]) if(slot.startsWith(lastText)) out.push({
					text: slot,
					type: "slot",
					iconHTML: "<i class=\"icon slot\">o</i>"
				});
			}
			else if(stop["type"] == "coord") out.push({
				text: "~ ~ ~",
				displayText: stop["value"],
				type: "coord",
				iconHTML: "<i class=\"icon coord\">~</i>"
			});
			else if(stop["type"] == "center") out.push({
				text: "0",
				displayText: stop["value"],
				type: "center",
				iconHTML: "<i class=\"icon coord\">~</i>"
			});
			else if(stop["type"] == "rotation") out.push({
				text: "0",
				displayText: stop["value"],
				type: "rotation",
				iconHTML: "<i class=\"icon rotation\">r</i>"
			});
			else if(stop["type"] == "nbt") out.push({
				snippet: "{$1}",
				displayText: stop["value"],
				type: "nbt",
				iconHTML: "<i class=\"icon nbt\">{}</i>"
			});
			else if(stop["type"] == "id") out.push({
				snippet: "${1:" + stop["value"] + "}",
				displayText: stop["value"],
				type: "id",
				iconHTML: "<i class=\"icon id\">ID</i>"
			});
			else if(stop["type"] == "function") out.push({
				snippet: "${1:" + stop["value"] + "}",
				displayText: stop["value"],
				type: "function",
				iconHTML: "<i class=\"icon function\">f</i>"
			});
			else if(stop["type"] == "entity") {
				for(var sel of ["@s","@a","@e","@p","@r"]) out.push({
					text: sel,
					type: "id",
					iconHTML: "<i class=\"icon player\">@</i>"
				});
			} else if(stop["type"] == "boolean") {
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
			} else if(stop["type"] == "string") out.push({
				snippet: "${1:" + stop["value"] + "}",
				displayText: stop["value"],
				type: "string",
				iconHTML: "<i class=\"icon string\">s</i>"
			});
			else if(stop["type"] == "greedy") out.push({
				text: "\n",
				displayText: stop["value"],
				replacementPrefix: "",
				type: "string",
				iconHTML: "<i class=\"icon string\">s</i>"
			})
		}
		return out;
	},

	getCommandOption: function(text) {
		var out = [];
		for(var cmd of Object.values(commands["commands"])) {
			if(cmd["name"].startsWith(text)) {
				var cmdObj = {
					text: cmd["name"],
					type: "command",
					iconHTML: "<i class=\"icon command\">/</i>",
					command: cmd
				};
				out.push(cmdObj);
			}
		}
		return out;
	}
}
