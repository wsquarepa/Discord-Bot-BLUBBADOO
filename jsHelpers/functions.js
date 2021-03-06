const discord = require('discord.js')
const fs = require('fs')
var userData = require('../userData.json')
const guildData = require("../guildData.json")
const achivements = require("./achivements")

module.exports = {
    embed: function embed(title, description, color) {
        var embed = new discord.MessageEmbed()
            .setAuthor(title)
            .setDescription(description)
            .setColor(color)
        return embed
    },

    makeid: function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789'; //Capital I and lowercase l have been removed for readiness purposes.
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },

    randomNumber: function randomNumber(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    save: function save(filePath, object) {
        fs.writeFile(filePath, JSON.stringify(object), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
    },

    shuffle: function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    },

    emoji: function emoji(id, message) {
        return message.client.emojis.cache.find(x => x.id == id).toString()
    },

    isEmpty: function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },

    giveAchivement: function (messageObject, achivementName) {
        if (achivements[achivementName] !== null) {
            if (!userData[messageObject.author.id].achivements.includes(achivementName)) {
                userData[messageObject.author.id].achivements.push(achivementName)
                if (messageObject.guild) {
                    if (guildData[messageObject.guild.id].settings.achivementMessage) {
                        messageObject.channel.send("**ACHIEVEMENT EARNED!** \n `" + achivementName + "`! \n Do `==advancements` to view your advancements!")
                            .then(function(msg) {
                                if (achivements[achivementName].secret) {
                                    msg.delete({timeout: 5000})
                                }
                            })
                    }
                }
            }
        }
    },

    logMoney: function (message, amount, action, otherUser) {
        var date = new Date()
        fs.appendFile("./money-log.txt", "[" + date.toTimeString() + "] User: " + message.author.tag + " (" + message.author.id + "), Action: " + action + ", Amount: $" 
        + amount + ", Other User: " + otherUser.tag + "(" + otherUser.id + ") \n", 
            (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
    },

    convertToHumanReadableString: function (number) {
        const stringList = number.toString().split("").reverse().join("").match(/.{1,3}/g).reverse()
        for (var i = 0; i < stringList.length; i++) {
            stringList[i] = stringList[i].split("").reverse().join("")
        }
        return stringList.join(" ")
    },

    globalEmbedColor: "2f3237"
}