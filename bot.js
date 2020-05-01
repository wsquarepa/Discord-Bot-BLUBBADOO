const discord = require('discord.js');
const fs = require('fs')
const auth = require('./auth.json')
const developer = require('./develop.json')


var client = new discord.Client();

const token = auth.token

client.on("ready", async () => {
    console.log("ready!")
    if (developer.onDevelopMode) {
        client.user.setActivity("a game that is telling you that the prefix is '=='")
    }
    client.user.setStatus("online")
});

const prefix = '==';
var passwordMode = false;
var userUsingPassword = ''
var possibleStatuses = ['online', 'idle', 'dnd']
var trustedPeople = [509874745567870987, 536659745420083208]

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function embed(title, description, color) {
    var embed = new discord.RichEmbed()
        .setAuthor(title)
        .setDescription(description)
        .setColor(color)
    return embed
}

function getMapSize(x) {
    var len = 0;
    for (var count in x) {
            len++;
    }

    return len;
}

function randomNumber(end) {
    //Starts with 0 and ends with your input.
    return Math.floor((Math.random() * end) + 1);
}

client.on("message", (message) => {
    try {
        if ((message.author.bot && message.author.id != 596715111511490560) && message.content.startsWith(prefix)) {
            message.channel.send(embed("UMM NO", "Yeah... YOU CAN'T DO THAT MR.BOT!", "ff0000"))
            return;
        };

        var mention = message.mentions.users.first()
        var mentions = message.mentions.users

        if (message.content.startsWith(prefix + 'help')) {
            message.channel.send(embed("THINGS THAT I CAN DO", `
                Ok sooo... Info: <...> means required and [...] means optional field. \n
                ==blubbadoo, I shall reply! \n
                ==ban <user> <reason>, to ban people \n
                ==kick <user> <reason>, to kick people \n
                ==warn <user> <reason>, to warn people \n
                ==warnings [user], to see your warnings \n
                ==clearWarnings <user> to clear the user's warnings (Does not work) \n
                secret texting commands that you'll have to find out and that's pretty much it!
            `, "ffffff").setFooter("Version 1.9.8 (BETA)"))
        }

        if (message.content.startsWith(prefix + 'blubbadoo')) {
            message.channel.send("Blubbadoo!!!")
        }

        if (message.content.startsWith(prefix + "ban")) {
            if (!(message.member.hasPermission("ADMINISTRATOR")) && !(message.member.id == 509874745567870987)) {
                message.channel.send(embed("Error", message.author + ", you can't do that!", "ff0000"))
                return;
            }
            if (mention == null) {
                message.channel.send("Ok. Banning nobody... Wait. That's an error!")
                return;
            }
            if (mention.id == "509874745567870987") {
                message.channel.send("You can't ban @wsquarepa#4447. Use another thing.")
                return;
            }
            if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) {
                message.channel.send(mention.toString() + " can't be punished, silly.")
                return
            };
            let reason = message.content.slice(prefix.length + 5 + mention.toString().length + 1, message.content.length)
            message.channel.send(mention.username + ' has been banned.')
            mention.sendMessage("You have been banned because: \n" + reason).then(() => {
                message.guild.member(mention).ban(reason)
            })
        }

        if (message.content.startsWith(prefix + "kick")) {
            if (!(message.member.hasPermission("ADMINISTRATOR")) && !(message.member.id == 509874745567870987)) {
                message.channel.send(embed("Error", message.author + ", you can't do that!", "ff0000"))
                return;
            }
            if (mention == null) {
                message.channel.send("Ok. Kicking nobody... Wait. That's an error!")
                return;
            }
            if (mention.id == "509874745567870987") {
                message.channel.send("You can't kick @wsquarepa#4447.")
                return;
            }
            if (message.guild.member(mention).hasPermission("KICK_MEMBERS")) {
                message.channel.send(mention.toString() + " can't be punished, silly.")
                return;
            }
            let reason = message.content.slice(prefix.length + 5 + mention.toString().length + 1, message.content.length)
            message.channel.send(mention.username + ' has been kicked.')
            mention.sendMessage("You have been kicked because: \n" + reason).then(d_msg => {
                message.guild.member(mention).kick(reason)
            })
        }

        if (message.content.startsWith(prefix + "whois") && message.member.id == 509874745567870987) {
            mention.send(embed("Hi.", "Hello! <@509874745567870987> wants to know who you are! Please DM him your name or " + 
            "just ignore this message.", "0000ff"))
            message.channel.send("Sent!")
        }

        if (message.content.startsWith(prefix + "embeddie")) {
            var testEmbed = embed("@wsquarepa#4447", "Test embed", "ffffff", "This is a test").addField("Hello there!", "A test")
            message.channel.send(testEmbed)
        }

        if (message.content.startsWith(prefix + "warn") && !(message.content.startsWith(prefix + "warnings"))) {
            console.log(message.member.hasPermission("ADMINISTRATOR"))
            if (message.member.hasPermission("ADMINISTRATOR") || message.member.id == 509874745567870987) {
                if (mention == null) {
                    message.channel.send("You can't warn nobody.")
                    return;
                }

                if (message.guild.member(mention).hasPermission("ADMINISTRATOR") && message.member.id != 509874745567870987 && message.member.id != 596715111511490560) {
                    message.channel.send(mention.toString() + " can't be punished, silly.")
                    return;
                }

                var args = message.content.split(' ');

                for (var i = 0; i < args.length; i++) {
                    args[i] = args[i].replace(" ", "")
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
                
                if (message.content.includes("-")) {
                    modifier = true
                }

                if (!modifier) {
                    if (args[2] != null) {
                        for (i = 2; i < args.length; i++) {
                            reason += ' ' + args[i]
                        }
                    }
                } else {
                    if (args[2] != null) {
                        for (i = 2; i < args.length; i++) {
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
                
                fs.appendFile("warnings.txt", (mention.id + ',' + reason + ',' + (modifiers.includes("disguise")? disguiseId:message.author.id.replace(" ", "")) + '\n'), (err) => {
                    if (err) console.log(err);
                    console.log("Successfully Written to File.");
                });

                mention.send(embed("You have been warned in " + message.guild.name.toString(), "Hello " + mention.username.toString() + ", you have been warned in " + 
                message.guild.name.toString() + ".\n The reason why you were warned is: " + reason + ". \n You have been warned by <@!" + 
                (modifiers.includes("disguise")? disguiseId:message.author.id.replace(" ", "")) + "> and please follow the " +
                "rules to not be warned!", "ff0000"))
                
                if (modifiers.includes("silent")) {
                    message.delete()
                    return;
                }

                var warningEmbed = embed(mention.username.toString() + " has been warned.", "Reason: " + reason, "ffff00").setFooter("To see how many warnings you have," + 
                "use the ==warnings command.")
                message.channel.send(warningEmbed)
                
            } else {
                message.channel.send(embed("Error", message.author + ", you can't do that!", "ff0000"))
            }

        }

        if (message.content.toLowerCase().startsWith("how are you") || message.content.toLowerCase().startsWith("how r u")) {
            sleep(500)
            message.reply("Great!")
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
                        var warningEmbed = embed(mention.username.toString() + " has no warnings.", "You haven't got any warnings.", "00ff00")
                        message.channel.send(warningEmbed)
                    }
                }
            });
        }

        if (message.content.startsWith(prefix + "setStatus")) {
            if (message.author.id != 509874745567870987) {
                message.reply(" you can't do that.")
                return;
            }
            var args = message.content.split(' ');
            var cmd = args[0]
            var possible = false;

            console.log(args[1])

            // try {
            //     statusSet(args[0])
            //     message.reply("Status set should be complete. If not, please wait.")
            // } catch {
            //     message.reply("Not a valid status. The possible statuses are " + possibleStatuses.join(", "))
            // }

            for (i = 0; i < possibleStatuses.length; i++) {
                if (args[1] == possibleStatuses[i]) {
                    possible = true;
                }
            }

            if (possible) {
                client.user.setStatus(args[0])
                message.reply("Status set should be complete. If not, please wait.")
            } else {
                message.reply("Not a valid status. The possible statuses are " + possibleStatuses.join(", "))
            }
        }

        if (message.content.startsWith(prefix + "instantDev")) {
            message.channel.send("==develop")
            sleep(5000)
            message.channel.send("javascript")
        }
        if (message.content.startsWith("pls meme")) {
            var choose = randomNumber(5)
            if (choose == 1) {
                sleep(500)
                message.channel.send("", {
                    files: ["./images/Stealy.jpg"]
                })
            }
        }

        if (message.content.startsWith("Muppy") || message.content.startsWith("muppy")) {
            message.channel.sendMessage("MUPPY!!!")
        }

        if (message.content.includes("tis"))  {
            message.channel.sendMessage("Yos!")
        }

        if (((message.content.includes("is") || message.content.includes("Is") || message.content.includes("do") || message.content.includes("Do"))|| 
        message.content.toLowerCase().includes("am")) && message.content.endsWith("?")) {
            message.channel.sendMessage("Yos!")
        }

        if (message.content.toLowerCase().includes("bob is cool") && message.member.id != 596715111511490560) {
            message.delete(0)
            message.channel.sendMessage("BOB IS NOT COOL!!!")
            message.channel.send(`==warn <@${message.member.id}> Saying that ${message.content} but he is not cool.`).then(d_msg => d_msg.delete())
        }

        if (message.content.toLowerCase() == "bob") {
            message.channel.send("... is not cool!")
        }

        if (message.content.startsWith(prefix + "testImposing")) {
            message.channel.send(embed("WARNING!", "ALERT! <@" + message.author.id + "> IS IMPOSING AS SOMEONE ELSE!", "ff0000"))
        }

        if (message.content.startsWith("===warn")) {
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
                (modifiers.includes("impose")? disguiseId:message.author.id.replace(" ", "")) + "> and please follow the " +
                "rules to not be warned!", "ff0000").setFooter("Since you're a supporter, a trusted person or an administrator, I'm going to tell you a secret. \n" + 
                "1: This message is a trolling command, and did not actually warn you. \n" + 
                "2: This message was " + (disguiseId == ""? "not imposed":("imposed and the real sender is " + message.author.username))))
                return;
            }
            
            mention.send(embed("You have been warned in " + message.guild.name.toString(), "Hello " + mention.username.toString() + ", you have been warned in " + 
            message.guild.name.toString() + ".\n The reason why you were warned is: " + reason + ". \n You have been warned by <@" +
            (modifiers.includes("impose")? disguiseId:message.author.id.replace(" ", "")) + "> and please follow the " +
            "rules to not be warned!", "ff0000"))
        }

        if (message.content.startsWith(prefix + "perms")) {
            var args = message.content.split(" ")
            var permsList = ["ADMINISTRATOR", "BAN_MEMBERS", "KICK_MEMBERS", "CHANGE_NICKNAME", "MANAGE_NICKNAMES", "MANAGE_CHANNELS", "MANAGE_EMOJIS", "MANAGE_GUILD"
            , "MANAGE_MESSAGES", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "VIEW_AUDIT_LOG", "CREATE_INSTANT_INVITE", "SEND_MESSAGES", "SEND_TTS_MESSAGES", "EMBED_LINKS",
            "ATTACH_FILES", "READ_MESSAGES", "READ_MESSAGE_HISTORY", "MENTION_EVERYONE", "USE_EXTERNAL_EMOJIS", "ADD_REACTIONS", "CONNECT", "SPEAK", "STREAM", "MUTE_MEMBERS",
            "DEAFEN_MEMBERS", "MOVE_MEMBERS", "USE_VAD", "PRIORITY_SPEAKER"]

            if (mention == null) {
                var myperms = []
                if (message.guild.member(message.author).hasPermission("ADMINISTRATOR")) {
                    myperms.push("ADMINISTRATOR")
                } else {
                    for (var i = 0; i < permsList.length; i++) {
                        if (message.guild.member(message.author).hasPermission(permsList[i])){
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
                        if (message.guild.member(mention).hasPermission(permsList[i])){
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
            message.delete()
            var args = message.content.split(' ');
            var numberToDelete = args[1]
            try {
                let messagecount = parseInt(numberToDelete);
                if (messagecount > 100) {
                    message.channel.send("You can not purge more than 100 messages yet.")
                    return;
                }
                message.channel.fetchMessages({ limit: messagecount }).then(function(messages) {  
                    message.channel.bulkDelete(messages).then(function()  {
                        message.channel.send(messages.size + " messages deleted!").then(d_msg => d_msg.delete(2500))
                    })
                    
                });
                
            } catch {
                message.channel.send("Next time, type an integer.")
            }
        }

    } catch(e) {
        message.channel.send(embed("An error occured", e.toString(), "ff0000"))
    }
});
client.login(token)

//invite: https://discordapp.com/oauth2/authorize?&client_id=596715111511490560&scope=bot&permissions=8