var userData = require('../userData.json')
var teamData = require('../teams.json')
const fs = require('fs');
const discord = require("discord.js")

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789'; //Capital I and lowercase l have been removed for readiness purposes.
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
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
  }

module.exports = {
    name: 'team',
	description: 'See your team / see available teams!',
    args: false,
    usage: 'help',
    guildOnly: false,
    aliases: ['party'],
    cooldown: 1,
    levelRequirement: 5,
	execute(message, args, mention) {
        if (userData[message.author.id].team == "") {
            console.log("no team")
            var teamKeys = Object.keys(teamData)
            if (args.length > 0) {
                if (args[0] == "create") {
                    console.log("create called")
                    var userGems = userData[message.author.id].gems
                    if (userGems < 5) {
                        message.channel.send("You require **5** gems to create a team. You have " + userGems)
                        return false;
                    }

                    var stage = 0
                    var creatorTeam = {
                        name:"",
                        description:"",
                        tag:"",
                        bannedUsers:[],
                        message:"",
                        money: 0,
                        admins:[],
                        moderators:[],
                        creator: message.author.id,
                        members:[message.author.id]
                    }

                    var collector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id)
                    message.channel.send("Creating a team costs **5** gems. \n Say cancel if you want to cancel. \n What should the team name be? MAX 15 chars")
                    collector.on("collect", function(msg) {
                        if (msg.content == "cancel") {
                            message.channel.send("Cancelled.")
                            collector.stop()
                            return false;
                        }

                        if (stage == 0) {
                            if (msg.content.length > 15) {
                                message.channel.send("That's too long, try again.")
                            } else {
                                creatorTeam.name = (msg.content.endsWith("s")? msg.content:msg.content + "s")
                                stage++
                                message.channel.send("Now, what should the team description be? MAX 25 chars")
                            }
                        } else if (stage == 1) {
                            if (msg.content.length > 25) {
                                message.channel.send("That's too long, try again.")
                            } else {
                                creatorTeam.description = msg.content
                                stage++
                                message.channel.send("What sould your team tag be? Ex. If the tag is *moo*, then on the leaderboard it'll show *[moo]" + message.author.username +
                                "*. \n Max tag length is 5 characters")
                            }
                        } else if (stage == 2) {
                            if (msg.content.length > 5) {
                                message.channel.send("That's too long, try again.")
                            } else {
                                creatorTeam.tag = msg.content
                                message.channel.send("Pay **5** gems to complete creation?")
                                stage++
                            }
                        } else if (stage == 3) {
                            if (msg.content == "yes" || msg.content == "ok") {
                                userData[message.author.id].gems -= 5

                                var teamId = makeid(25)
                                
                                while (teamKeys.includes(teamId)) {
                                    teamId = makeid(25)
                                }

                                teamData[teamId] = creatorTeam
                                console.log(teamData[teamId])
                                userData[message.author.id].team = teamId

                                message.channel.send("Creation successfull!")
                                collector.stop()
                                fs.writeFile("./teams.json", JSON.stringify(teamData), (err) => err !== null ? console.error(err) : null)
                                fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
                            } else {
                                message.channel.send("Cancelled.")
                                collector.stop()
                                return false;
                            }
                        }
                    })
                } else if (args[0] == "join") {
                    console.log("join called")
                    if (!teamKeys.includes(args[1])) {
                        message.channel.send("That team doesn't exist.")
                        return false;
                    }

                    if (teamData[args[1]].members.length > 25) {
                        message.channel.send("That team is full, try another one.")
                        return false;
                    }

                    if (teamData[args[1]].bannedUsers.includes(message.author.id)) {
                        message.channel.send("You were banned from that team; try another one.")
                        return false;
                    }

                    userData[message.author.id].team = args[1]
                    teamData[args[1]].members.push(message.author.id)

                    message.channel.send("You joined the " + teamData[args[1]].name)
                    fs.writeFile("./teams.json", JSON.stringify(teamData), (err) => err !== null ? console.error(err) : null)
                    fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
                }
            } else {
                console.log("show called")
                if (teamKeys.length != 0) {
                    console.log("embed called")
                    teamKeys = shuffle(teamKeys)
                    var teamShowEmbed = new discord.MessageEmbed()
                        .setTitle("Available teams")
                        .setFooter("==team join <team id>")
                    for (var i = 0; i < (teamKeys.length > 25? 25:teamKeys.length); i++) {
                        teamShowEmbed.addField(teamData[teamKeys[i]].name, "Description: " + teamData[teamKeys[i]].description + "\n" +
                        "Members: " + teamData[teamKeys[i]].members.length + "\n" +
                        "Team tag: " + teamData[teamKeys[i]].tag + "\n" +
                        "Join ID: " + teamKeys[i])
                    }
                    message.channel.send(teamShowEmbed)
                } else {
                    message.channel.send("Be the first to create a team! `==team create`")
                }
            }
        } else {
            var team = teamData[userData[message.author.id].team]
            var mod, admin, creator = false

            if (team.moderators.includes(message.author.id)) mod = true
            else if (team.admins.includes(message.author.id)) admin = true
            else if (team.creator == message.author.id) creator = true

            if (args.length > 0) {
                args[0] = args[0].toLowerCase()
            }

            if (!args.length) {
                var teamInfoEmbed = new discord.MessageEmbed()
                    .setTitle(team.name + ":")
                    .setDescription(
                    "Creator: " + userData[teamData[userData[message.author.id].team].creator].username +
                    "\n Join key: **" + userData[message.author.id].team + "**" + 
                    "\n Total team members: " + teamData[userData[message.author.id].team].members.length +
                    "\n Team money: $" + teamData[userData[message.author.id].team].money)
                for (var i = 0; i < teamData[userData[message.author.id].team].members.length; i++) {
                    var dispmod, dispadmin, dispcreator = false
                    if (team.moderators.includes(team.members[i])) dispmod = true
                    else if (team.admins.includes(team.members[i])) dispadmin = true
                    else if (team.creator == team.members[i]) dispcreator = true
                    teamInfoEmbed.addField(userData[teamData[userData[message.author.id].team].members[i]].username, 
                        (dispcreator? "Creator":dispadmin? "Administrator":dispmod? "Moderator":"Member"))
                }
                message.channel.send(teamInfoEmbed)
            } else if (args[0].startsWith("dep")) {
                if (args[1] == null) {
                    message.channel.send("Next time, tell me what you want to give the team.")
                    return false
                }
                args[1] = args[1].trim()
                if (args[1] == "all") {
                    team.money += userData[message.author.id].cash
                    userData[message.author.id].cash = 0
                } else if (args[1] != null) {
                    if ((userData[message.author.id].cash - parseInt(args[1])) < 0) {
                        message.channel.send("You can't deposit more than you have.")
                        return false;
                    }
                    team.money += parseInt(args[1])
                    userData[message.author.id].cash -= parseInt(args[1])
                }
                message.channel.send("You deposited " + (args[1] != "all" ? `$${args[1]}` : "all the money") + " to the team.")
            } else if (args[0].startsWith("with")) {
                if (args[1] == null) {
                    message.channel.send("Next time, tell me what you want to take out of the team.")
                    return false
                }
                args[1] = args[1].trim()
                if (args[1] == "all") {
                    userData[message.author.id].cash += team.money
                    team.money = 0
                } else if (args[1] != null) {
                    if ((userData[message.author.id].bank - parseInt(args[1])) < 0) {
                        message.channel.send("You can't withdraw more than the team has.")
                        return false;
                    }
                    team.money -= parseInt(args[1])
                    userData[message.author.id].cash += parseInt(args[1])
                }
                fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
                message.channel.send("You withdrew " + (args[1] != "all" ? `$${args[1]}` : "all the money") + " from the team.")
            } else if (args[0] == "ban") {

                if (mention.id == message.author.id) {
                    message.reply("you can't do that!")
                    return false
                }

                if (!creator && !admin && !mod) {
                    message.reply("you can't do that!")
                    return false
                }

                if (team.creator == mention.id || team.admins.includes(mention.id) && !creator || team.moderators.includes(mention.id) && (!creator || !admin)) {
                    message.reply("you can't do that!")
                    return false
                }

                if (mention == null || !team.members.includes(mention.id)) {
                    message.channel.send("That person doesn't exist in your team.")
                }

                team.bannedUsers.push(mention.id)
                team.members.splice(team.members.indexOf(mention.id), 1)
                userData[mention.id].team = ""
                message.channel.send("<@" + mention.id + "> was successfully banned.")
            } else if (args[0] == "unban") {

                if (mention.id == message.author.id) {
                    message.reply("you can't do that!")
                    return false
                }

                if (!creator && !admin && !mod) {
                    message.reply("you can't do that!")
                    return false
                }

                if (mention == null || !team.bannedUsers.includes(mention.id)) {
                    message.channel.send("That person doesn't exist in your team's banned users.")
                }

                team.bannedUsers.splice(team.bannedUsers.indexOf(mention.id), 1)
                message.channel.send("<@" + mention.id + "> was successfully unbanned.")
            } else if (args[0] == "kick") {

                if (mention.id == message.author.id) {
                    message.reply("you can't do that!")
                    return false
                }

                if (!creator && !admin && !mod) {
                    message.reply("you can't do that!")
                    return false
                }

                if (team.creator == mention.id || team.admins.includes(mention.id) && !creator || team.moderators.includes(mention.id) && (!creator || !admin)) {
                    message.reply("you can't do that!")
                    return false
                }

                if (mention == null || !team.members.includes(mention.id)) {
                    message.channel.send("That person doesn't exist in your team.")
                }

                team.members.splice(team.members.indexOf(mention.id), 1)
                userData[mention.id].team = ""
                message.channel.send("<@" + mention.id + "> was successfully kicked.")
            } else if (args[0].startsWith("addmod")) {

                if (mention.id == message.author.id) {
                    message.reply("you can't do that!")
                    return false
                }
                
                if (!creator && !admin) {
                    message.reply("you can't do that!")
                    return false
                }

                if (mention == null || !team.members.includes(mention.id)) {
                    message.channel.send("That person doesn't exist in your team.")
                }

                team.moderators.push(mention.id)
                message.channel.send("<@" + mention.id + "> was successfully premoted to `Moderator`.")
            } else if (args[0].startsWith("removemod")) {

                if (mention.id == message.author.id) {
                    message.reply("you can't do that!")
                    return false
                }

                if (!creator && !admin) {
                    message.reply("you can't do that!")
                    return false
                }

                if (mention.id == null || !team.moderators.includes(mention.id)) {
                    message.channel.send("That person doesn't exist in your team or moderators.")
                }

                team.moderators.splice(team.moderators.indexOf(mention.id), 1)
                message.channel.send("<@" + mention.id + "> was successfully demoted to `Member`.")
            } else if (args[0].startsWith("addadmin")) {

                if (mention.id == message.author.id) {
                    message.reply("you can't do that!")
                    return false
                }

                if (!creator) {
                    message.reply("you can't do that!")
                    return false
                }

                if (mention.id == null || !team.members.includes(mention.id)) {
                    message.channel.send("That person doesn't exist in your team.")
                }

                team.admins.push(mention.id)
                if (team.moderators.includes(mention.id)) team.moderators.splice(team.moderators.indexOf(mention.id), 1)
                message.channel.send("<@" + mention.id + "> was successfully premoted to `Administrator`.")
            } else if (args[0].startsWith("removeadmin")) {

                if (mention.id == message.author.id) {
                    message.reply("you can't do that!")
                    return false
                }

                if (!creator) {
                    message.reply("you can't do that!")
                    return false
                }

                if (mention.id == null || !team.members.includes(mention.id)) {
                    message.channel.send("That person doesn't exist in your team.")
                }

                team.admins.splice(team.admins.indexOf(mention.id), 1)
                message.channel.send("<@" + mention.id + "> was successfully demoted to `Member`.")
            } else if (args[0] == "leave") {
                if (creator) {
                    message.reply("you can only destroy the team: `==team destroy`")
                    return false
                }

                team.members.splice(team.members.indexOf(message.author.id), 1)
                if (mod) team.moderators.splice(team.moderators.indexOf(message.author.id), 1)
                if (admin) team.admins.splice(team.admins.indexOf(message.author.id), 1)
                message.channel.send("You successfully left.")
            } else if (args[0] == "destroy") {
                if (!creator) {
                    message.reply("you can't do that.")
                    return false
                }

                message.channel.send("Are you sure you want to destroy the team?")
                var destroycollector = new discord.MessageCollector(message.channel, m => m.author.id == message.author.id, {time: 10000})

                destroycollector.on("end", function() {
                    message.channel.send("Collect end.")
                })

                destroycollector.on('collect', function(messageDestroy) {
                    destroycollector.stop()
                    if (messageDestroy.content.toLowerCase() == "yes") {

                        var teamId = userData[message.author.id].team 

                        for (var i = 0; i < team.members.length; i++) {
                            userData[team.members[i]].team = ""
                        }

                        if (delete teamData[teamId]) {
                            messageDestroy.channel.send("Team destroyed.")
                        } else {
                            messageDestroy.channel.send("An error occurred while destroying your team.")
                        }
                    } else {
                        messageDestroy.channel.send("Team saved.")
                    }
                })
            } else if (args[0] == "edit") {

                if (!creator) {
                    message.reply("you can't do that.")
                    return false
                }

                if (!args[2]) {
                    message.channel.send("You gotta enter some argument...")
                    return false;
                }

                var setting = args.splice(2).join(" ")
                if (args[1] == "name") {
                    if (setting.length > 15) {
                        message.channel.send("That's too long.")
                        return false;
                    }

                    team.name = setting
                } else if (args[1] == "description") {
                    if (setting.length > 25) {
                        message.channel.send("That's too long.")
                        return false;
                    }

                    team.description = setting
                } else if (args[1] == "tag") {
                    if (setting.length > 5) {
                        message.channel.send("That's too long.")
                        return false;
                    }

                    team.tag = setting
                } else {
                    message.channel.send("That's not editable.")
                }

                message.channel.send("Team " + args[1] + " was set to `" + setting + "`")
            } else {
                var helpembed = new discord.MessageEmbed()
                    .setTitle(args[0] + " is not a valid command.")
                    .setDescription("Here are the commands")
                    .addFields([
                        {
                            name: "==team deposit <money amount>",
                            value: "Deposit money into the team to be first!"
                        },

                        {
                            name: "==team withdraw <money amount>",
                            value: "Feeling greedy? Withdraw money from the team!"
                        },

                        {
                            name: "==team ban <@mention>",
                            value: "Ban a naughty user in your team."
                        },

                        {
                            name: "==team unban <@mention>",
                            value: "Unban someone banned."
                        },

                        {
                            name: "==team kick <@mention>",
                            value: "Kick a naughty user in your team"
                        },
                        
                        {
                            name: "==team addMod <@mention>",
                            value: "Add a moderator to your team."
                        },

                        {
                            name: "==team removeMod <@mention>",
                            value: "Remove a moderator from your team."
                        },

                        {
                            name: "==team addAdmin <@mention>",
                            value: "Add an admin to your team."
                        },

                        {
                            name: "==team removeAdmin <@mention>",
                            value: "Remove an admin from your team."
                        },

                        {
                            name: "==team edit <name | description | tag> <value>",
                            value: "Edit one of your team fields. (Discord invites can be put in descriptions!)"
                        },

                        {
                            name: "==team leave",
                            value: "Leave your team."
                        },

                        {
                            name: "==team destroy",
                            value: "Destroy your team forever; you should `==team with all` first though."
                        }
                    ])
                
                message.channel.send(helpembed)
            }
        }

        fs.writeFile("./teams.json", JSON.stringify(teamData), (err) => err !== null ? console.error(err) : null)
        fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error(err) : null)
    }
}