# mcfunction-1.15 for Atom

A syntax highlighter, auto-complete provider and snippet package for Minecraft 1.15
function files, built for the [Atom editor](https://atom.io/). The autocomplete
provider is *very* competent and almost has an identical feel to Minecraft's native
tab completions.

## Info
This is a fork of https://github.com/MrYurihi/mcfunction.
I have no idea how he made this, but adding and removing entries in a JSON file,
I do know how to do, so I updated it to 1.15. All Credit goes to them.

## Changes
### Added
	data "modify ...."
	data ... "storage" .. from "storage"

	execute store "storage" ...
	execute "positioned"
	execute if score target objective "matches range" .....

	target is now optinal for:
		kill "target"
		effect clear "target"

	gamerule "disableRaids"
	gamerule "doInsomnia"
	gamerule "doImmediateRespawn"
	gamerule "drowningDamage"
	gamerule "fallDamage"
	gamerule "fireDamage"

	scoreboard "get target objective"

	"minecraft:" prefix for NamespacedID
### Removed
	gamerule "structureSaveLocation"
	gamerule "gameLoopFunction"

	execute "offset"
### Missing
	execute store "bossbar"

## IMO
This is the best available package on apm for datapacks in 1.15.  
This is *not* the best available package on apm for datapacks in 1.13.  
For 1.13, use https://github.com/MrYurihi/mcfunction.

## Notes
All thing listed in Missing are so for one or another reason,
I'm currently trying to rewrite the whole package,
and anything that would take a longer time to add,
will be missing until the rewrite is complete.
