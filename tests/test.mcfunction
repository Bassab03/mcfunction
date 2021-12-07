weather clear 12000
trigger foobar add 123
whitelist remove @p
worldborder add 0 1
worldborder center ~ ~
worldborder get
worldborder set 0
worldborder damage buffer 0
xp 123L @p
bossbar add id {"text":"efooo"}
data get block ~ ~ ~ my.path[0]."name" 0
data get entity @p my.path[0]."name" 1
data merge block ~ ~ ~ {}
data merge entity @p {}
data remove entity @p my.path[0]."name"
datapack disable name
datapack enable name before existing
datapack list available
tp @p ~ ~ ~
time set midnight
effect give @p minecraft:speed 10 1 true
