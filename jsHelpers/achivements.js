module.exports = {
    "Get more than $100000 in cash":{
        description: "Just be rich!",
        toGet: {
            cash: 100000,
            bank: 0,
            total: 0,
            gems: 0,
            command: ""
        },
        
        reward: {
            money: 0,
            gems: 0,
            item: "lock",
            title: "Da Rich Dood"
        }
    },

    "Report something": {
        description: "I wanna tell you sth...",
        toGet: {
            cash: 0,
            bank: 0,
            total: 0,
            gems: 0,
            command: "report"
        },

        reward: {
            money: 0,
            gems: 0,
            item: "gold",
            title: "reporter"
        }
    },

    "Store $10000 into the bank": {
        description: "Bank: \"Uh thanks?\"",
        toGet: {
            cash: 0,
            bank: 10000,
            total: 0,
            gems: 0,
            command: ""
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
            gems: 0,
            command: "craft"
        },

        reward: {
            money: 0,
            gems: 0,
            item: "craftingbench",
            title: "Blacksmith"
        }
    }
}