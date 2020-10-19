const { MessageEmbed } = require("discord.js");
const Keyv = require("keyv");
const { DBLink, OwnerId } = require('../Config.json');
const { out } = require("../util/Log");
const randomColor = require('randomcolor');

class UserInfo {

    constructor (user) {
        this.user = user;
        this.keyv = new Keyv(DBLink, { namespace: this.user.id });
    }

    get money () {
        return new Promise( async (resolution, reject) => {
            resolution(await this.keyv.get('money').catch(err=>out(err)) || 0);
        });
    }

    set money (newMoney) {
        if(typeof newMoney != 'number')
        this.keyv.set('money', Math.floor(newMoney));
    }

    get moneyString () {
        return new Promise( async (resolution, reject) => {
            resolution(`$${await this.money/100}`);
        });
    }

    get banned () {
        return new Promise( async (resolution, reject) => {
            if (this.user.id === OwnerId) {
                resolution(false);
                return;
            }
            resolution(await this.keyv.get('banned').catch(err=>out(err)) || false);
        });
    }

    async banUser (reason="NONE SPECIFIED") {
        let wentThrough = await this.keyv.set('banned', true).catch(err=>out(err));
        if (wentThrough === false) return false;
        this.user.send(new MessageEmbed()
            .setTitle(`You are banned`)
            .setDescription(`You are banned from using Buck Bot for\n\`\` ${reason} \`\`\nYou will now be ignored by the bot when typing in commands\nYour data is still intact if you ever get unbanned`)
            .setColor(randomColor({
                luminosity: 'light',
                hue: 'red'
            }))
            .setTimestamp()
            .setFooter(`balance: ${await this.moneyString}`)
        ).catch(err=>out(err));

        return wentThrough;
    }

    async unbanUser () {
        if (await this.banned === false) return false;

        let wentThrough = await this.keyv.set('banned', false).catch(err=>out(err));
        if (wentThrough === false) return false;
        this.user.send(new MessageEmbed()
            .setTitle(`You've been unbanned`)
            .setDescription(`You can now use buck bot\nYour data should have been saved but if it wasn't it was wiped by a admin`)
            .setColor(randomColor({
                luminosity: 'light',
                hue: 'green'
            }))
            .setTimestamp()
            .setFooter(`balance: ${await this.moneyString}`)
        ).catch(err=>out(err));

        return wentThrough;
    }

}

module.exports.UserInfo = UserInfo;