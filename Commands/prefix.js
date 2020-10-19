const { MessageEmbed, Permissions } = require("discord.js");
const { out } = require("../util/Log");
const randomColor = require("randomcolor");

const removePrefixAction = async (message, args) => {

    let res = await message.GuildInfo.removePrefix(args[0]);
    message.channel.send(new MessageEmbed()
        .setTitle(res === true ? `Successfully removed a Prefix` : `Failed to remove a Prefix`)
        .setDescription(`${res === true ? `Removed` : `Failed to Remove`} \`\`${args[0]}\`\` from the prefix list\nYou can check for sure by pinging the bot.`)
        .setColor(res === true ? randomColor({ luminosity: 'light', hue: 'green' }) : randomColor({ luminosity: 'light', hue: 'red' }))
        .setFooter(`will dismiss in 15 seconds`)
        .setTimestamp()
    ).then(res=>res.delete({ timeout: 15000 }).catch(err=>out(err))).catch(err=>out(err));

};

const addPrefixAction = async (message, args) => {

    let res = await message.GuildInfo.addPrefix(args[0]);
    message.channel.send(new MessageEmbed()
        .setTitle(res === true ? `Successfully added a Prefix` : `Failed to add a Prefix`)
        .setDescription(`${res === true ? `Added` : `Failed to add`} \`\`${args[0]}\`\` from the prefix list\nYou can check for sure by pinging the bot.`)
        .setColor(res === true ? randomColor({ luminosity: 'light', hue: 'green' }) : randomColor({ luminosity: 'light', hue: 'red' }))
        .setFooter(`will dismiss in 15 seconds`)
        .setTimestamp()
    ).then(res=>res.delete({ timeout: 15000 }).catch(err=>out(err))).catch(err=>out(err));

};

module.exports.exec = async (client, message, args, options) => {

    if (!message.guild.member(message).hasPermission(Permissions.FLAGS.MANAGE_GUILD)) {
        message.channel.send(new MessageEmbed()
            .setTitle("You need the \`\`MANAGE_GUILD\`\` to do this")
            .setFooter("will dismiss in 15 seconds")
            .setColor(randomColor({
                luminosity: 'light',
                hue: 'red'
            }))
            .setTimestamp()
        ).then(res=>res.delete({ timeout: 15000 }).catch(err=>out(err))).catch(err=>out(err));
        return;
    }

    switch (options[0]) {

        case "-remove":
            removePrefixAction(message, args);
            break;

        case "-add":
            addPrefixAction(message, args);
            break;

        default:
            addPrefixAction(message, args);
            break;

    }

};

module.exports.info = {
    command: "prefix",
    category: "Admin",
    options: ["remove", "add"]
};