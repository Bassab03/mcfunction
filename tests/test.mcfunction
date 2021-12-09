tellraw @a {"text":"example"}
tag @p add fooa
data merge block ~ ~ ~ {foo:"bar"}
data modify block ~ ~ ~ my.path[0]."to modify" insert 0 from block ~ ~ ~ my.path[0]."to get"
replaceitem entity @p slot.container.10 minecraft:iron_nugget
forceload add ~ ~ ~ ~
forceload remove ~ ~ ~ ~
forceload query ~ ~
