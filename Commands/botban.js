const { MessageEmbed, Permissions, User, GuildMember } = require("discord.js");
const { out } = require("../util/Log");
const randomColor = require("randomcolor");
const { OwnerId } = require('../Config.json');
const { UserInfo } = require("../Classes/UserInfo");

const banUserAction = async (message, args) => {

    let target = message.guild.member(args[0]) || message.mentions.members.first();
    if (target instanceof GuildMember) target = target.user;
    if (!target instanceof User) return;
    let userInfo = new UserInfo(target);

    args.shift();
    if (args.length !== 0)
        userInfo.banUser(args.join(' '));
    else
        userInfo.banUser();

};

const unbanUserAction = async (message, args) => {

    let target = message.guild.member(args[0]) || message.mentions.members.first();
    if (target instanceof GuildMember) target = target.user;
    if (!target instanceof User) return;
    let userInfo = new UserInfo(target);

    userInfo.unbanUser()

};

module.exports.exec = async (client, message, args, options) => {

    if (!message.author.id === OwnerId) {
        message.channel.send(new MessageEmbed()
            .setTitle(`You aren't the owner`)
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

        case "-ban":
            banUserAction(message, args);
            break;

        case "-unban":
            unbanUserAction(message, args);
            break;

        default:
            banUserAction(message, args);
            break;

    }

};

module.exports.info = {
    command: "botban",
    options: ["ban", "unban"]
};