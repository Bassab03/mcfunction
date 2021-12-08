fill ~ ~ ~ ~ ~ ~ minecraft:grass_path replace minecraft:dirt
function namespace:name
give @p minecraft:coal 64
particle barrier ~ ~ ~ 1 1 1 0 1 normal @p params are fun
particle barrier ~ ~ ~
particle block block ~ ~ ~
particle barrier ~ ~ ~ 1 1 1 0 1 normal @p
particle block minecraft:air ~ ~ ~ ~ ~ ~ 0 0 0 1 force @p
particle barrier ~ ~ ~ ~ ~ ~ 0 0 0 1 normal @r
particle item minecraft:gold_nugget ~ ~ ~ ~ ~ ~ 0 0 0 1 normal @e
setblock ~ ~ ~ minecraft:air keep
tellraw @p {"text":"example"}
team list team
team add foo {"text":"my team name"}
team join team @p
team modify example collisionRule pushOtherTeams
replaceitem entity @p slot.container.10 minecraft:emerald 1
replaceitem block ~ ~ ~ slot.container.12 minecraft:nether_star 1
loot replace block ~ ~ ~ slot.container.11 fish
loot replace entity @p slot.container.13 0 loot
loot give @p
loot spawn ~ ~ ~ loot empty
schedule function foo 
