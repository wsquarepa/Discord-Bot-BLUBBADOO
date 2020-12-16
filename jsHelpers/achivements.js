module.exports = {
    "Get more than $100000 in cash":{
        description: "Just be rich!",
        toGet: {
            cash: 100000,
            bank: 0,
            total: 0,
            gems: 0
        },
        
        reward: {
            money: 0,
            gems: 0,
            item: "lock",
            title: "Da Rich Dood"
        },
        secret: false
    },

    "Store $10000 into the bank": {
        description: "Bank: \"Uh thanks?\"",
        toGet: {
            cash: 0,
            bank: 10000,
            total: 0,
            gems: 0
        },

        reward: {
            money: 0,
            gems: 0,
            item: "",
            title: "I want my money safe"
        },
        secret: false
    },

    "Craft something": {
        description: "Create something using the craft command",
        reward: {
            money: 0,
            gems: 0,
            item: "craftingbench",
            title: "Blacksmith"
        },
        secret: false
    },

    "Get 1 Million blubbadoo bux!": {
        description: "Literally what the advancement is.",
        toGet: {
            cash: 0,
            bank: 0,
            total: 1000000,
            gems: 0
        },

        reward: {
            money: 0,
            gems: 0,
            item: "lock",
            title: "Millionaire"
        },
        secret: false
    },

    "The explorer": {
        description: "Successfully find a chest while exploring",
        reward: {
            money: 0,
            gems: 0,
            item: "",
            title: "Lootbox Finder"
        },
        secret: false
    },

    "Sentencer": {
        description: "Win a game of phrase!",
        reward: {
            money: 0,
            gems: 3,
            item: "chest",
            title: "Sentencer"
        },
        secret: false
    },

    "MUFF": {
        description: "Get a math problem correct",
        reward: {
            money: 0,
            gems: 1,
            item: "coin",
            title: "The MUFF dood"
        },
        secret: false
    },

    "Robber": {
        description: "Successfully rob someone!",
        reward: { 
            money: 0,
            gems: 0,
            item: "lock",
            title: "Robber"
        },
        secret: false
    },

    "The guesser": {
        description: "Guess the answer to the impossible math question (==math impossible)",
        reward: {
            money: 0,
            gems: 20,
            item: "",
            title: "The guesser"
        },
        secret: false
    },

    "Speed typist": {
        description: "Win a game of race",
        reward: {
            money: 0,
            gems: 2,
            item: "",
            title: "Lightning Fast Typist"
        },
        secret: false
    },

    "Bot fighter": {
        description: "Fight a bot and lose all your health",
        reward: {
            money: 0,
            gems: 0,
            item: "",
            title: "A bot beat me"
        },
        secret: true
    },

    "Fighter": {
        description: "Fight someone else and win",
        reward: {
            money: 0,
            gems: 1,
            item: "",
            title: "Fighter"
        },
        secret: false
    },

    "Mr. Nice guy": {
        description: "Punch yourself",
        reward: {
            money: 0,
            gems: 0,
            item: "",
            title: "My face hurts"
        },
        secret: true
    },

    "Loaner": {
        description: "Take out a loan from the bank",
        reward: {
            money: 0,
            gems: 0,
            item: "",
            title: ""
        },
        secret: false
    },

    "Shop Looker": {
        description: "Look at a non-existent page of the shop",
        reward: {
            money: 0,
            gems: 0,
            item: "",
            title: "Curiosity Person"
        },
        secret: true
    },

    "Realtor": {
        description: "Own 5 houses",
        reward: {
            money: 0,
            gems: 2,
            item: "",
            title: "The Realtor"
        },
        secret: false
    },

    "Scaredy Squirrel": {
        description: "Lock your account after it's locked",
        reward: {
            money: 0,
            gems: 0,
            item: "",
            title: "Scaredy Squirrel"
        },
        secret: true
    },

    "Serious Dedication": {
        description: "Get a netherite hoe when farming",
        reward: {
            money: 0,
            gems: 0,
            item: "chest",
            title: "Serious Farmer"
        },
        secret: false
    }
}