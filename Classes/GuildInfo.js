const Keyv = require("keyv");
const { out } = require("../util/Log");
const { DBLink, DefaultPrefix } = require("../Config.json");

class GuildInfo {

    constructor (guild) {
        this.guild = guild;
        this.keyv = new Keyv(`${DBLink}`, { namespace: this.guild.id });
    }

    get prefix() {
        return new Promise( async (resolve, reject) => {
            resolve((await this.keyv.get("prefix").catch(err=>out(err))) || [DefaultPrefix]);
        });
    }

    set prefix(newPrefix) {
        this.keyv.set("prefix", newPrefix).catch(err=>out(err));
    }

    async addPrefix(newPrefix) {
        try {
            let prefix = await this.prefix
            prefix.push(newPrefix);
            this.prefix = prefix;
            return true;
        } catch {
            return false;
        }
    }

    async removePrefix(toRemove) {
        //attempts to remove the given prefix, if none is removed it will do nothing
        if (toRemove === DefaultPrefix) return false;
        if ((await this.prefix).length - 1 === 0) return false; 
        let found = (await this.prefix).some(prefix=>prefix==toRemove);
        this.prefix = (await this.prefix).filter(prefix=>prefix!=toRemove);
        return found;
    }

    async resetPrefixes() {
        this.prefix = [DefaultPrefix];
    }

}

module.exports.GuildInfo = GuildInfo;