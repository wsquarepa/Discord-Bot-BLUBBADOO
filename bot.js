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

function statusSet(status) {
    client.user.setStatus(status)
}

function randomNumber(end) {
    //Starts with 0 and ends with your input.
    return Math.floor((Math.random() * end) + 1);
}

client.on("message", (message) => {
    if (message.author.bot && message.author.id != 596715111511490560) return;
    //if (message.author.bot && message.author.id != 596715111511490560) return;

    var mention = message.mentions.users.first()

    if (message.content.startsWith(prefix + 'help')) {
        message.channel.send(embed("THINGS THAT I CAN DO", `
            Ok sooo... Info: <...> means required and [...] means optional field. \n
            ==blubbadoo, I shall reply! \n
            ==ban <user> <reason>, to ban people \n
            ==kick <user> <reason>, to kick people \n
            ==warn <user> <reason>, to warn people \n
            ==warnings [user], to see your warnings \n
            ==clearWarnings <user> to clear the user's warnings \n
            secret texting commands that you'll have to find out and that's pretty much it!
        `, "ffffff").setFooter("Version 1.9.8 (BETA)"))
    }

    if (message.content.startsWith(prefix + 'blubbadoo')) {
        message.channel.send("Blubbadoo!!!")
    }

    if (message.content.startsWith(prefix + "develop")) {
        message.delete(500)
        message.reply("Enter the password.").then(deleteMessage => deleteMessage.delete(3000))
        passwordMode = true;
        userUsingPassword = message.author.id
    }

    if (message.content.startsWith("javascript") && passwordMode && message.author.id == userUsingPassword) {
        message.delete(500)
        if (developer.onDevelopMode) {
            developer.onDevelopMode = false
            message.reply("Test mode deactivated").then(d_msg => d_msg.delete(3000))
        } else {
            developer.onDevelopMode = true
            message.reply("Test mode activiated").then(d_msg => d_msg.delete(3000))
        }
        console.log(developer.onDevelopMode)
        
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
        if (message.member.id == 509874745567870987) {
            message.channel.send("You can't ban @wsquarepa#4447. Use another thing.")
            return;
        }
        if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) {
            message.channel.send("Umm... You can't ban someone that has a BAN_MEMBERS permission...")
            return
        };
        let reason = message.content.slice(prefix.length + mention.toString() + 5)
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
        if (mention.id == 509874745567870987) {
            message.channel.send("You can't kick @wsquarepa#4447.")
            return;
        }
        if (message.guild.member(mention).hasPermission("KICK_MEMBERS")) {
            message.channel.send("YOU NO KICK " + mention.toString() + "!!!")
            return;
        }
        let reason = message.content.slice(prefix.length + mention.toString() + 5)
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
        if (message.member.hasPermission("ADMINISTRATOR") || message.member.id == 509874745567870987) {
            if (mention == null) {
                message.channel.send("You can't warn nobody.")
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
                                disguiseId = args[i + 1]
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
            message.guild.name.toString() + ".\n The reason why you were warned is: " + reason + ". \n You have been warned by <@" + 
            (modifiers.includes("disguise")? disguiseId:message.author.id.replace(" ", "")) + "> and please follow the rules to not be warned!"))
            
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
            statusSet(args[0])
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
});
client.login(token)

//invite: https://discordapp.com/oauth2/authorize?&client_id=596715111511490560&scope=bot&permissions=8