const functions = require('./jsHelpers/functions')
var mathQuestions = {}

for (var i = 0; i < 1000; i++) {
    const num1 = functions.randomNumber(0, 99)
    const num2 = functions.randomNumber(0, 99)
    const answer = functions.randomNumber(0, 198)

    mathQuestions[num1 + " + " + num2] = answer
}

functions.save("./mathquestions.json", mathQuestions)
console.log("Compile complete")