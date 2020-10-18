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
        description: "KLANG KLANG KLANG",
        toGet: {
            cash: 0,
            bank: 0,
            total: 0,
            gems: 0
        },

        reward: {
            money: 0,
            gems: 0,
            item: "craftingbench",
            title: "Blacksmith"
        }
    },

    "Get 1 Million blubbadoo bux!": {
        description: "Imma rich people!",
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
    }
}