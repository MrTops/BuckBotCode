const { Client, Collection, MessageEmbed } = require(`discord.js`);
const { readdir } = require(`fs`);
const { out } = require("./util/Log");
const { Token, DefaultPrefix } = require("./Config.json");
const { Category } = require("./Classes/Category");
const { GuildInfo } = require("./Classes/GuildInfo");
const randomColor = require('randomcolor');
const { UserInfo } = require("./Classes/UserInfo");

const Bot = new Client({
    disableMentions: "all"
});

//Functions

//Load commands
Bot.Commands = new Collection();
Bot.Aliases = new Collection();
Bot.Categories = new Collection();
readdir('./Commands', (err, files) => {

    if (err) out(err);
    out(`Loading ${files.length} commands`);
    files.forEach(file => {

        out(`   Loading ${file}`);
        let command = require(`./Commands/${file}`);
        let info = command.info;
        Bot.Commands.set(info.command, command);

        if (info["category"]) {
            if (!Bot.Categories.get(info["category"])) Bot.Categories.set(info["category"], new Category(info["category"]));
            Bot.Categories.get(info["category"]).addCommand(command);
        }
        if (info["aliases"]) {

            out(`       -aliases`);
            info["aliases"].forEach(alias => {
                out(`       ${alias}`);
                Bot.Aliases.set(alias, command);
            });

        }

    });
    out(`Done Loading Commands`)

});

//Events
Bot.on('ready', () => {

    out(`Shard ready`);

});

Bot.on('message', async message => {

    if (message.author.bot) return;
    if (message.channel.type !== "text") return;

    if (await new UserInfo(message.author).banned === true) return;
    message.UserInfo = new UserInfo(message.author);

    if (message.content === `<@!${Bot.user.id}>`) {
        message.delete().catch(err=>out(err));
        message.channel.send(new MessageEmbed()
            .setTitle(`Here's my prefixes for ${message.guild.name}`)
            .setColor(randomColor({
                luminosity: 'light',
                hue: 'purple'
            }))
            .setTimestamp()
            .setFooter('will dismiss in 15 seconds')
            .setDescription((await (new GuildInfo(message.guild)).prefix).join('\n'))
        ).then(res=>res.delete({ timeout: 15000 }).catch(err=>out(err))).catch(err=>out(err));
        return;
    }

    message.GuildInfo = new GuildInfo(message.guild);
    let found = false;
    (await message.GuildInfo.prefix || [DefaultPrefix]).forEach(prefix => {

        if (found) return;

        if (message.content.startsWith(prefix))
            found = prefix;

    });
    if (!found) return;

    let args = message.content.split(" ");
    let command = args.shift().substr(found.length);
    let commandObject = Bot.Commands.get(command) || Bot.Aliases.get(command);
    if (!commandObject) return;
    let options = args.filter(arg => {

        if (!arg.startsWith("-")) return false;
        if (!commandObject.info["options"]) return false;
        if (commandObject.info["options"] === true) return true;
        return commandObject.info["options"].includes(arg.substr(1));

    });
    args = args.filter(arg => !options.includes(arg));

    if (commandObject.info["options"])
        commandObject.exec(Bot, message, args, options);
    else
        commandObject.exec(Bot, message, args);
    if (commandObject.info["deleteTrigger"] != false) message.delete().catch(err=>out(err));

});

//Login
Bot.login(Token);