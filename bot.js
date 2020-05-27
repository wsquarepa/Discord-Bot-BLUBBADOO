const discord = require('discord.js');
const fs = require('fs')
const auth = require('./auth.json')
const textToPicture = require('text-to-picture')
const sentencer = require('sentencer')
var userData = require('./userData.json')
var shopData = require("./shop.json")
var guildData = JSON.parse(fs.readFileSync("./guildData.json"))

var client = new discord.Client();

const token = auth.token

client.on("ready", async () => {
    console.log("Bot ready.")
    console.log("Discord socialspy: Ready. Type ==socialSpy to turn on")
    console.log("Socialspy - messages recieved after on:")
    client.user.setActivity("a game that is telling you that the prefix is '=='")
    client.user.setStatus("online")
});

const prefix = '==';
var trustedPeople = ["509874745567870987", "536659745420083208"]

var socialSpyOn = false
var phoneUser = ""
var connectMessageShown = false
var phoners = {}

//#region - Functions

function embed(title, description, color) {
    var embed = new discord.RichEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789'; //Capital I and lowercase l have been removed for readiness purposes.
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function randomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function saveCoins(coins, message) {
    fs.writeFile("./userData.json", JSON.stringify(coins), (err) => err !== null ? message.channel.send(embed("An error occured", err.toString(), "ff0000")) : null)
}

function AddSecondsToDate(date, seconds) {
    return new Date(date.getTime() + (seconds * 1000));
}

function getUntilTime(msg, name) {
    var userCooldowns = userData[msg.author.id].cooldowns
    var now = new Date().getTime()
    for (var i = 0; i < userCooldowns.length; i++) {
        if (userCooldowns[i].name == name) {
            return (userCooldowns[i].endTime - now)
        }
    }
}

function setCooldown(message, seconds, cooldownName) {
    var now = new Date()
    var endTime = AddSecondsToDate(now, seconds).getTime()
    userData[message.author.id].cooldowns.push({name: cooldownName, endTime: endTime})
    saveCoins(userData, message)
}

function inCooldown(msg, name) {
    var userCooldowns = userData[msg.author.id].cooldowns
    var now = new Date().getTime()
    for (var i = 0; i < userCooldowns.length; i++) {
        if (userCooldowns[i].name == name) {
            if (userCooldowns[i].endTime > now) {
                return true
            } else {
                userData[msg.author.id].cooldowns.splice(i, 1)
                return false
            }
        }
    }
}

function setCoins(userID, cashAmount, bankAmount) {
    userData[userID] = {
        cash: cashAmount,
        bank: bankAmount,
        gems: userData[userID].gems,
        inventory: userData[userID].inventory,
        username: userData[userID].username,
        account: userData[userID].account,
        cooldowns: userData[userID].cooldowns
    }
    fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.log(err) : null)
}

function addGems(message, gems) {
    userData[message.author.id] = {
        cash: userData[message.author.id].cash,
        bank: userData[message.author.id].bank,
        gems: userData[message.author.id].gems + gems,
        inventory: userData[message.author.id].inventory,
        username: userData[message.author.id].username,
        account: userData[message.author.id].account,
        cooldowns: userData[message.author.id].cooldowns
    }
    fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.log(err) : null)
}

function emoji(type, stuff) {
    return client.emojis.find(type, stuff).toString()
}

function getMention(message) {
    var args = message.content.split(" ")
    args.splice(0, 1)
    for (var i = 0; i < args.length; i++) {
        args[i] = args[i].trim()
    }

    try {
        return message.guild.members.find((x) => x.nickname == args.join(" ")).user
    } catch {
        try {
            return client.users.find((x) => x.username == args.join(" "))
        } catch {
            return null
        }
    }
}

function getArgs(message) {
    var args = message.content.split(" ")
    args.splice(0, 1)
    for (var i = 0; i < args.length; i++) {
        args[i] = args[i].trim()
    }
    return args
}

function checkMoneyHandeler(message) {
    if (userData[message.author.id].account.type.toLowerCase() == "banned") {
        message.channel.send(embed("Account BANNED", "Uh oh, your account was banned from using the bot. Contact wsquarepa#4447 for more information.", "ff0000"))
        return true
    }

    if (message.author.presence.status == "offline") {
        message.channel.send("You cannot use money commands while your status is 'Invisible'").then(msg => msg.delete(5000))
        return true
    }

    return false
}
//#endregion

