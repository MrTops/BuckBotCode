const { MessageEmbed } = require("discord.js");
const { out } = require("../util/Log");
const { RandomNumber } = require("../util/RandomNumber");
const randomColor = require("randomcolor");

module.exports.exec = async (client, message, args, options) => { // The exec function is called when the command's trigger words are said.
/*
What are the args
client   | The client that got the command, note, the bot is sharded
message  | The message object that triggered the command
Args     | Args provided by the user, these are seperated by space example pb.boop Hello, there -> ["Hello,", "there"]
Options? | Options are a neat feature that I want to go into more detail but I'll give a little example here pb.boop Hello, there -option -> ["option"]
*/

    let response = await message.channel.send(new MessageEmbed()
        .setTitle(`B${"e".repeat(RandomNumber(2, 5))}p`)
        .setColor(randomColor({
            luminosity: "bright"
        }))
        .setTimestamp()
        .setDescription(`Args: ${args.join(', ')}\nOptions: ${options.join(', ')}`)
    ).catch(err=>out(err));

    response.delete({ timeout: 15000 }).catch(err=>out(err));

};

module.exports.info = {
    command: "boop", //The main trigger word, required
    aliases: ["b00p"], //A array of alternate trigger words, not required
    options: true, //Which options should pass, this isn't required, if true all, if false or isn't there none, if it's a array only the ones in the array pass, the rest go to args
    //options: ["t", "x"]
    category: "Misc", //category is just a string of which category to put it into, this is case sensitive, isn't required, if not given it won't be shown
    deleteTrigger: true //should the message that triggered the command be deleted
};