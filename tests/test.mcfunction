advancement grant @p only minecraft:story/root yeet
blockdata ~ ~ ~ {nbt: "yeet"}
defaultgamemode spectator
clone ~ ~ ~ ~ ~ ~ ~ ~ ~ filtered normal minecraft:grass_path yeet
effect @a minecraft:hero_of_the_village 50 0 true
gamemode survival @r
fill ~ ~ ~ ~ ~ ~ minecraft:air 0 outline {}
gamerule keepInventory true
say hello world @e foobar
particle snowshovel ~ ~ ~ 1 1 1 0 1 force @s woo hoo yeah! yeeeee
enchant @p minecraft:protection
give @a nether_brick_stairs 64 0 {ench:[{lvl:64, id:16}]}
kill @p
recipe take @a minecraft:iron_chestplate
replaceitem block ~ ~ ~ slot.armor.head minecraft:dye 1 0 {}
scoreboard teams option foobar seeFriendlyInvisibles true
spreadplayers ~ ~ 0 10 true @e
stats entity @p[foo = bar] set AffectedBlocks @p objective