client.on("message", (message) => {
    if ((message.author.bot && message.author.id != 596715111511490560) && message.content.startsWith(prefix)) {
        message.channel.send(embed("UMM... NO.", "Yeah... YOU CAN'T DO THAT MR.BOT!", "ff0000"))
        return;
    };

    if (message.content.startsWith(prefix + "socialSpy")) {
        if (message.author.id == 509874745567870987) {
            socialSpyOn = !socialSpyOn
            message.channel.send("Socialspy turned to " + socialSpyOn + ". Check Dev console!")
        } else {
            message.channel.send("What's the point? You can't see it anyway.")
        }
    }

    var mention = message.mentions.users.first()
    var mentions = message.mentions.users
    if (!message.author.bot && socialSpyOn) {
        console.log("Message from " + message.author.username + ": " + message.content)
    }

    if (message.content.startsWith(prefix + 'help')) {
        message.channel.send(embed("Need help? The commands are here:", "https://wsquarepams.github.io/?location=commands", "ffffff").setFooter("β Beta version 1.8.9"))
    }

    if (message.content.toLowerCase().startsWith(prefix + "invite")) {
        message.channel.send("Use this: https://discordapp.com/oauth2/authorize?&client_id=596715111511490560&scope=bot&permissions=8")
        return;
    }

    if (message.content.startsWith(prefix + "ping")) {
        message.channel.send("Getting Ping...").then(function(m) {
            m.edit(`🏓 Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. Discord API Latency is ${Math.round(client.ping)}ms`)
        })
        
    }

    if (message.channel.type == "dm") {
        if (message.author.bot) return

        if (message.content.startsWith(prefix + "find") && message.author.id == "509874745567870987") {
            var args = getArgs(message)
            var usersFound = client.users.findAll((x) => x.username == args.join(" "))
            message.channel.send("Users found: \n" + usersFound.join("\n"))
            return
        }

        if (message.content.startsWith(prefix + "connect") && message.author.id == "509874745567870987") {
            var args = getArgs(message)
            try {
                phoneUser = client.users.find((x) => x.id == args[0]).id
            } catch {
                message.channel.send("Not a valid id.")
                return
            }
            message.channel.send("Connected.")
            connectMessageShown = true
            return
        }

        if (message.content.startsWith(prefix + "disconnect")) {
            client.users.find((x) => x.id == "509874745567870987").send("Disconnected.")
            client.users.find((x) => x.id == phoneUser).send("Disconnected.").then(() => {
                phoneUser = ""
                connectMessageShown = false
            })
            return
        }

        if (message.author.id == "509874745567870987") {
            if (message.content.startsWith(prefix)) return
            try {
                client.users.find((x) => x.id == phoneUser).send(message.content)
            } catch {
                message.channel.send("Nobody is connected with you.")
            }
        } else { 
            if (!connectMessageShown) {
                client.users.find((x) => x.id == "509874745567870987").send("Connected to " + message.author.username + "#" + message.author.discriminator)
                connectMessageShown = true
            }

            client.users.find((x) => x.id == "509874745567870987").send(message.content)
            phoneUser = message.author.id
        }
        return;
    }

    //#region - Moderation TODO:fix troll command

    if (message.content.startsWith(prefix + "ban")) {
        if (!(message.member.hasPermission("BAN_MEMBERS")) && !(message.member.id == 509874745567870987)) {
            message.channel.send(embed("Error", message.author + ", you can't do that!", "ff0000"))
            return;
        }

        if (mention == null) {
            mention = getMention(message)
        }

        if (mention == null) {
            message.channel.send(embed("Error", "Ok. Banning nobody... Wait. That's an error! \n \n \n" + 
            `P.S. Some help:
            1:Only use ==ban <nickname>, not ==ban <nickname> <reason>.
            2:Unfortunatley, I cannot recognise users without a mention that also don't have a nickname. Add a nickname to the user!`, "ff0000"))
            return;
        }
        
        if (mention.id == "509874745567870987") {
            message.channel.send(embed("Error", "Error: You cannot ban <@509874745567870987> with this bot. Try something else.", "ff0000"))
            return;
        }

        if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) {
            message.channel.send(embed("Error", mention.toString() + " can't be punished, silly.", "ff0000"))
            return
        };

        message.channel.send("What's the reason?")
        var collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {maxMatches: 1})
        collector.on('collect', function(msg) {
            collector.stop()
            let reason = msg.content
            message.channel.send(embed("Complete", mention.username + ' has been banned.', "ff0000"))
            mention.send(embed("Uh oh...", mention.username + ", you've been banned from " + message.guild.name + ". They banned you because " + reason)).then(() => {
                message.guild.member(mention).ban(reason)
            })
        })
    }

    if (message.content.startsWith(prefix + "kick") && !(message.content.startsWith(prefix + "kickall"))) {
        if (!(message.member.hasPermission("ADMINISTRATOR")) && !(message.member.id == 509874745567870987)) {
            message.channel.send(embed("Error", message.author + ", you can't do that!", "ff0000"))
            return;
        }

        if (mention == null) {
            mention = getMention(message)
        }

        if (mention == null) {
            message.channel.send(embed("Error", "Ok. Kicking nobody... Wait. That's an error! \n \n \n" + 
            `P.S. Some help:
            1:Only use ==kick <nickname>, not ==kick <nickname> <reason>.
            2:Unfortunatley, I cannot recognise users without a mention that also don't have a nickname. Add a nickname to the user!`, "ff0000"))
            return;
        }

        if (mention.id == "509874745567870987") {
            message.channel.send(embed("Error", "Error: You cannot kick <@509874745567870987> with this bot. Try something else.", "ff0000"))
            return;
        }
        if (message.guild.member(mention).hasPermission("KICK_MEMBERS")) {
            message.channel.send(embed("Error", mention.toString() + " can't be punished, silly.", "ff0000"))
            return
        }

        message.channel.send("What's the reason?")
        var collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {maxMatches: 1})
        collector.on('collect', function(msg) {
            collector.stop()
            let reason = msg.content
            message.channel.send(mention.username + ' has been kicked.')
            mention.send("You have been kicked because: \n" + reason).then(() => {
                message.guild.member(mention).kick(reason)
            })
        })
    }

    if (message.content.startsWith(prefix + "warn") && !(message.content.startsWith(prefix + "warnings"))) {
        console.log(message.member.hasPermission("MANAGE_GUILD"))
        if (message.member.hasPermission("MANAGE_GUILD") || message.member.id == 509874745567870987) {
            if (mention == null) {
                mention = getMention(message)
            }

            if (mention == null) {
                message.channel.send(embed("Error", "Ok. warning nobody... Wait. That's an error! \n \n \n" + 
                `P.S. Some help:
                1:Only use ==warn <nickname>, not ==warn <nickname> <reason>.
                2:Unfortunatley, I cannot recognise users without a mention that also don't have a nickname. Add a nickname to the user!`, "ff0000"))
            }

            if (message.guild.member(mention).hasPermission("MANAGE_GUILD") && message.member.id != 509874745567870987 && message.member.id != 596715111511490560) {
                message.channel.send(mention.toString() + " can't be punished, silly.")
                return;
            }

            var delmsg = new discord.Message()
            message.channel.send("What's the reason?").then(del => delmsg = del)
            var collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {maxMatches: 1})
            collector.on('collect', function(msg) {
                var args = msg.content.split(' ');

                for (var i = 0; i < args.length; i++) {
                    args[i] = args[i].trim()
                }

                var users = {}
                var cmd = args[0]

                fs.readFile("warnings.txt", function (err, buf) {
                    var hashcode = buf.toString()
                    users = hashcode.split('\n')
                });

                console.log(users);

                var reason = ''
                var modifier = false
                var modifiers = []
                var disguiseId = ""
                var existingModifiers = ["silent", "disguise"]

                if (msg.content.includes("-")) {
                    modifier = true
                }

                if (args[0] == null) {
                    message.channel.send(embed("Error", "You must supply a reason.", "ff0000"))
                }

                if (!modifier) {
                    if (args[0] != null) {
                        for (i = 0; i < args.length; i++) {
                            reason += ' ' + args[i]
                        }
                    }
                } else {
                    if (args[0] != null) {
                        for (i = 0; i < args.length; i++) {
                            if (args[i].startsWith("-", 0) && existingModifiers.includes(args[i].replace("-", ""))) {
                                console.log(args[i])
                                if (args[i] == "-disguise") {
                                    disguiseId = mentions.last().id
                                    args.splice(i + 1, 1)
                                }
                                console.log(args)
                                modifiers.push(args[i].replace("-", ""))
                            } else {
                                reason += ' ' + args[i]
                            }
                        }
                    }
                }

                console.log(modifiers)

                reason = reason.replace(" ", "")
                disguiseId = disguiseId.replace(" ", "")

                fs.appendFile("warnings.txt", (mention.id + ',' + reason + ',' + (modifiers.includes("disguise") ? disguiseId : message.author.id.replace(" ", "")) + '\n'), (err) => {
                    if (err) console.log(err);
                    console.log("Successfully Written to File.");
                });

                mention.send(embed("You have been warned in " + message.guild.name.toString(), "Hello " + mention.username.toString() + ", you have been warned in " +
                    message.guild.name.toString() + ".\n The reason why you were warned is: " + reason + ". \n You have been warned by <@!" +
                    (modifiers.includes("disguise") ? disguiseId : message.author.id.replace(" ", "")) + "> and please follow the " +
                    "rules to not be warned!", "ff0000"))

                if (modifiers.includes("silent")) {
                    message.delete()
                    msg.delete()
                    delmsg.delete()
                    return;
                }

                var warningEmbed = embed(mention.username.toString() + " has been warned.", "Reason: " + reason, "ffff00").setFooter("To see how many warnings you have," +
                    "use the ==warnings command.")
                message.channel.send(warningEmbed)
            })
        } else {
            message.channel.send(embed("Error", message.author + ", you can't do that!", "ff0000"))
        }

    }

    if (message.content.startsWith(prefix + "clearWarnings")) {
        message.author.send(embed("Error", "Sorry, but I can't clear warnings yet. Please DM wsquarepa#4447 to ask for deletion!", "ff0000"))
    }

    if (message.content.startsWith(prefix + "warnings")) {
        fs.readFile("warnings.txt", function (err1, buf1) {
            var hashcode1 = buf1.toString()
            var userWarnings = hashcode1.split('\n')

            var len = userWarnings.length
            var occurences = 0
            var reasonString = ''

            if (mention == null) {
                mention = getMention(message)
            }

            if (mention == null) {
                for (i = 0; i < len; i++) {
                    var warning = userWarnings[i].split(',')
                    if (warning[0] == message.author.id) {
                        occurences++
                        reasonString += warning[1] + ", issued by <@" + warning[2] + ">\n"
                    }
                }
                if (occurences > 0) {
                    if (occurences == 1) {
                        var warningEmbed = embed("You have 1 warning.", "The reason is " + reasonString, "ff0000")
                        message.channel.send(warningEmbed)
                    } else {
                        message.channel.send(embed("You have " + occurences.toString() + " warnings.", "Warning reasons: \n" + reasonString, "ff0000"))
                    }
                } else {
                    var warningEmbed = embed("You have no warnings.", "You haven't got any warnings.", "00ff00")
                    message.channel.send(warningEmbed)
                }
            } else {
                for (i = 0; i < len; i++) {
                    var warning = userWarnings[i].split(',')
                    if (warning[0] == mention.id) {
                        occurences++
                        reasonString += warning[1] + ", issued by <@" + warning[2] + ">\n"
                    }
                }

                if (occurences > 0) {
                    if (occurences == 1) {
                        var warningEmbed = embed(mention.username.toString() + " has 1 warning.", "The reason is " + reasonString, "ff0000")
                        message.channel.send(warningEmbed)
                    } else {
                        message.channel.send(embed(mention.username.toString() + " has " + occurences.toString() + " warnings.", "Warning reasons: \n" + reasonString, "ff0000"))
                    }
                } else {
                    var warningEmbed = embed(mention.username.toString() + " has no warnings.", "They haven't got any warnings.", "00ff00")
                    message.channel.send(warningEmbed)
                }
            }
        });
    }

    if (message.content.startsWith("===warn")) { //fix
        if (mention == null) {
            message.channel.send("UH NO")
            return;
        }

        var reason = ""
        var args = message.content.split(' ');
        var modifiers = []
        var disguiseId = ""
        if (args[2] != null) {
            for (i = 2; i < args.length; i++) {
                if (args[i].startsWith("-")) {
                    if (args[i] == "-impose") {
                        disguiseId = mentions.last().id
                        modifiers.push("impose")
                        args.splice(i, i + 1)
                    }
                } else {
                    reason += ' ' + args[i]
                }
            }
        }

        console.log(mention.id)

        var warningEmbed = embed(mention.username.toString() + " has been warned.", "Reason: " + reason, "ffff00").setFooter("To see how many warnings you have," +
            "use the ==warnings command.")
        message.channel.send(warningEmbed)

        if (trustedPeople.includes(parseInt(mention.id), 0) || message.guild.member(mention).hasPermission("ADMINISTRATOR")) {
            mention.send(embed("You have been warned in " + message.guild.name.toString(), "Hello " + mention.username.toString() + ", you have been warned in " +
                message.guild.name.toString() + ".\n The reason why you were warned is: " + reason + ". \n You have been warned by <@" +
                (modifiers.includes("impose") ? disguiseId : message.author.id.replace(" ", "")) + "> and please follow the " +
                "rules to not be warned!", "ff0000").setFooter("Since you're a supporter, a trusted person or an administrator, I'm going to tell you a secret. \n" +
                "1: This message is a trolling command, and did not actually warn you. \n" +
                "2: This message was " + (disguiseId == "" ? "not imposed" : ("imposed and the real sender is " + message.author.username))))

            message.guild.owner.send(embed("Warning!", "Warning: " + message.author.username + " is using a trolling command in your server, " + message.guild.name +
                ", and the warning was " + (disguiseId == "" ? "not imposed" : ("imposed and the real sender is " + message.author.username)) +
                ". If you don't accept these types of things, then warn the user.", "ff0000"))

            return;
        }

        mention.send(embed("You have been warned in " + message.guild.name.toString(), "Hello " + mention.username.toString() + ", you have been warned in " +
            message.guild.name.toString() + ".\n The reason why you were warned is: " + reason + ". \n You have been warned by <@" +
            (modifiers.includes("impose") ? disguiseId : message.author.id.replace(" ", "")) + "> and please follow the " +
            "rules to not be warned!", "ff0000"))

        message.guild.owner.send(embed("Warning!", "Warning: " + message.author.username + " is using a trolling command in your server, " + message.guild.name +
            ". If you don't accept these types of things, then warn the user.", "ff0000"))
    }

    if (message.content.startsWith(prefix + "perms")) {
        var args = message.content.split(" ")
        var permsList = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_CHANNELS", "MANAGE_EMOJIS", "MANAGE_GUILD", "MANAGE_MESSAGES",
            "MANAGE_ROLES", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG", "CREATE_INSTANT_INVITE", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "EMBED_LINKS",
            "ATTACH_FILES", "READ_MESSAGES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "CONNECT", "SPEAK", "STREAM", "MUTE_MEMBERS",
            "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "PRIORITY_SPEAKER"
        ]

        if (mention == null) {
            mention = getMention(message)
        }

        if (mention == null) {
            var myperms = []
            if (message.guild.member(message.author).hasPermission("ADMINISTRATOR")) {
                myperms.push("ADMINISTRATOR")
            } else {
                for (var i = 0; i < permsList.length; i++) {
                    if (message.guild.member(message.author).hasPermission(permsList[i])) {
                        myperms.push(permsList[i])
                    }
                }
            }
            var permsString = myperms.toString().replace(/,/g, "\n")
            message.delete(10000)
            message.channel.send(embed("You have these perms:", permsString, "0000ff").setFooter("This message will dissapear in 10 seconds")).then(d_msg => d_msg.delete(10000))
            return;
        } else {
            var myperms = []
            if (message.guild.member(mention).hasPermission("ADMINISTRATOR")) {
                myperms.push("ADMINISTRATOR")
            } else {
                for (var i = 0; i < permsList.length; i++) {
                    if (message.guild.member(mention).hasPermission(permsList[i])) {
                        myperms.push(permsList[i])
                    }
                }
            }
            var permsString = myperms.toString().replace(/,/g, "\n")
            message.delete(10000)
            message.channel.send(embed(mention.username + " has these perms:", permsString, "0000ff").setFooter("This message will dissapear in 10 seconds")).then(d_msg => d_msg.delete(10000))
        }
    }

    if (message.content.startsWith(prefix + "purge")) {
        if (message.guild.member(message.author).hasPermission("MANAGE_MESSAGES") || message.author.id == 509874745567870987) {
            message.delete().then(function() {
                var args = message.content.split(' ');
                var numberToDelete = args[1]
                var messagecount = 0
                try {
                    messagecount = parseInt(numberToDelete);
                } catch {
                    if (messagecount.toLowerCase() == "all") {
                        messagecount = 100
                    } else {
                        message.channel.send("Type an integer or all next time, will you?")
                    }
                }
                if (messagecount > 100) {
                    message.channel.send("You can not purge more than 100 messages yet.")
                    return;
                }
                message.channel.fetchMessages({
                    limit: messagecount
                }).then(function (messages) {
                    message.channel.bulkDelete(messages, true).then(function (deletedMessages) {
                        message.channel.send(deletedMessages.size + " messages deleted!").then(d_msg => d_msg.delete(2500))
                    }).catch(function (reason) {
                        message.channel.send(embed("An error occured", reason, "ff0000"))
                    })
                });
            })
            
        } else {
            message.channel.send(embed("Error", "<@" + message.author.id + ">, you can't do that.", "ff0000"))
        }
    }

    if (message.content.startsWith(prefix + "mute")) {
        if (mention == null) {
                mention = getMention(message)
        }
            
        if (mention == null) {
            message.channel.send("Next time, mention someone.")
            return;
        }

        if ((message.member.hasPermission("MUTE_MEMBERS") && !message.guild.member(mention).hasPermission("MUTE_MEMBERS")) || message.member.id == "509874745567870987") {

            var mutedRole = message.guild.roles.find((x) => x.name == "Muted")
            console.log(mutedRole)
            if (mutedRole == null) {
                message.guild.createRole(
                    data = {
                        name: 'Muted',
                        color: 'GRAY'
                    },
                    reason = 'Mute command'
                ).then((role) => {
                    role.setPosition(0, false)
                    message.guild.member(mention).addRole(role)
                    message.channel.send("Member muted!")
                })
                return;
            }

            if (!message.guild.member(mention).roles.has(mutedRole.id)) {
                message.guild.member(mention).addRole(mutedRole)
                message.channel.send("Member muted!")
            }

        } else {
            message.channel.send(embed("Error!", `<@${message.author.id}>, you can't do that!`, "ff0000"))
        }
    }

    if (message.content.startsWith(prefix + "unmute")) {

        if (mention == null) {
            mention = getMention(message)
        }

        if (mention === null) {
            message.channel.send("Next time, mention someone.")
            return;
        }

        if (message.member.hasPermission("MUTE_MEMBERS") || message.member.id == "509874745567870987") {
            var mutedRole = message.guild.roles.find((x) => x.name == "Muted")
            console.log(mutedRole)
            if (mutedRole === null) {
                message.channel.send("That role does not exist.")
                return;
            }
            
            if (message.guild.member(mention).roles.has(mutedRole.id)) {
                message.guild.member(mention).removeRole(mutedRole)
                message.channel.send("Member unmuted!")
            }

        } else {
            message.channel.send(embed("Error!", `<@${message.author.id}>, you can't do that!`, "ff0000"))
        }
    }

    //#region - Broken Commands

    if (message.content.startsWith(prefix + "kickall") && trustedPeople.includes(message.author.id)) {
        var protec = makeid(5)
        message.channel.send("Are you sure you want to execute this command? If so, type this: " + protec)
        var collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {maxMatches: 1})
        collector.on("collect", function(msg) {
            if (msg.content == protec) {
                var keys = message.guild.members.keys()
                for (i in keys) {
                    message.guild.member(message.guild.members[i]).kick("SERVER PURGE")
                }
                msg.channel.send("Server prune complete.")
            } else {
                message.channel.send("Wupsos! Wrong key.")
            }
        })
    }

    //#endregion

    if (message.content.toLowerCase().startsWith(prefix + "op")) {

        if (mention == null) {
            mention = getMention(message)
        }

        if (mention == null) {
            message.channel.send("Hmm, you sure you wanna op everyone? I don't think so.")
            return
        }

        if (message.member.hasPermission("ADMINISTRATOR") || message.member.id == "509874745567870987") {
            var role = message.guild.roles.find((x) => x.name == "OP")
            if (role === null) {
                message.guild.createRole(
                    data = {
                        name: 'OP',
                        color: 'DEFAULT'
                    },
                    reason = 'OP role command'
                ).then((role) => {
                    role.setPermissions("ADMINISTRATOR")
                    role.setPosition(1, true)
                    message.guild.member(mention).addRole(role)
                    message.channel.send("Member **OPPED**")
                })
            } else {
                message.guild.member(mention).addRole(role)
                message.channel.send("Member **OPPED**")
            }
        } else {
            message.channel.send(embed("Error!", `<@${message.author.id}>, you can't do that!`, "ff0000"))
        }

    }

    if (message.content.toLowerCase().startsWith(prefix + "deop")) {

        if (mention == null) {
            mention = getMention(message)
        }

        if (mention == null) {
            message.channel.send("No.")
            return
        }

        if (message.member.hasPermission("ADMINISTRATOR") || message.member.id == "509874745567870987") {
            var role = message.guild.roles.find((x) => x.name == "OP")
            if (role === null) {
                message.channel.send("You have to create the OP role first. To create it, name it \"OP\"!")
            } else {
                message.guild.member(mention).removeRole(role)
                message.channel.send("Member **DEOPPED**")
            }
        } else {
            message.channel.send(embed("Error!", `<@${message.author.id}>, you can't do that!`, "ff0000"))
        }
    }

    if (message.content.startsWith(prefix + "suggest")) {
        var suggestion = message.content.slice(prefix.length + 7)
        message.delete()
        message.channel.send(embed(message.author.username + " suggested something!", "Suggestion: " + suggestion, "00cafc"))
    }

    if (message.content.startsWith(prefix + "role")) {

        if (message.guild.member(message.author).hasPermission("MANAGE_ROLES") || message.author.id == "509874745567870987") {
            if (mention == null) {
                mention = getMention(message)
            }
    
            if (mention == null) {
                message.channel.send("You might want to mention someone/say someone's nickname.")
                return
            }
    
            message.channel.send("Add or remove which role? For example, reply 'add Muted' for the user (you or someone else) to enter the role named Muted!")
            var collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {maxMatches: 1})
            collector.on('collect', function(msg) {
                console.log(mention)
                var args = msg.content.split(" ")
                var select = args[0]
                args.splice(0, 1)
                for (var i = 0; i < args.length; i++) {
                    args[i] = args[i].trim()
                }
                var roleName = args.join(" ")
                var role = message.guild.roles.find((x) => x.name == roleName)

                if (!mention) {
                    mention = msg.author
                }

                if (role !== null) {
                    if (select == "add") {
                        message.guild.member(mention).addRole(role).catch(function () {
                            message.channel.send("I don't have permission to give you that role.")
                            return
                        }).then(function() {
                            message.channel.send(mention.username + " entered " + roleName + "!")
                        })
                    } else if (select == "remove" || select == "leave") {
                        message.guild.member(mention).removeRole(role).catch(function () {
                            message.channel.send("I don't have permission to let you leave that role.")
                            return
                        }).then(function() {
                            message.channel.send(mention.username + " left " + roleName + ".")
                        })
                    }
                } else {
                    message.channel.send("That role does not exist.")
                }
            })
        } else {
            message.channel.send(":x: You don't have permission to run that command.")
        }
        
    }
    //#endregion
    //#region - Coins

    //#region - Module Enabling

    if (!guildData[message.guild.id]) {
        guildData[message.guild.id] = {
            warnings: {},
            disabledModules: []
        }
    }

    if (message.content.toLowerCase().startsWith(prefix + "disablemodule coins")) {
        if (message.guild.member(message.author).hasPermission('MANAGE_GUILD')) {
            guildData[message.guild.id].disabledModules.push("coins")
            fs.writeFile("./guildData.json", JSON.stringify(guildData), (err) => err !== null ? message.channel.send(embed("An error occured", err.toString(), "ff0000")) : null)
            message.channel.send("Module COINS disabled.")
        } else {
            message.channel.send(embed("Error", "You can't do that!", "ff0000"))
        }
    }

    if (message.content.toLowerCase().startsWith(prefix + "enablemodule coins")) {
        if (message.guild.member(message.author).hasPermission('MANAGE_GUILD')) {
            guildData[message.guild.id].disabledModules.splice(guildData[message.guild.id].disabledModules.indexOf("coins"), 1)
            fs.writeFile("./guildData.json", JSON.stringify(guildData), (err) => err !== null ? message.channel.send(embed("An error occured", err.toString(), "ff0000")) : null)
            message.channel.send("Module COINS enabled.")
        } else {
            message.channel.send(embed("Error", "You can't do that!", "ff0000"))
        }
    }

    var disabled = false
    for (var i = 0; i < guildData[message.guild.id].disabledModules.length; i++) {
        if (guildData[message.guild.id].disabledModules[i] == "coins") {
            disabled = true
        }
    }

    //#endregion

    if (!disabled) {

        if (!message.author.bot) {
            if (!userData[message.author.id]) {
                userData[message.author.id] = {
                    cash: 0,
                    bank: 0,
                    gems: 0,
                    inventory: {},
                    username: message.author.username,
                    account: {
                        secured: false, 
                        type: "user"
                    },
                    cooldowns: []
                }
            }

            if (userData[message.author.id].username != message.author.username) {
                userData[message.author.id].username = message.author.username
            }

            if (userData[message.author.id].gems == null) {
                userData[message.author.id].gems = 0
            }

            if (userData[message.author.id].account == null) {
                userData[message.author.id].account = {secured: false, type: "user"}
            }

            if (userData[message.author.id].cooldowns == null) {
                userData[message.author.id].cooldowns = []
            }

            let coinAmt = randomNumber(1, 25)
            let baseAmt = randomNumber(1, 25)
            let previousAmt = userData[message.author.id].cash

            if (coinAmt == baseAmt && message.author.presence.status != "offline" && !message.author.bot) {
                setCoins(message.author.id, previousAmt + coinAmt, userData[message.author.id].bank)
            }

            if (message.author.presence.status != "offline" && randomNumber(1, 100) == 23) {
                addGems(message, 1)
            }

            saveCoins(userData, message)
        }

        if (message.content.startsWith(prefix + "money") || message.content.startsWith(prefix + "bal")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            if (mention == null) {
                mention = getMention(message)
            }

            if (mention) {
                
                if (mention.bot) {
                    message.channel.send("Are you crazy the bot obviously doesn't have money")
                    return;
                }

                var cash = userData[mention.id].cash
                var bank = userData[mention.id].bank
                var gems = userData[mention.id].gems
                message.channel.send(embed(mention.username + "'s balance:", "Cash: $" + cash + " \n Bank: $" + bank + "\n Gems: " + gems + "💎", "00ff00"))
                return
            }
            var cash = userData[message.author.id].cash
            var bank = userData[message.author.id].bank
            var gems = userData[message.author.id].gems
            message.channel.send(embed("Your balance:", "Cash: $" + cash + " \n Bank: $" + bank + "\n Gems: " + gems + "💎", "00ff00")
                .setFooter("Account status - locked: " + userData[message.author.id].account.secured))
        }

        if (message.content.startsWith(prefix + "dep")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            var args = message.content.split(" ")
            args.splice(0, 1)
            if (args[0] == null) {
                message.channel.send("Next time, tell me what you want to put in the bank.")
                return
            }
            args[0] = args[0].trim()
            if (args[0] == "all") {
                setCoins(message.author.id, 0, userData[message.author.id].bank + userData[message.author.id].cash)
            } else if (args[0] != null) {
                if ((userData[message.author.id].cash - parseInt(args[0])) < 0) {
                    message.channel.send(embed("Error", "You can't deposit more than you have.", "ff0000"))
                    return;
                }
                setCoins(message.author.id, userData[message.author.id].cash - parseInt(args[0]), userData[message.author.id].bank + parseInt(args[0]))
            }
            message.channel.send(embed("Complete", "You deposited " + (args[0] != "all" ? `$${args[0]}` : "all your money") + " to the bank.", "00ff00"))
        }

        if (message.content.startsWith(prefix + "withdraw")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            var args = message.content.split(" ")
            args.splice(0, 1)
            if (args[0] == null) {
                message.channel.send("Next time, tell me what you want to take out of the bank.")
                return
            }
            args[0] = args[0].trim()
            if (args[0] == "all") {
                setCoins(message.author.id, userData[message.author.id].bank + userData[message.author.id].cash, 0)
            } else if (args[0] != null) {
                if ((userData[message.author.id].bank - parseInt(args[0])) < 0) {
                    message.channel.send(embed("Error", "You can't withdraw more than you have.", "ff0000"))
                    return;
                }
                setCoins(message.author.id, userData[message.author.id].cash + parseInt(args[0]), userData[message.author.id].bank - parseInt(args[0]))
            }
            message.channel.send(embed("Complete", "You withdrew " + (args[0] != "all" ? `$${args[0]}` : "all your money") + " from the bank.", "00ff00"))
        }

        if (message.content.startsWith(prefix + "work")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            if (inCooldown(message, "work")) {
                var timeUntil = getUntilTime(message, "work") / 1000 / 60
                timeUntil = Math.round((timeUntil + Number.EPSILON) * 100) / 100
                message.channel.send(embed("Error", "Try again later. The cooldown is `1h`, and you need to wait **" + timeUntil + "** minutes before you can" + 
                " do that again.", "ff0000"))
                return;
            }
            var earnings = randomNumber(1, 500)
            setCoins(message.author.id, userData[message.author.id].cash + earnings, userData[message.author.id].bank)
            message.channel.send(embed("Work", `You work and earn $${earnings}. It's now in your wallet.`, "00ff00"))
            setCooldown(message, 3600, "work")
        }

        if (message.content.startsWith(prefix + "daily")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            if (inCooldown(message, "daily")) {
                var timeUntil = getUntilTime(message, "daily") / 1000 / 60
                timeUntil = Math.round((timeUntil + Number.EPSILON) * 100) / 100
                message.channel.send(embed("Error", "Try again later. The cooldown is `1d`, and you need to wait **" + timeUntil + "** minutes before you can" + 
                " do that again.", "ff0000"))
                return;
            }
            var earnings = 1500
            setCoins(message.author.id, userData[message.author.id].cash + earnings, userData[message.author.id].bank)
            message.channel.send(embed("Daily", `Daily money! $${earnings} is now added to your wallet.`, "00ff00"))
            setCooldown(message, 86400, "daily")
        }

        if (message.content.startsWith(prefix + "hunt")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            if (inCooldown(message, "hunt")) {
                var timeUntil = getUntilTime(message, "hunt") / 1000 / 60
                timeUntil = Math.round((timeUntil + Number.EPSILON) * 100) / 100
                message.channel.send(embed("Error", "Try again later. The cooldown is `40s`, and you need to wait **" + timeUntil + "** minutes before you can" + 
                " do that again.", "ff0000"))
                return;
            }

            if (userData[message.author.id].inventory["Knife"] == null || userData[message.author.id].inventory["Knife"].amount < 1) {
                message.channel.send(embed("Error", "How do you suppose you hunt without a knife?", "ff0000"))
                return
            }
            userData[message.author.id].inventory.Knife.uses -= 1
            if (userData[message.author.id].inventory.Knife.uses < 1) {
                userData[message.author.id].inventory.Knife.amount -= 1
                userData[message.author.id].inventory.Knife.uses = shopData.Knife.uses
            }
            saveCoins(userData, message)

            var animals = ['wolf', 'deer', 'lion', 'bigfoot', 'rabbit', 'pig', 'cat']
            var number = randomNumber(1, 7) - 1
            var animal = animals[number]
            var chanceO = randomNumber(1, 4) //4
            if (chanceO == 1) {
                message.channel.send(embed("AaAaaaAaaaAAAaaaAAAAaAaaAAAAAaaAAaaaaAAAaaA!", "You got scared away by a " + animal + " and didn't earn anything.", "ff0000"))
                setCooldown(message, 40, "hunt")
                return
            }
            var earnings = randomNumber(50, 200)
            setCoins(message.author.id, userData[message.author.id].cash + earnings, userData[message.author.id].bank)
            message.channel.send(embed("Hunt", `You successfully hunt a ${animal} and earn $${earnings}!`, "00ff00"))
            setCooldown(message, 40, "hunt")
        }

        if (message.content.toLowerCase().startsWith(prefix + "rps")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            var options = ["rock", "paper", "scissors"]
            var args = message.content.split(" ")
            args.splice(0, 1)
            if (args[0] == null) {
                message.channel.send("Next time, tell me what you want to bet.")
                return
            }
            args[0] = args[0].trim()
            if ((userData[message.author.id].cash - parseInt(args[0])) < 0) {
                message.channel.send("Ya can't bet more than you have on hand.")
                return
            }
            message.channel.send("Choose `rock`, `paper` or `scissors`.")
            const collector = new discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                time: 10000,
                maxMatches: 1
            });
            collector.on('collect', message => {
                if (!options.includes(message.content.toLowerCase())) {
                    message.channel.send("Wat you thinking that's not an option")
                    return
                }
                var compOpt = options[randomNumber(1, 3) - 1]
                message.channel.send("I choose " + compOpt + ".")
                var messageContent = message.content.toLowerCase()
                var win = undefined
                if (compOpt == "rock") {
                    if (message.content.toLowerCase() == "paper") {
                        message.channel.send("WhyYyYyyyyYYYYyyyY I lose")
                        win = true
                    } else if (messageContent == "scissors") {
                        message.channel.send("Yay I win")
                        win = false
                    } else {
                        message.channel.send("Why is it a TIE")
                    }
                } else if (compOpt == "paper") {
                    if (message.content.toLowerCase() == "scissors") {
                        message.channel.send("WhyYyYyyyyYYYYyyyY I lose")
                        win = true
                    } else if (messageContent == "rock") {
                        message.channel.send("Yay I win")
                        win = false
                    } else {
                        message.channel.send("Why is it a TIE")
                    }
                } else {
                    if (message.content.toLowerCase() == "rock") {
                        message.channel.send("WhyYyYyyyyYYYYyyyY I lose")
                        win = true
                    } else if (messageContent == "paper") {
                        message.channel.send("Yay I win")
                        win = false
                    } else {
                        message.channel.send("Why is it a TIE")
                    }
                }

                if (win !== undefined) {
                    if (win) {
                        var earnings = parseInt(args[0])
                        setCoins(message.author.id, userData[message.author.id].cash + earnings, userData[message.author.id].bank)
                    } else {
                        var losings = parseInt(args[0])
                        setCoins(message.author.id, userData[message.author.id].cash - losings, userData[message.author.id].bank)
                    }
                }
            })
        }

        if (message.content.startsWith(prefix + "math")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            if ((userData[message.author.id].cash - 100) < 0) {
                message.channel.send("You can't play this game without at least $100 in cash.")
                return
            }

            var number1 = randomNumber(1, 100)
            var number2 = randomNumber(1, 100)
            message.channel.send("What is " + number1 + " + " + number2 + "?")
            const collector = new discord.MessageCollector(message.channel, m => m.author.id === message.author.id, {
                time: 10000,
                maxMatches: 1
            });
            collector.on('collect', message => {
                try {
                    parseInt(message.content)
                } catch {
                    message.channel.send("Enter a number dumbo.");
                    return
                }
                if (parseInt(message.content) == NaN) {
                    message.channel.send("Enter a number dumbo.");
                    return
                }
                if (parseInt(message) == (number1 + number2)) {
                    message.channel.send("Correct!")
                    var earnings = 100
                    setCoins(message.author.id, userData[message.author.id].cash + earnings, userData[message.author.id].bank)
                } else {
                    message.channel.send("WRONG!")
                    var losings = 100
                    setCoins(message.author.id, userData[message.author.id].cash - losings, userData[message.author.id].bank)
                }
            })
        }

        if (message.content.startsWith(prefix + "rob")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            if (mention == null) {
                mention = getMention(message)
            }

            if (!mention) {
                message.channel.send("You gotta tell me who you wanna rob.")
                return
            }
            if (!userData[mention.id]) {
                message.channel.send("That person doesn't have a bank account yet.")
                return;
            }
            if (message.author.id == mention.id) {
                message.channel.send("Why would you like to rob yourself? You don't earn anything anyway.")
                return
            }
            if (userData[message.author.id].cash < 2000) {
                message.channel.send("You cannot rob someone without at least $2000 in cash.")
                return
            }

            if (userData[message.author.id].inventory["Knife"] == null || userData[message.author.id].inventory["Knife"].amount < 1) {
                message.channel.send(embed("Error", "Try to rob without a knife to defend yourself? **FAIL!**", "ff0000"))
                return
            }

            userData[message.author.id].inventory.Knife.amount -= 1
            saveCoins(userData, message)

            var randRobNumber = randomNumber(1, 1)
            if (randRobNumber == 1) {
                if (userData[mention.id].account.secured) {
                    var earnings = userData[message.author.id].cash * 0.5
                    earnings = Math.round(earnings)
                    setCoins(message.author.id, userData[message.author.id].cash - earnings, userData[message.author.id].bank)
                    setCoins(mention.id, userData[mention.id].cash + earnings, userData[mention.id].bank)
                    message.channel.send("Oh No! Their account was secured, and whoops! You couldn't hack" + mention.username + "! You were fined $" + earnings + ".")
                    userData[mention.id].account.secured = false
                    saveCoins(userData, message)
                    return
                }
                var earnings = userData[mention.id].cash * 0.75
                earnings = Math.round(earnings)
                setCoins(message.author.id, userData[message.author.id].cash + earnings, userData[message.author.id].bank)
                setCoins(mention.id, userData[mention.id].cash - earnings, userData[mention.id].bank)
                message.channel.send("You successfully robbed " + mention.username + " and earned $" + earnings)
            } else {
                var earnings = userData[message.author.id].cash * 0.5
                earnings = Math.round(earnings)
                setCoins(message.author.id, userData[message.author.id].cash - earnings, userData[message.author.id].bank)
                setCoins(mention.id, userData[mention.id].cash + earnings, userData[mention.id].bank)
                message.channel.send("Ouch! You failed to rob " + mention.username + " and were fined $" + earnings + ".")
            }
        }

        if (message.content.startsWith(prefix + "addMoney")) {
            if (message.author.id != 509874745567870987) {
                message.channel.send(embed("Error", "You can't do that! Only bot administrators can.", "ff0000"))
                return
            }
            var args = message.content.split(" ")

            if (mention == null) {
                mention = getMention(message)
            }

            if (mention == null) {
                args.splice(0, 1)
                if (args[0] == null) {
                    message.channel.send("Next time, tell me how much money to add.")
                    return
                }
                args[0] = args[0].trim()
                setCoins(message.author.id, userData[message.author.id].cash + parseInt(args[0]), userData[message.author.id].bank)
            } else {
                args.splice(0, 2)
                if (args[0] == null) {
                    message.channel.send("Next time, tell me how much money to add.")
                    return
                }
                args[0] = args[0].trim()
                setCoins(mention.id, userData[mention.id].cash + parseInt(args[0]), userData[mention.id].bank)
            }
            message.channel.send(embed("Complete", "Added $" + args[0] + " to " + (mention == null ? "your" : mention.username + "'s") + " cash.", "00ff00"))
        }

        if (message.content.startsWith(prefix + "removeMoney")) {
            if (message.author.id != 509874745567870987) {
                message.channel.send(embed("Error", "You can't do that! Only bot administrators can.", "ff0000"))
                return
            }
            var args = message.content.split(" ")

            if (mention == null) {
                mention = getMention(message)
            }

            if (mention == null) {
                args.splice(0, 1)
                if (args[0] == null) {
                    message.channel.send("Next time, tell me how much money to remove.")
                    return
                }
                args[0] = args[0].trim()
                setCoins(message.author.id, userData[message.author.id].cash - parseInt(args[0]), userData[message.author.id].bank)
            } else {
                args.splice(0, 2)
                if (args[0] == null) {
                    message.channel.send("Next time, tell me how much money to remove.")
                    return
                }
                args[0] = args[0].trim()
                setCoins(mention.id, userData[mention.id].cash - parseInt(args[0]), userData[mention.id].bank)
            }
            message.channel.send(embed("Complete", "Removed $" + args[0] + " from " + (mention == null ? "your" : mention.username + "'s") + " cash.", "ff0000"))
        }

        if (message.content.startsWith(prefix + "inv")) {

            var userInv = userData[message.author.id].inventory
            var keys = Object.keys(userInv)

            if (keys.toString() == "[]") {
                message.channel.send(embed("Your inventory", "You have nothing!", "ff0000"))
            } else {
                var itemString = ""
                for (var i = 0; i < keys.length; i++) {
                    itemString += keys[i] + " - " + userInv[keys[i]].amount + "\n \n"
                }
                if (itemString == "") {
                    message.channel.send(embed("Your inventory", "You have nothing!", "ff0000"))
                    return
                }
                message.channel.send(embed("Your inventory", itemString, "00ff00"))
            }
        }

        if (message.content.startsWith(prefix + "shop")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            var keys = Object.keys(shopData)
            var itemString = ""
            for (var i = 0; i < keys.length; i++) {
                itemString += shopData[keys[i]].image + " " + keys[i] + " - $" + shopData[keys[i]].price + "\n \n"
            }
            message.channel.send(embed("Welcome to the shop!", itemString, "00ff00"))
        }

        if (message.content.startsWith(prefix + "buy")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            var args = message.content.split(" ")
            args.splice(0, 1)
            for (var i = 0; i < args.length; i++) {
                args[i] = args[i].trim()
            }
            var keys = Object.keys(shopData)
            if (!keys.includes(args[0])) {
                message.channel.send("Wut you think that's not an item of the shop.")
                return
            }

            if (args[1] == null) {
                args[1] = 1
            }

            args[1] = parseInt(args[1])

            if (shopData[args[0]].price * args[1] > userData[message.author.id].cash) {
                message.channel.send("You obviously can't buy that. Get more **CASH**.")
                return
            }
            setCoins(message.author.id, userData[message.author.id].cash - shopData[args[0]].price * args[1], userData[message.author.id].bank)
            if (userData[message.author.id].inventory[args[0]]) {
                userData[message.author.id].inventory[args[0]].amount += args[1]
            } else {
                userData[message.author.id].inventory[args[0]] = {
                    amount: args[1],
                    uses: shopData[args[0]].uses
                }
            }
            saveCoins(userData, message)
            message.channel.send(embed("Success!", `Successful! You bought ${args[1] == null? "1":args[1]} ${args[0]}${args[1] != null? "s":""}!`, "00ff00")
                .setFooter("Sorry for the grammar"))
        }

        if (message.content.startsWith(prefix + "coin")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            if (inCooldown(message, "coin")) {
                var timeUntil = getUntilTime(message, "coin") / 1000 / 60
                timeUntil = Math.round((timeUntil + Number.EPSILON) * 100) / 100
                message.channel.send(embed("Error", "Try again later. The cooldown is `30s`, and you need to wait **" + timeUntil + "** minutes before you can" + 
                " do that again.", "ff0000"))
                return;
            }

            if (userData[message.author.id].inventory["Coin"] == null || userData[message.author.id].inventory["Coin"] < 1) {
                message.channel.send(embed("Error", "How do you suppose you filp a coin without a coin?", "ff0000"))
                return
            }
            saveCoins(userData, message)

            var args = message.content.split(" ")
            args.splice(0, 1)
            for (var i = 0; i < args.length; i++) {
                args[i] = args[i].toLowerCase().trim()
            }

            if (args[0] === null || args[0] != "heads" && args[0] != "tails") {
                message.channel.send("Enter heads or tails next time.")
                return
            }

            args[1] = parseInt(args[1])
            if (args[1] == NaN) {
                message.channel.send("I'm not sure how you're going to bet that.")
                return
            }

            var bet = args[1]

            if (bet > userData[message.author.id].cash) {
                message.channel.send("Hey, you can't bet more than you have on hand.")
                return
            }

            userData[message.author.id].inventory.Coin.uses -= 1
            if (userData[message.author.id].inventory.Coin.uses < 1) {
                userData[message.author.id].inventory.Coin.amount -= 1
                userData[message.author.id].inventory.Coin.uses = shopData.Coin.uses
            }

            var randNumber = randomNumber(0, userData[message.author.id].cash - 1)
            var win = false
            if (randNumber > bet) {
                win = true
            }

            var otherPossibility = ""
            if (args[0] == "heads") {
                otherPossibility = "tails"
            } else {
                otherPossibility = "heads"
            }

            if (win) {
                setCoins(message.author.id, userData[message.author.id].cash + args[1], userData[message.author.id].bank)
                message.channel.send("Congrats, you won. It flipped " + args[0])
            } else {
                setCoins(message.author.id, userData[message.author.id].cash - args[1], userData[message.author.id].bank)
                message.channel.send("Spectacular! You **LOST**! It flipped " + otherPossibility)
            }
            setCooldown(message, 30, "coin")
        }

        if (message.content.startsWith(prefix + "update")) {
            var msg = new discord.Message()
            message.channel.send(embed("Updating...", "Please wait...", "ffff00")).then((m) => msg = m)
            if (message.author.id == "509874745567870987") {
                setTimeout(function () {
                    userData = require("./userData.json")
                    shopData = require("./shop.json")
                    msg.edit(embed("Update complete!", "All files have been refreshed.", "00ff00"))
                }, randomNumber(1000, 3000))
            } else {
                setTimeout(function () {
                    msg.edit(embed("Update error.", "PermissionError: You do not have permission to execute this command.", "ff0000"))
                }, randomNumber(1000, 3000))
            }
        }

        if (message.content.startsWith(prefix + "race")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            if (mention == null) {
                mention = getMention(message)
            }

            if (mention == null) {
                message.channel.send("Please mention someone next time.")
                return;
            }

            if (mention.id == message.author.id) {
                message.channel.send("What's the point in racing yourself? You'd tie anyway.")
                return
            }

            if (mention.bot) {
                message.channel.send("You do realize that the bot would win, right?")
                return
            }

            if (mention.presence.status == "offline") {
                message.channel.send("I don't think you'd like it if someone tried to race you while you were offline.")
                return
            }

            var args = message.content.toLowerCase().split(" ")
            for (var i = 0; i < args.length; i++) {
                args[i] = args[i].trim()
            }

            message.channel.send("Are you ready, <@" + mention.id + ">?")
            const collector = new discord.MessageCollector(message.channel, m => m.author.id == mention.id, {
                time: 10000,
                maxMatches: 1
            });
            collector.on('end', function () {
                message.channel.send("Collect end.")
            })
            collector.on('collect', collectorMessage => {
                if (collectorMessage.content.toLowerCase() == "yes") {
                    var randomString = sentencer.make("{{a_noun}} {{adjective}} {{a_noun}}")
                    var filename = makeid(10)
                    textToPicture.convert({
                        text: randomString,
                        ext: 'png',
                        size: 16,
                        width: 30,
                        height: 20,
                        color: "black"
                    }).then(function (result) {
                        result.write('./' + filename + '.png')
                        var editMsg = new discord.Message()
                        collectorMessage.channel.send("GET READY").then(m => editMsg = m)
                        setTimeout(function () {
                            editMsg.edit("GET SET")
                            setTimeout(function () {
                                editMsg.edit("GOOOOOOO! \n FIRST TO TYPE THIS WINS: ")
                                message.channel.send("", {
                                    files: ['./' + filename + '.png']
                                }).then(msg => editMsg = msg)
                                const raceCollector = new discord.MessageCollector(collectorMessage.channel,
                                    m => m.author.id == mention.id || m.author.id == message.author.id, {
                                        time: 20000
                                    });
                                raceCollector.on('collect', raceCollectorMsg => {
                                    if (raceCollectorMsg.content == randomString) {
                                        raceCollectorMsg.channel.send("CONGRATULATIONS! <@" + raceCollectorMsg.author.id + "> WON THE RACE!!!")
                                        setCoins(raceCollectorMsg.author.id, userData[raceCollectorMsg.author.id].cash + 250, userData[raceCollectorMsg.author.id].bank)
                                        raceCollectorMsg.author.send("You earn $250 for that race against " + mention.username + ". Congratulations!")
                                        editMsg.delete()
                                        raceCollector.stop("Listen end.")
                                        fs.unlink('./' + filename + '.png', function (error) {
                                            if (error) message.channel.send(embed("Error", error, "ff0000"))
                                        })
                                    } else {
                                        raceCollectorMsg.delete(2000)
                                        message.channel.send("Incorrect. Try again.").then(mesgi => mesgi.delete(2000))
                                    }
                                })
                            }, 1000)
                        }, 1000)
                    })



                } else if (collectorMessage.content.toLowerCase() == "no") {
                    collectorMessage.channel.send("Well, that's too bad.");
                } else {
                    collectorMessage.channel.send("Enter yes or no next time.")
                }
            })
        }

        if (message.content.startsWith(prefix + "phrase")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            message.channel.send("For the people who are here, if anyone wants to play PHRASE GUESSER with <@" + message.author.id + ">, then say 'Join' within the next " +
                "10 seconds.")
            const collector = new discord.MessageCollector(message.channel, m => m.author.id != message.author.id && !m.author.bot, {
                time: 10000
            });
            var players = [message.author.id]
            collector.on('collect', collectorMessage => {

                if (players.includes(collectorMessage.author.id)) {
                    message.channel.send("You already joined.")
                } else if (collectorMessage.content.toLowerCase() == "join") {
                    players.push(collectorMessage.author.id)
                    collectorMessage.reply("Joined!")
                }
            })
            collector.on('end', function () {
                if (players.length == 1) {
                    message.channel.send("Not enough people joined.")
                    return
                }
                message.channel.send("Ok. " + players.length.toString() + " players joined.")
                message.channel.send("So, the point of this game is to guess the sentence first, and the first to guess it earns $250 in their cash! \n" +
                    "You get 1 minute to guess the sentence.")
                setTimeout(function () {
                    var msg = new discord.Message()
                    message.channel.send("GET READY").then(m => msg = m)
                    setTimeout(function () {
                        msg.edit("GET SET")
                        setTimeout(function () {
                            msg.edit("GOOOOOOO")
                            var sentence = sentencer.make("{{a_noun}} {{adjective}} {{noun}}.")
                            console.log(sentence)
                            var revealed = []
                            var sentenceList = sentence.split("")
                            for (var i = 0; i < sentence.length; i++) {
                                revealed.push("\\_")
                            }
                            var usedNumbers = []
                            var number = randomNumber(0, sentenceList.length - 1)
                            usedNumbers.push(number)
                            revealed[number] = sentenceList[number]
                            message.channel.send(revealed.toString().split(",").join(" ")).then(m => msg = m)
                            const guessCollect = new discord.MessageCollector(message.channel, m => players.includes(m.author.id), {
                                time: 60000
                            });
                            guessCollect.on('collect', function (messageCollected) {
                                if (messageCollected.content == sentence) {
                                    messageCollected.channel.send("CONGRATULATIONS! <@" + messageCollected.author.id + "> GUESSED THE PHRASE!")
                                    setCoins(messageCollected.author.id, userData[messageCollected.author.id].cash + 250, userData[messageCollected.author.id].bank)
                                    guessCollect.stop("Game end")
                                } else {
                                    number = randomNumber(0, sentenceList.length - 1)
                                    while (usedNumbers.includes(number) && usedNumbers.length == sentenceList.length - 1) {
                                        number = randomNumber(0, sentenceList.length - 1)
                                    }
                                    usedNumbers.push(number)
                                    revealed[number] = sentenceList[number]
                                    messageCollected.delete()
                                    msg.edit(revealed.toString().split(",").join(" "))
                                }
                            })

                            guessCollect.on('end', function () {
                                message.channel.send("GAME ENDED. IT WAS `" + sentence.toString().split(",").join(" ") + "`")
                            })
                        }, 1000)
                    }, 2000)
                }, 1000)
            })
        }

        if (message.content.startsWith(prefix + "search")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            if (inCooldown(message, "search")) {
                var timeUntil = getUntilTime(message, "search") / 1000 / 60
                timeUntil = Math.round((timeUntil + Number.EPSILON) * 100) / 100
                message.channel.send(embed("Error", "Try again later. The cooldown is `40s`, and you need to wait **" + timeUntil + "** minutes before you can" + 
                " do that again.", "ff0000"))
                return;
            }

            if (userData[message.author.id].inventory.Magnif == null || userData[message.author.id].inventory.Magnif < 1) {
                message.channel.send("You do realize that you can't exactly search without that special maginfying glass from the shop right?")
                return
            }

            if (userData[message.author.id].cash < 500) {
                message.channel.send("You gotta have at least $500 to search.")
                return
            }

            var locations = ['backyard', 'house', 'trash can', 'basement', 'code', 'math homework', 'authy', 'nowhere', 'everywhere']
            var searchableLocations = []
            for (var i = 0; i < 3; i++) {
                var num = randomNumber(0, locations.length - 1)
                searchableLocations.push(locations[num])
                locations.splice(num, 1)
            }
            message.channel.send("Where would you like to search? You can search from these locations: `" + searchableLocations.join("` , `") + '`')
            const collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {
                time: 10000,
                maxMatches: 1
            });
            collector.on('collect', collectorMessage => {
                if (searchableLocations.includes(collectorMessage.content.trim().toLowerCase())) {
                    var location = collectorMessage.content.trim().toLowerCase()
                    var earnings = 0
                    if (location == 'backyard') {
                        earnings = randomNumber(3, 20)
                        message.channel.send("You look in your backyard and find $" + earnings + '.')
                    } else if (location == 'house') {
                        earnings = randomNumber(-500, -100)
                        message.channel.send("You got caught trying to pry open the obviously unlocked front door and were fined $" + earnings.toString() + ".")
                    } else if (location == 'trash can') {
                        earnings = randomNumber(-2, 10)
                        message.channel.send("You search in the trash can, but you may have dropped some coins. The total is $" + earnings.toString() + ".")
                    } else if (location == 'basement') {
                        earnings = randomNumber(20, 50)
                        message.channel.send("You search everywhere in the basement and find $" + earnings.toString() + ".")
                    } else if (location == 'code') {
                        earnings = randomNumber(500, 2000)
                        message.channel.send("You search in the source code of BLUBBADOO and give yourself $" + earnings + ".")
                    } else if (location == 'math homework') {
                        message.channel.send("WHAT IS 1 + 1 HUH")
                        message.channel.send(`I wonder why you searched in your math homework, but anyway, you found nothing.`)
                    } else if (location == 'authy') {
                        message.channel.send("You try to search in your authenticator app, authy, but instead it shoots a lock at your face.")
                        if (userData[message.author.id].inventory['Lock']) {
                            userData[message.author.id].inventory['Lock'].amount += 1
                        } else {
                            userData[message.author.id].inventory['Lock'] = {
                                amount: 1,
                                uses: shopData['Lock'].uses
                            }
                        }
                        saveCoins(userData, message)
                    } else if (location == 'nowhere') {
                        earnings = 99
                        message.channel.send("You just stand there and suddenly, money falls from the sky and you catch $" + earnings + ".")
                    } else if (location == 'everywhere') {
                        earnings = randomNumber(-5, -1)
                        message.channel.send("YOU SCOUR EVERYWHERE, BUT WHOOPS! YOU DROP $" + earnings + "!")
                    } else {
                        message.channel.send(embed("Error", "An error occured while trying to process your request. Please try again.", 'ff0000'))
                        return
                    }
                    setCoins(message.author.id, userData[message.author.id].cash + earnings, userData[message.author.id].bank)
                    setCooldown(message, 40, "search")
                    return
                } else {
                    message.channel.send("You do realize that that's not a choice.")
                }
            })
        }

        if (message.content.startsWith(prefix + "use")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            var args = getArgs(message)
            if (args[0] == null) {
                message.channel.send("Next time tell me what you wanna use.")
                return;
            }

            if (args[0].toLowerCase() == "gem") {

                if (args[1] == null) {
                    args[1] = 1
                }
                args[1] = parseInt(Math.round(args[1]))
                
                if (userData[message.author.id].gems < args[1]) {
                    message.channel.send("Ya don't got enough gems to do that.")
                    return
                }

                message.channel.send("Ok, using " + args[1] + " " + args[0] + (args[1] > 1? "s":"") + " ...")
                userData[message.author.id].gems -= args[1]
                saveCoins(userData, message)
                var earnings = randomNumber(1000, 2000) * args[1]
                setCoins(message.author.id, userData[message.author.id].cash + earnings, userData[message.author.id].bank)
                message.channel.send("Congrats, you earned $" + earnings + " from " + (args[1] > 1? "those":"that") + " " + args[0] + (args[1] > 1? "s":"") + ".")
            } else if (args[0].toLowerCase() == "lock") {

                if (userData[message.author.id].account.secured == true) {
                    message.channel.send("Your account is already secured, there's no point re-securing it.")
                    return
                }

                message.channel.send("Ok, locking your account...")
                userData[message.author.id].inventory.Lock.amount -= 1
                userData[message.author.id].account.secured = true
                saveCoins(userData, message)
                message.channel.send("Ok, account secured!")
            }
        }

        if (message.content.startsWith(prefix + "leaderboard")) {

            if (checkMoneyHandeler(message)) {
                return
            }

            var leaders = []
            var keys = Object.keys(userData)
            var dict = {}

            Object.assign(dict, userData)

            for (var i = 0; i < keys.length; i++) {
                if (dict[keys[i]].account.type.toLowerCase() == "admin") {
                    delete dict[keys[i]]
                }
            }

            // Create items array
            var items = Object.keys(dict).map(function (key) {
                return [dict[key].username, dict[key].cash];
            });

            items.sort(function (first, second) {
                return second[1] - first[1];
            });

            var userLocation = items.findIndex((x) => x[0] == message.author.username) + 1
            
            leaders = items.slice(0, 5);

            var leaderString = ""

            for (var i = 0; i < leaders.length; i++) {
                leaderString += leaders[i][0] + " - $" + leaders[i][1] + "\n"
            }

            message.channel.send(embed("THE WORLD'S LEADERS: FIRST 5", leaderString, "fffffa").setFooter("You are #" + userLocation + " of " + keys.length + " users."))
        }

        if (message.content.startsWith(prefix + "test") && trustedPeople.includes(message.author.id)) {
            message.channel.send("\\" + emoji("name", "discordload"))
        }

    } //Put coin commands above here.


    //#endregion
    //#region - ADMINISTRATOR BOT COMMANDS
    if (message.content.startsWith(prefix + "set")) {
        if (userData[message.author.id].account.type.toLowerCase() == "admin" || message.author.id == "509874745567870987") {

            if (mention == null) {
                mention = getMention(message)
            }

            if (mention == null) {
                message.channel.send("MENTION **SOMEONE**.")
            }

            var args = getArgs(message)
            args.splice(0, 1)
            userData[message.author.id] = {
                cash: userData[message.author.id].cash,
                bank: userData[message.author.id].bank,
                gems: userData[message.author.id].gems + gems,
                inventory: userData[message.author.id].inventory,
                username: userData[message.author.id].username,
                account: {secured: userData[message.author.id].account.secured, type},
                cooldowns: userData[message.author.id].cooldowns
            }
            saveCoins(userData, message)
            message.channel.send(mention + " has been set to " + args[0])
        } else {
            message.channel.send(embed("WARNING!", "You do not have permission to use that command. However, the action was logged.", "ff0000"))
        }
    }
    //#endregion
});

client.on('guildMemberAdd', function (member) {
    if (member.guild.id == "705081585074176152") {
        var role = member.guild.roles.find((x) => x.name == "CITIZEN")
        member.addRole(role)
        member.send("Welcome to " + member.guild.name + "! Please read the rules in the rules channel and have fun!")
    }
})

client.login(token)

//invite: https://discordapp.com/oauth2/authorize?&client_id=596715111511490560&scope=bot&permissions=8
//loadEmoji: 713445327931441162
//loadEmoji2: 713814508669501481