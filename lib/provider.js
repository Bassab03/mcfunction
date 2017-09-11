const commands = require("./commands.json");

const blocks = require("./id/block.json");
const effects = require("./id/effect.json");
const advancements = require("./id/advancement.json");
const enchantments = require("./id/enchantment.json");
const items = require("./id/item.json");

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
			} else if(c == " " && block.length > 0) aux += "-";
			else aux += c;
		}

		var args = aux.split(" ").slice(1, -1);
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

			if (realStop["type"] == "option" && realStop["change"] != null && realStop["change"][arg] != null) {
				var cycleRun = this.runCycle(args.slice(i + 1), realStop["change"][arg]["cycle"]);
				i += cycleRun["pos"];
				c += cycleRun["pos"];
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
					cycle: null
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
	},

	getSuggestions: function (args) {
		if(! atom.config.get("mcfunction.autocomplete")) return;
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
				for(var block of blocks) if(block.startsWith(lastText)) out.push({
					text: block,
					type: "block",
					iconHTML: "<i class=\"icon block\">b</i>"
				});
			} else if(stop["type"] == "effect") {
				for(var effect of effects) if(effect.startsWith(lastText)) out.push({
					text: effect,
					type: "effect",
					iconHTML: "<i class=\"icon effect\">e</i>"
				});
			} else if(stop["type"] == "advancement") {
				for(var adv of advancements) if(adv.startsWith(lastText)) out.push({
					text: adv,
					type: "advancement",
					iconHTML: "<i class=\"icon advancement\">e</i>"
				});
			} else if(stop["type"] == "enchantment") {
				for(var ench of enchantments) if(ench.startsWith(lastText)) out.push({
					text: ench,
					type: "enchantment",
					iconHTML: "<i class=\"icon enchantment\">e</i>"
				})
			} else if(stop["type"] == "item") {
				for(var item of items) if(ench.startsWith(lastText)) out.push({
					text: item,
					type: "item",
					iconHTML: "<i class=\"icon item\">i</i>"
				});
			}
			else if(stop["type"] == "coord") out.push({
				text: "0",
				displayText: stop["value"],
				type: "coord",
				iconHTML: "<i class=\"icon coord\">~</i>"
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
			else if(stop["type"] == "entity") out.push({
				snippet: "${1:" + stop["value"] + "}",
				displayText: stop["value"],
				type: "entity",
				iconHTML: "<i class=\"icon player\">@</i>"
			});
			else if(stop["type"] == "string" || stop["type"] == "greedy") out.push({
				snippet: "${1:" + stop["value"] + "}",
				displayText: stop["value"],
				type: "string"
			});
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