const { ShardingManager } = require(`discord.js`);
const { Token } = require(`./Config.json`);
const { out } = require("./util/Log");

const shardingManager = new ShardingManager(
    `./Bot.js`,
    { token: Token }
);

shardingManager.on('shardCreate', (shard) => {
    out(`Spawned Shard: ${shard.id}`);
    shard.on('disconnect', () => {
        out(`Shard disconnect: ${shard.id}`);
    });
});

shardingManager.spawn();