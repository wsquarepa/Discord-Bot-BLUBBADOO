const { ShardingManager } = require('discord.js');
const { token } = require("./config.json")
const manager = new ShardingManager('./bot.js', { token: token });

manager.on("shardCreate", shard => {
    // Listeing for the ready event on shard.
    shard.on("ready", () => {
        console.log(`[DEBUG/MASTER] Shard ${shard.id} launched.`)
        // Sending the data to the shard.
        shard.send({type: "shardId", data: {shardId: shard.id}});
    });
});

manager.spawn("auto") //Set automatic amount of shards to spawn
    .catch(error => console.error(`[ERROR/MASTER] Shard failed to spawn.`));