// SETTINGS
const coefficientsMin = -16;
const coefficientsMax = 16;
const answerMin = -10;
const answerMax = 10;

$(document).ready(() => {
    newQuestion()
})

$("form").submit(e => {
    e.preventDefault()
    // get answers
    let x = $("#x-val").val()
    let y = $("#y-val").val()

    // get questions
    let eq1 = JSON.parse(sessionStorage.getItem("eq1"))
    let eq2 = JSON.parse(sessionStorage.getItem("eq2"))

    // check answers
    let ans = isCorrect(x, y, eq1, eq2)
    
    // update streak
    if (ans) {
        let currentStreak = JSON.parse(localStorage.getItem("currentStreak"))
        let highestStreak = JSON.parse(localStorage.getItem("highestStreak"))
        
        currentStreak++
        highestStreak = Math.max(highestStreak, currentStreak)

        console.log(highestStreak)

        localStorage.setItem("currentStreak", JSON.stringify(currentStreak))
        localStorage.setItem("highestStreak", JSON.stringify(highestStreak))
    } else {
        let currentStreak = 0
        localStorage.setItem("currentStreak", JSON.stringify(currentStreak))
    }

    // show status
    displayResult(ans)
    $("#submit-btn").attr("disabled", true)
})

const newQuestion = () => {
    let info = getInfo()
    displayEquation(info["eq1"], info["eq2"])
    displayStreak(info["currentStreak"], info["highestStreak"])
    $("#x-val").val("")
    $("#y-val").val("")
    $("#results").addClass("d-none")
    $("#submit-btn").attr("disabled", false)
}


$("#next-btn").click(e => {
    e.preventDefault()
    newQuestion()
})

const displayResult = correct => {
    $("#results").removeClass("d-none")
    if (correct) {
        $("#status").text("Correct!")
        $("#status").removeClass("text-danger")
        $("#status").addClass("text-success")
    } else {
        $("#status").text("Incorrect!")
        $("#status").removeClass("text-success")
        $("#status").addClass("text-danger")
    }
}

const displayStreak = (current, highest) => {
    $("#current").text(`Current Streak: ${current}`)
    $("#highest").text(`Highest Streak: ${highest}`)
}

const getInfo = () => {
    let eqs = generateEquation()
    let currentStreak = localStorage["currentStreak"]
    if (currentStreak === undefined) {
        localStorage.setItem("currentStreak", JSON.stringify(0))
        currentStreak = 0
    }
    let highestStreak = localStorage["highestStreak"]
    if (highestStreak === undefined) {
        localStorage.setItem("highestStreak", JSON.stringify(0))
        highestStreak = 0
    }

    return {
        "eq1": eqs[0],
        "eq2": eqs[1],
        "currentStreak": currentStreak,
        "highestStreak": highestStreak
    }
}

const eqToString = (eq) => {
    var first;
    if (eq[0] == 1) {
        first = "x"
    } else if (eq[0] == -1) {
        first = "-x"
    } else {
        first = `${eq[0]}x`
    }

    var second;
    if (eq[1] == 1) {
        second = " + y"
    } else if (eq[1] == -1) {
        second = " - y"
    } else if (eq[1] > 0) {
        second = ` + ${eq[1]}y`
    } else {
        second = ` - ${-eq[1]}y`
    }

    var third = ` = ${eq[2]}`
    return first + second + third
}

const displayEquation = (eq1, eq2) => {
    equation1 = eqToString(eq1)
    equation2 = eqToString(eq2)
    $("#eq1").text(equation1)
    $("#eq2").text(equation2)
    sessionStorage.setItem("eq1", JSON.stringify(eq1))
    sessionStorage.setItem("eq2", JSON.stringify(eq2))
}

const generateEquation = () => {
    // generate two coefficients for each equation
    let eq1 = new Array(3)
    let eq2 = new Array(3)

    do {
        eq1[0] = generateNonZero(coefficientsMin, coefficientsMax)
        eq1[1] = generateNonZero(coefficientsMin, coefficientsMax)
        eq2[0] = generateNonZero(coefficientsMin, coefficientsMax)
        eq2[1] = generateNonZero(coefficientsMin, coefficientsMax)
    } while (eq1[0] * eq2[1] == eq1[1] * eq2[0])

    // generate random solution for x and y
    x = generateNonZero(answerMin, answerMax, isInteger=true)
    y = generateNonZero(answerMin, answerMax, isInteger=true)

    eq1[2] = calculate(x, y, eq1)
    eq2[2] = calculate(x, y, eq2)

    return [eq1, eq2]
}

const generateNonZero = (lowest, highest, isInteger=true) => {
    let x = 0
    while (x == 0) {
        x = generateRandom(lowest, highest, isInteger)
    }
    return x
}

const generateRandom = (lowest, highest, isInteger=true) => {
    let unrounded = Math.random() * (highest + 1 - lowest) + lowest, dp
    // either closest integer or closest .5
    if (isInteger) {
        return Math.round(unrounded)
    } else {
        return Math.round(unrounded * 2) / 2
    }
}

const calculate = (x, y, eq) => eq[0] * x + eq[1] * y

const isCorrectEq = (x, y, eq) => eq[0] * x + eq[1] * y == eq[2]

const isCorrect = (x, y, eq1, eq2) => isCorrectEq(x, y, eq1) && isCorrectEq(x, y, eq2)

