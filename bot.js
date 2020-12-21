const Discord = require('discord.js')
const fs = require('fs');
const path = require('path')
const {
	token,
	bannedServers,
	dblToken,
	botAdmins
} = require('./config.json');
const cooldowns = new Discord.Collection();
const cooldownwarned = new Discord.Collection()
const client = new Discord.Client();
var userData = require('./userData.json')
const modeOfUser = require('../configs/blubbadoo.json')
const teamData = require('./teams.json')
var botData = require('./botData.json')
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
var shopData = require('./shop.json')
const schedule = require('node-schedule')
const execSync = require('child_process').execSync
var guildData = require("./guildData.json")
const errWebhook = new Discord.WebhookClient("720427166650728589", "4PVEXDDaz0MS-2uN7rucTK6UZl6xh0FgHqLoFXPm2_HJ6LNYDBBTDcTna2N8OYm1ZTmZ");
const functions = require("./jsHelpers/functions")
const DBL = require("dblapi.js")
const dbl = new DBL('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5NjcxNTExMTUxMTQ5MDU2MCIsImJvdCI6dHJ1ZSwiaWF0IjoxNTk1NzgxOTAxfQ.bbb9DPH39Q2roE1jKpRxZNMnzyFJQ_ivLJTxoB10cv4', client);
var shardId = 0
const quests = require("./quests.json")

function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
			return false;
	}
	return true;
}

