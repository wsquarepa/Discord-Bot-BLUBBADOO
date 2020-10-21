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
        }
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
        }
    },

    "Craft something": {
        description: "Create something using the craft command",
        reward: {
            money: 0,
            gems: 0,
            item: "craftingbench",
            title: "Blacksmith"
        }
    },

    "Get 1 Million blubbadoo bux!": {
        description: "Literally what the achvement is.",
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
        }
    },

    "The explorer": {
        description: "Successfully find a chest while exploring",
        reward: {
            money: 0,
            gems: 0,
            item: "",
            title: "Lootbox Finder"
        }
    },

    "Sentencer": {
        description: "Win a game of phrase!",
        reward: {
            money: 0,
            gems: 3,
            item: "chest",
            title: "Sentencer"
        }
    },

    "MUFF": {
        description: "Get a math problem correct",
        reward: {
            money: 0,
            gems: 1,
            item: "coin",
            title: "The MUFF dood"
        }
    }
}