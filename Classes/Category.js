//A class that is a container for a group of related commands

class Category {
    
    constructor (name) {
        this.name = name;
        this.commands = [];
    }

    addCommand (command) {
        this.commands.push(command);
    }

}

module.exports.Category = Category;