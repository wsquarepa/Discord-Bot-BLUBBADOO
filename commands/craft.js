var userData = require('../userData.json')
const craftables = require("../craftables.json")
const fs = require('fs');
const discord = require("discord.js")

function embed(title, description, color) {
    var embed = new discord.MessageEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    name: 'craft',
	description: 'Craft items!',
    args: false,
    usage: '[item]',
    guildOnly: false,
    aliases: ['create', "make"],
	execute(message, args, mention) {

        if (userData[message.author.id].inventory["craftingbench"] == null || userData[message.author.id].inventory["craftingbench"].amount < 1) {
            message.channel.send(embed("Error", "How do you suppose you craft anything without a craftingbench?", "ff0000"))
            return false
        }

        var keys = Object.keys(craftables)
        const userLevel = userData[message.author.id].level
        const userGems = userData[message.author.id].gems

        if (!args.length) {
            var string = ""
            for (var i = 0; i < keys.length; i++) {
                if (craftables[keys[i]].requirement.level > userLevel || craftables[keys[i]].requirement.gems > userGems) {
                    //skip
                } else {
                    string += keys[i] + "\n"
                }
            }
            message.channel.send("Craftables: \n`" + string + "`")
            return
        }

        if (!keys.includes(args[0])) {
            message.channel.send("`" + args[0] + "` is not an item.")
            return
        }

        const item = craftables[args[0]]
        const requirements = item.requirement

        if (!args[1] || args[1] == 0) {
            args[1] = 1
        }
        args[1] == parseInt(args[1])

        if (userLevel < requirements.level) {
            message.channel.send("You don't meet the level requirements for this item yet. You need to be level " + requirements.level + "!")
            return
        }

        if (userGems < requirements.gems * args[1]) {
            message.channel.send("You don't meet the gem requirements for this item yet. You have to have " + requirements.gems * args[1] + " gems!")
            return
        }

        var ironCost = item.recipie.iron * args[1]
        var woodCost = item.recipie.wood * args[1]
        var glassCost = item.recipie.glass * args[1]
        var stringCost = item.recipie.string * args[1]

        var userIron = 0
        var userWood = 0
        var userGlass = 0
        var userString = 0

        try {
            userIron = userData[message.author.id].inventory["iron"].amount
        } catch {
            //pass
        }

        try {
            userWood = userData[message.author.id].inventory["wood"].amount
        } catch {
            //pass
        }

        try {
            userGlass = userData[message.author.id].inventory["glass"].amount
        } catch {
            //pass
        }

        try {
            userString = userData[message.author.id].inventory["string"].amount
        } catch {
            //pass
        }

        if 
        (
            userIron < ironCost ||
            userWood < woodCost ||
            userGlass < glassCost ||
            userString < stringCost
        ) 
        {
            message.channel.send(embed("Error", `You don't have enough materials to build ${args[1] > 1? "those":"that"} item${args[1] > 1? "s":""}. \n` + 
            `
            **Build cost:**

            ${ironCost} iron
            ${woodCost} wood
            ${glassCost} glass
            ${stringCost} string

            **Your inventory:**

            ${userIron} iron
            ${userWood} wood
            ${userGlass} glass
            ${userString} string

            `, "ff0000"))
            return false
        }

        message.channel.send(embed("Crafting", `Are you sure you want to build ${args[1]} ${args[0]}(s)? \n` + 
        `
        **Build cost:**

        ${ironCost} iron
        ${woodCost} wood
        ${glassCost} glass
        ${stringCost} string

        **Your inventory after building:**

        ${userIron - ironCost} iron
        ${userWood - woodCost} wood
        ${userGlass - glassCost} glass
        ${userString - stringCost} string

        `, "00ff00"))

        var collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {time: 10000})

        collector.on("end", function() {
            message.channel.send("Collect end.")
        })

        collector.on("collect", function(msg) {
            collector.stop()
            if (msg.content.toLowerCase() == "yes" || msg.content.toLowerCase() == "ok") {

                message.channel.send("Since each item you craft takes 1 second, crafting " + args[1] + " " + args[0] + "(s) will take " + args[1] + " second(s). \n" +
                "Please wait...")

                setTimeout(function() {

                    try {
                        userData[message.author.id].inventory["iron"].amount -= ironCost
                    } catch {
                        //pass
                    }
            
                    try {
                        userData[message.author.id].inventory["wood"].amount -= woodCost
                    } catch {
                        //pass
                    }
            
                    try {
                        userData[message.author.id].inventory["glass"].amount -= glassCost
                    } catch {
                        //pass
                    }
            
                    try {
                        userData[message.author.id].inventory["string"].amount -= stringCost
                    } catch {
                        //pass
                    }

                    if (userData[message.author.id].inventory[args[0]]) {
                        userData[message.author.id].inventory[args[0]].amount += craftables[args[0]].result[args[0]].amount * args[1]
                    } else {
                        userData[message.author.id].inventory[args[0]] = {
                            amount: craftables[args[0]].result[args[0]].amount * args[1],
                            uses: craftables[args[0]].result[args[0]].uses
                        }
                    }

                    const xp = (10 * args[1])
                    userData[message.author.id].xp += xp

                    fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)

                    const sendEmbed = embed("Crafting complete", "You created " + craftables[args[0]].result[args[0]].amount * args[1] + " " + args[0] + 
                        "(s). \n It's now in your inventory!", "00ff00").setFooter("+" + xp + " EXP")
                    message.channel.send(sendEmbed)
                }, args[1] * 1000)
            }
        })

        
    }
}