function randomNumber(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
	var commandName = command.name
	if (!botData[commandName]) {
		botData[commandName] = {
			uses: 0,
			lastUsed: 0
		}
	}
	if (botData != "" || botData != null || !isEmpty(botData)) {
		fs.writeFile("./botData.json", JSON.stringify(botData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
	}
}

process.on("uncaughtException", function (error) {
	fs.writeFileSync("./index-out.txt", error)
	console.error("[SHARD/ERROR] " + error)
	const embed = new Discord.MessageEmbed()
	embed.setTitle("Uncaught exception " + functions.makeid(10) + ":")
	embed.setDescription(
		`
		Check \`index-out.txt\` for crash notes
		Process has been stopped
		<@596715111511490560> will now be offline.
		`
	)
	embed.setColor(functions.globalEmbedColor)
	errWebhook.send("<@509874745567870987> New error log:", {
		username: 'Error Reports - Crashed!',
		embeds: [embed],
	});
	execSync("pm2 stop index", {
		encoding: 'utf-8'
	})
})

setInterval(function () {
	const shopKeys = Object.keys(shopData)
	shopKeys.splice(0, 1)
	const now = Date.now()
	for (var i = 0; i < shopKeys.length; i++) {
		if (shopData[shopKeys[i]].stock.remaining <= 0 && shopData[shopKeys[i]].stock.nextRestock == -1) {
			shopData[shopKeys[i]].stock.nextRestock = now + shopData[shopKeys[i]].stock.restockMinutes * 60 * 1000
		}

		if (shopData[shopKeys[i]].stock.nextRestock < now && shopData[shopKeys[i]].stock.nextRestock != -1) {
			shopData[shopKeys[i]].stock.remaining = shopData[shopKeys[i]].stock.max
			shopData[shopKeys[i]].stock.nextRestock = -1
		}
	}
	fs.writeFile("./shop.json", JSON.stringify(shopData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
}, 1000)

client.once("ready", function () {
	client.shard.fetchClientValues('guilds.cache.size')
		.then(results => {
			const guilds = results.reduce((acc, guildCount) => acc + guildCount, 0)
			client.user.setActivity('==help | ' + guilds + ' servers | ' + Object.keys(userData).length + ' users | Shard ' + shardId, { type: 'LISTENING' });
			dbl.postStats(guilds)
		})
		.catch(error => console.error("[SHARD/ERROR] " + error));

	schedule.scheduleJob('0 0 * * 0', () => {
		var leaders = []
		var keys = Object.keys(userData)
		var dict = {}


		Object.assign(dict, userData)

		for (var i = 0; i < keys.length; i++) {
			if (dict[keys[i]].account.type.toLowerCase() == "admin" || dict[keys[i]].account.type.toLowerCase() == "banned" || !isEmpty(dict[keys[i]].loan)) {
				delete dict[keys[i]]
			}
		}

		// Create items array
		var items = Object.keys(dict).map(function (key) {
			return [key, dict[key].cash];
		});

		items.sort(function (first, second) {
			return second[1] - first[1];
		});

		leaders = items.slice(0, 3);

		userData[leaders[0][0]].gems += 5
		userData[leaders[1][0]].gems += 3
		userData[leaders[2][0]].gems += 1
		fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
	})

	schedule.scheduleJob("0 0 * * *", () => {
		const keys = Object.keys(userData)

		for (var i = 0; i < keys.length; i++) {
			if (!userData[keys[i]].houses) {
				userData[keys[i]].houses = []
			}

			if (userData[keys[i]].houses.length > 0) {
				const userHouses = userData[keys[i]].houses
				for (var j = 0; j < userHouses.length; j++) {
					userData[keys[i]].houses[j].durability -= 10000
					userData[keys[i]].bank += 10000
				}
			}
		}

		fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
	})

	schedule.scheduleJob("0 0 * * *", () => {
		client.shard.fetchClientValues('guilds.cache.size')
			.then(results => {
				const guilds = results.reduce((acc, guildCount) => acc + guildCount, 0)
				client.user.setActivity('==help | ' + guilds + ' servers | ' + Object.keys(userData).length + ' users | Shard ' + shardId , { type: 'LISTENING' });
				dbl.postStats(guilds)
			})
			.catch(err => console.error("[SHARD/ERROR] " + err));
	})

	setInterval(() => {
		const keys = Object.keys(userData)
		for (var i = 0; i < keys.length; i++) {
			const loan = userData[keys[i]].loan
			if (!loan) {
				userData[keys[i]].loan = {}
			}

			if (!isEmpty(loan)) {
				if (loan.expires < Date.now()) {
					userData[keys[i]].cash -= loan.amount
					userData[keys[i]].loan = {}
				}
			}

		}
		fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
	}, 60000)

	setInterval(() => {
		const keys = Object.keys(userData)
		for (var i = 0; i < keys.length; i++) {
			if (userData[keys[i]].quest) {
				if (userData[keys[i]].quest.cooldown) {
					if (userData[keys[i]].quest.cooldown < Date.now()) {
						userData[keys[i]].quest = {}
					}
				}
			}
		}
	}, 1000)

	setInterval(() => {
		const keys = Object.keys(userData)
		for (var i = 0; i < keys.length; i++) {
			if (userData[keys[i]].hp < userData[keys[i]].maxHP) {
				userData[keys[i]].hp += 1
			}
		}
		fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
	}, 5000)
})

client.on('message', message => {
			if (message.channel.type != 'dm') {
				if (bannedServers.includes(message.guild.id)) return;
			}
			if ((message.author.id != "509874745567870987" && modeOfUser.testMode)) return

			botData.messagesRecieved++
			if (botData != "" || botData != null || !isEmpty(botData)) {
				fs.writeFile("./botData.json", JSON.stringify(botData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
			}

			if (message.channel.type != "dm") {
				if (!guildData[message.guild.id]) {
					guildData[message.guild.id] = {
						prefix: "==",
						warnings: {},
						settings: {
							levelUpMessages: false,
							moneyExceedMessage: false,
							raceCompletionMessage: false,
							achivementMessage: false
						}
					}
				}
			}

			if (!message.author.bot) {
				if (!userData[message.author.id]) {
					userData[message.author.id] = {
						cash: 0,
						bank: 0,
						bankLimit: 0,
						gems: 0,
						xp: 0,
						xpUntil: 10,
						level: 0,
						inventory: {},
						username: message.author.username,
						account: {
							secured: false,
							type: "user",
							daily: {
								streak: -1,
								previousAmt: 0,
								expires: new Date().getTime() + 1000 * 60 * 60 * (24 + 24) //2 Days
							},
							title: "none",
							settings: {
								robNotif: false,
								raceWinDM: false,
								peaceful: false
							}
						},
						pet: {},
						houses: [],
						team: "",
						achivements: [],
						codesUsed: [],
						nextVoteTime: 0,
						loan: {},
						intellegencePoints: 1,
						strength: 0,
						defence: 0,
						hp: 10,
						maxHP: 100,
						quest: {}
					}
				}

				if (!userData[message.author.id].houses) {
					userData[message.author.id].houses = []
				}

				if (!userData[message.author.id].loan) {
					userData[message.author.id].loan = {}
				}

				if (userData[message.author.id].account.title == "") {
					userData[message.author.id].account.title = "none"
				}

				if (!userData[message.author.id].intellegencePoints) {
					userData[message.author.id].intellegencePoints = 1
				}

				if (userData[message.author.id].team != "") {
					userData[message.author.id].team = ""
				}

				if (!userData[message.author.id].strength) {
					userData[message.author.id].strength = 0
				}

				if (!userData[message.author.id].defence) {
					userData[message.author.id].defence = 0
				}

				if (!userData[message.author.id].maxHP) {
					userData[message.author.id].maxHP = 100
				}

				if (!userData[message.author.id].hp) {
					userData[message.author.id].hp = userData[message.author.id].maxHP
				}

				if (!userData[message.author.id].account.settings) {
					userData[message.author.id].account.settings = {
						robNotif: false,
						raceWinDM: false,
						peaceful: false
					}
				}

				if (!userData[message.author.id].bankLimit) {
					userData[message.author.id].bankLimit = 0
				}

				if (!userData[message.author.id].quest) {
					userData[message.author.id].quest = {}
				}

				userData[message.author.id].xp += 1
				userData[message.author.id].bankLimit = userData[message.author.id].level * 100000

				if (userData[message.author.id].xp >= userData[message.author.id].xpUntil) {
					userData[message.author.id].xp = userData[message.author.id].xp - userData[message.author.id].xpUntil
					userData[message.author.id].level += 1
					userData[message.author.id].gems += 1
					userData[message.author.id].xpUntil += (userData[message.author.id].level * 5)
					if (message.channel.type != "dm") {
						if (guildData[message.guild.id].settings.levelUpMessages) {
							message.channel.send("Congratulations, " + message.author.username + ", you leveled up to level " + userData[message.author.id].level + "!")
								.then(m => m.delete({
									timeout: 5000
								}).catch()).catch()
						}
					}
				}

				//#region - chat money

				userData[message.author.id].cash += userData[message.author.id].level

				//#endregion

				var netWorth = userData[message.author.id].cash + userData[message.author.id].bank
				if (!userData[message.author.id].nextGemCashGoal) {
					userData[message.author.id].nextGemCashGoal = (netWorth - (netWorth % 5000)) + 5000
				}

				if (netWorth > userData[message.author.id].nextGemCashGoal) {
					userData[message.author.id].gems += 1
					if (message.channel.type != "dm") {
						if (guildData[message.guild.id].settings.moneyExceedMessage) {
							message.channel.send("Congratulations, " + message.author.username + ", you earned one gem because you just exceeded  " +
									userData[message.author.id].nextGemCashGoal + "!")
								.then(m => m.delete({
									timeout: 5000
								}).catch()).catch()
						}
					}
					userData[message.author.id].nextGemCashGoal = netWorth * 2
				}

				if (!isEmpty(userData[message.author.id].pet)) {
					if (!userData[message.author.id].pet.food < 1) {
						userData[message.author.id].pet.food -= 1
						userData[message.author.id].pet.coins += randomNumber(5, 25)
					}
				}

				if (teamData[userData[message.author.id].team]) {
					userData[message.author.id].username = "[" + teamData[userData[message.author.id].team].tag + "] " + message.author.username
				} else {
					userData[message.author.id].username = message.author.username
				}

				var achivements = require('./jsHelpers/achivements')
				for (var i in achivements) {
					if (achivements[i].toGet) {
						if (!userData[message.author.id].achivements.includes(i)) {
							var requirements = {
								cash: achivements[i].toGet.cash,
								bank: achivements[i].toGet.bank,
								total: achivements[i].toGet.total,
								gems: achivements[i].toGet.gems
							}

							var currently = {
								cash: userData[message.author.id].cash,
								bank: userData[message.author.id].bank,
								total: userData[message.author.id].cash + userData[message.author.id].bank,
								gems: userData[message.author.id].gems
							}

							if (
								currently.cash >= requirements.cash &&
								currently.bank >= requirements.bank &&
								currently.total >= requirements.total &&
								currently.gems >= requirements.gems
							) {
								userData[message.author.id].achivements.push(i)

								var stuffEarn = achivements[i].reward
								userData[message.author.id].bank += stuffEarn.money
								userData[message.author.id].gems += stuffEarn.gems
								if (stuffEarn.item != "") {
									if (userData[message.author.id].inventory[stuffEarn.item]) {
										userData[message.author.id].inventory[stuffEarn.item].amount += 1
									} else {
										userData[message.author.id].inventory[stuffEarn.item] = {
											amount: 1,
											uses: 1
										}
									}
								}

								if (stuffEarn.title != "") {
									userData[message.author.id].account.title = stuffEarn.title
								}

								if (message.channel.type != "dm") {
									if (guildData[message.guild.id].settings.achivementMessage) {
										message.channel.send("**ACHIEVEMENT EARNED!** \n `" + i + "`!")
											.then(m => m.delete({
												timeout: 5000
											}).catch()).catch()
									}
								}
							}
						}
					}
				}

				if (userData[message.author.id].houses.length > 0) {
					const houses = userData[message.author.id].houses
					for (var a = 0; a < houses.length; a++) {
						if (!userData[message.author.id].houses[a].durability < 1) {
							userData[message.author.id].houses[a].durability -= randomNumber(1, 100)
							userData[message.author.id].houses[a].xp += 1
							
							const amountToAdd = randomNumber(0, 100) * userData[message.author.id].houses[a].level
							if ((userData[message.author.id].bankLimit - userData[message.author.id].bank) < amountToAdd) {
								userData[message.author.id].bank = userData[message.author.id].bankLimit
							} else {
								userData[message.author.id].bank += (amountToAdd * userData[message.author.id].houses[a].level)
							}

							if (userData[message.author.id].houses[a].xp > userData[message.author.id].houses[a].xpUntil) {
								userData[message.author.id].houses[a].level++
								userData[message.author.id].houses[a].xp = userData[message.author.id].houses[a].xpUntil - userData[message.author.id].houses[a].xp
								userData[message.author.id].houses[a].xpUntil = userData[message.author.id].houses[a].xpUntil + userData[message.author.id].houses[a].level * 100
							}
						}
					}
				}

				fs.writeFile("./userData.json", JSON.stringify(userData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
			}

			var prefix = "=="

			if (message.channel.type != "dm") {
				prefix = guildData[message.guild.id].prefix
			}

			if (!message.content.startsWith(prefix) || message.author.bot) return;

			if (userData[message.author.id].account.type.toLowerCase() == "banned") {
				var embed = new Discord.MessageEmbed()
				embed.setAuthor("ERR_BANNED")
				embed.setTitle(`Error: You were banned from using me. Ask for more info from a bot admin!`)
				embed.setColor("ff0000")
				message.channel.send(embed)
				return
			}
			const args = message.content.slice(prefix.length).split(/ +/);
			var mention = message.mentions.users.first()

			const commandName = args.shift().toLowerCase();

			if (!mention) {
				try {
					mention = message.guild.members.cache.find(x => x.user.username == args.join(" ")).user
				} catch {
					try {
						mention = message.guild.members.cache.find(x => x.nickname == args.join(" ")).user
					} catch {
						mention = null
					}
				}
			}

			var command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

			if (!command) return;

			const now = Date.now();
			//#region - Here is the command tracking. 
			botData[command.name].uses++
			botData[command.name].lastUsed = now
			if (botData != "" || botData != null || !isEmpty(botData)) {
				fs.writeFile("./botData.json", JSON.stringify(botData), (err) => err !== null ? console.error("[SHARD/ERROR] " + err) : null)
			}
			//#endregion

			var keyArgs = []
			if (userData[message.author.id].account.type.toLowerCase() == "admin") {
				const canStartWith = ["-", ".", ">", "+", "$", "!"]
				for (var argI = 0; argI < args.length; argI++) {
					if (canStartWith.includes(args[argI].charAt(0))) {
						keyArgs.push(args[argI].substring(1))
						args.splice(argI, 1)
					}
				}
			}

			if (command.args && !args.length) {
				var embed = new Discord.MessageEmbed()
				embed.setAuthor("ERR_MISSING_ARGS")
				embed.setTitle(`Error: You didn't provide any arguments!`)
				embed.setColor("ff0000")
				message.channel.send(embed).catch()
				return;
			}

			if (command.guildOnly && message.channel.type !== 'text') {
				var embed = new Discord.MessageEmbed()
				embed.setAuthor("ERR_EXECUTE_NOT_TEXT")
				embed.setTitle(`Error: You can't execute that command in non-text channels!`)
				embed.setColor("ff0000")
				return message.channel.send(embed).catch()
			}

			if (command.adminOnly && !botAdmins.includes(message.author.id) && userData[message.author.id].account.type.toLowerCase() != "admin") {
				return;
			}

			const levelRequirement = (command.levelRequirement || 0)
			if ((userData[message.author.id].level < levelRequirement) && !keyArgs.includes("b")) {
				var embed = new Discord.MessageEmbed()
				embed.setAuthor("ERR_MISSING_LEVEL")
				embed.setTitle(`Error: ` + "That command requires level " + levelRequirement + ". You are currently at level " + userData[message.author.id].level + "!")
				embed.setColor("ff0000")
				message.channel.send(embed).catch()
				return
			}

			if (userData[message.author.id].hp < 10 && command.category == "economy" && !keyArgs.includes("b")) {
				const embed = new Discord.MessageEmbed()
				embed.setAuthor("ERR_HEALTH")
				embed.setTitle("You don't have enough health to preform any tasks!")
				embed.setDescription("You have " + userData[message.author.id].hp + "HP! You need at least **10 HP** to prefom tasks!")
				embed.setColor("ff0000")
				message.channel.send(embed)
				return
			}

			if (!functions.isEmpty(userData[message.author.id].quest) && command.name != "quest" && command.category == "econnomy" && !keyArgs.includes("b")) {
				if (!userData[message.author.id].quest.cooldown) {
					const embed = new Discord.MessageEmbed()
					embed.setAuthor("ERR_QUEST")
					embed.setTitle("You are currently in a quest!")
					embed.setDescription("You cannot preform tasks in a quest, except for the ones that are allowed. Use `quest` to see your current quest!")
					embed.setColor("ff0000")
					message.channel.send(embed)
					return
				}
			}

			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Discord.Collection());
			}

			if (!cooldownwarned.has(command.name)) {
				cooldownwarned.set(command.name, new Discord.Collection());
			}

			if (command.category == "economy") {
				userData[message.author.id].hp -= randomNumber(1, 10)
			}

			const timestamps = cooldowns.get(command.name);
			const cooldownwarnedtimestamps = cooldownwarned.get(command.name)
			const cooldownAmount = (command.cooldown || 1) * 1000;

			if (timestamps.has(message.author.id) && !keyArgs.includes("b")) {
				const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					const timeLeftDate = new Date(timeLeft * 1000)

					if (command.category == "economy") {
						userData[message.author.id].hp -= randomNumber(1, 10)
					}

					if (cooldownwarnedtimestamps.has(message.author.id)) {
						return
					}

					cooldownwarnedtimestamps.set(message.author.id, now);
					var timeouttime = (command.cooldown <= 60? 15000:60000)
					if (command.cooldown <= 10) {
						timeouttime = cooldownAmount
					}
					
					setTimeout(() => cooldownwarnedtimestamps.delete(message.author.id), timeouttime);

					const embed = new Discord.MessageEmbed()
					embed.setAuthor("ERR_TIMEOUT")
					embed.setTitle("Error: ")
					embed.setDescription(`You have to wait ${timeLeftDate.getHours()} hour(s), ${timeLeftDate.getMinutes()} minute(s) and ${timeLeftDate.getSeconds()} more second(s) ` +
						`before reusing the \`${prefix}${command.name}\` command.` + (command.category == "economy" ? "\n As well, since this is an economy command, your health will" +
							" still deplete." : ""))
					embed.setColor("ff0000")
					return message.channel.send(embed).catch()
				}
			}

			try {
				var success = command.execute(message, args, mention, keyArgs)
				if (success == null) success = true
				if (success) {
					timestamps.set(message.author.id, now);
					setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
				}
			} catch (error) {
				console.error("[SHARD/ERROR] Execution failed for " + message.author.tag + " (" + message.author.id + "):")
				console.error(error);
				if (message.channel.type != "dm") {
					message.channel.createInvite({
							unique: true,
							maxAge: 86400
						}).then(invite => {
								const embed = new Discord.MessageEmbed()
								embed.setAuthor(message.author.tag + " (" + message.author.id + ")")
								embed.setTitle("Execution Failure " + functions.makeid(10) + ":")
								embed.setDescription(
									`
									In server: ${message.guild.name + " (" + message.guild.id + ")"} 
									-> Invite: [Click here](${invite.url} 'Click to join')
									Channel: \`${message.channel.name + "` (" + message.channel.id + ")"}
									Message: [Click here](${message.url} 'Click to jump') (${message.id})
									Executed command: \`${message.content}\`
									`
								)
								embed.setFooter("Check server console for more information.")
								embed.setColor(functions.globalEmbedColor)
								errWebhook.send({
									username: 'Error Reports',
									embeds: [embed],
								});
							}).catch()
				}
				
		const embedErrorToUser = new Discord.MessageEmbed()
			.setTitle("Uh oh!")
			.setDescription("There was an issue executing that command!")
			.setColor(functions.globalEmbedColor)
			.setFooter("My developers have received a notification.")
			.setTimestamp(Date.now())
		message.channel.send(embedErrorToUser).catch()
	}
});

client.on("guildCreate", (guild) => {
	guild.members.cache.get(client.user.id).setNickname("[==] Blubbadoo").catch()
})

process.on("message", message => {
    if (!message.type) return false;

    if (message.type == "shardId") {
		shardId = message.data.shardId
    };
});

client.login(token);