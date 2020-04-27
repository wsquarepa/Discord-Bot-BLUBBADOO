const discord = require('discord.js');
const fs = require('fs')
const auth = require('./auth.json')
const developer = require('./develop.json')

var client = new discord.Client();

const token = auth.token

client.on("ready", async () => {
    console.log("ready!")
    if (developer.onDevelopMode) {
        client.user.setActivity("the prefix is '=='")
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

function embed(author, description, color) {
    var embed = new discord.RichEmbed()
        .setAuthor(author)
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
    var accepted = false;

    fs.readFile("accepted-servers.txt", function (err, buf) {
        if (err) stop();

        var hashcode = buf.toString()
        var guildIDS = hashcode.split('\n')
        var len = guildIDS.length

        for (i = 0; i <= len; i++) {
            if (guildIDS[i] == message.guild.id) {
                accepted = true
            }
        }

        if (!(accepted) && message.content.startsWith(prefix) && !(message.content.startsWith(prefix + "acceptServer"))) {
            message.channel.send("HOW DID YOU GET ME")
        }

        if (accepted) {

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
                    message.reply("Ok. Banning... WAIT! YOU DON'T HAVE THE ADMIN!")
                    return;
                }
                if (mention == null) {
                    //message.reply("Ok. Banning nobody... Wait. That's an error!")
                    return;
                }
                if (message.member.id == 509874745567870987) {
                    message.reply("You can't ban @wsquarepa#4447.")
                    return;
                }
                if (message.guild.member(mention).hasPermission("BAN_MEMBERS")) return;
                let reason = message.content.slice(prefix.length + mention.toString() + 5)
                message.channel.send(mention.username + ' has been banned.')
                mention.sendMessage("You have been banned because: \n" + reason).then(d_msg => {
                    message.guild.member(mention).ban(reason)
                })
            }

            if (message.content.startsWith(prefix + "kick")) {
                if (!(message.member.hasPermission("ADMINISTRATOR")) && !(message.member.id == 509874745567870987)) {
                    message.reply("Ok. Kicking... WAIT! YOU DON'T HAVE THE ADMIN!")
                    return;
                }
                if (mention == null) {
                    message.reply("Ok. Kicking nobody... Wait. That's an error!")
                    return;
                }
                if (mention.member.id == 509874745567870987) {
                    message.reply("You can't kick @wsquarepa#4447.")
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

            if (message.content.startsWith(prefix + "embeddie")) {
                var testEmbed = embed("@wsquarepa#4447", "Test embed", "ffffff", "This is a test").addField("Hello there!", "A test")
                message.channel.send(testEmbed)
            }

            if (message.content.startsWith(prefix + "warn") && !(message.content.startsWith(prefix + "warnings"))) {
                if (message.member.hasPermission("ADMINISTRATOR") || message.member.id == 509874745567870987) {
                    var args = message.content.split(' ');
                    var users = {}
                    var cmd = args[0]

                    fs.readFile("warnings.txt", function (err, buf) {
                        var hashcode = buf.toString()
                        users = hashcode.split('\n')
                    });

                    console.log(users);

                    var reason = ''

                    if (args[2] != null) {
                        for (i = 2; i < args.length; i++) {
                            reason += ' ' + args[i]
                        }
                    }

                    var warnedUser = args[0];

                    //message.channel.sendMessage(mention.username.toString() + ' has been warned. \n ```Reason: ' + reason + ' ``` \n To see how many warnings you have, use the ==warnings command.')
                    var warningEmbed = embed(mention.username.toString() + " has been warned.", "Reason: " + reason, "ffff00").setFooter("To see how many warnings you have, use the ==warnings command.")
                    message.channel.send(warningEmbed)
                    fs.appendFile("warnings.txt", (mention.id + '\n'), (err) => {
                        if (err) console.log(err);
                        console.log("Successfully Written to File.");
                    });

                    fs.appendFile("warningReasons.txt", (reason + '\n'), (err) => {
                        if (err) console.log(err);
                        console.log("Successfully Written to File.");
                    });
                } else {
                    message.reply("you can't do that.")
                }

            }

            if (message.content.startsWith("How are you") || message.content.startsWith("How r u")) {
                sleep(500)
                message.reply("Great!")
            }

            if (message.content.startsWith(prefix + "warnings")) {
                fs.readFile("warnings.txt", function (err1, buf1) {
                    fs.readFile("warningReasons.txt", function (err2, buf2) {
                        var hashcode1 = buf1.toString()
                        var hashcode2 = buf2.toString()
                        var userWarnings = hashcode1.split('\n')
                        var warningReasons = hashcode2.split('\n')

                        console.log(hashcode1.toString())
                        console.log('userWarningsAndNumber = ' + userWarnings)

                        var len = userWarnings.length
                        var occurences = 0
                        var reasonString = ''

                        for (i = 0; i <= len; i++) {
                            if (userWarnings[i] == message.author.id) {
                                occurences++
                                reasonString += warningReasons[i] + ", "
                            }
                        }
                        console.log(occurences.toString())
                        if (occurences > 0) {
                            if (occurences == 1) {
                                var warningEmbed = embed("You have 1 warning.", "The reason is " + reasonString, "ff0000")
                                message.channel.send(warningEmbed)
                            } else {
                                message.channel.sendMessage('You have ' + occurences.toString() + ' warnings. The reasons for them are: ' + reasonString)
                            }
                        } else {
                            var warningEmbed = embed("You have no warnings.", "You haven't got any warnings.", "00ff00")
                            message.channel.send(warningEmbed)
                        }
                    });
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

        }

        if (message.content.startsWith(prefix + "acceptServer")) {
            if (message.author.id == 509874745567870987 && !(accepted)) {
                fs.appendFile("accepted-servers.txt", (message.guild.id + "\n"), (err) => {
                    if (err) stop()
                    sleep(2500)
                    message.channel.send("Added to accepted servers.")
                });
            } else {
                message.reply("You either cannot run this command or it is already accepted.")
            }
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

        if ((message.content.includes("is") || message.content.includes("Is") || message.content.includes("do") || message.content.includes("Do")) && message.content.endsWith("?")) {
            message.channel.sendMessage("Yos!")
        }

        if (message.content.toLowerCase().includes("bob is cool") && message.member.id != 596715111511490560) {
            message.delete(0)
            message.channel.sendMessage("BOB IS NOT COOL!!!")
            message.channel.send(`==warn <@${message.member.id}> Saying that ${message.content} but he is not cool.`).then(d_msg => d_msg.delete())
        }
    });

    //message.channel.send(message.guild.id.toString())
});
client.login(token)

//invite: https://discordapp.com/oauth2/authorize?&client_id=596715111511490560&scope=bot&permissions=8
//jasdhfjkahfjkshajkfhldjhahhdhdje adhhe sjdjej sjahh ejskel;jej e ejsjke;skje e jks  the shtint skal.0 the ting is that the thnnng is the same