const users = {
    student1: "password1",
    student2: "password2",
    student3: "password3",
    student4: "password4",
    student5: "password5",
    student6: "password6",
    student7: "password7",
    student8: "password8",
    student9: "password9",
    student10: "password10"
};

const quizQuestions = [
    {
        question: "If a train travels 160 km in 4 hours, what is its speed?",
        options: ["40 km/h", "35 km/h", "45 km/h", "30 km/h"],
        answer: "40 km/h"
    },
    {
        question: "If the price of a product is increased by 20% and then decreased by 20%, what is the overall effect on the price?",
        options: ["Increased by 4%", "Decreased by 4%", "No change", "Increased by 2%"],
        answer: "Decreased by 4%"
    },
    {
        question: "A car covers a distance of 672 km in 14 hours. What is its speed?",
        options: ["48 km/h", "52 km/h", "44 km/h", "56 km/h"],
        answer: "48 km/h"
    },
    {
        question: "If 4x + 3y = 24 and 3x - 5y = 7, what is the value of 7x - 2y?",
        options: ["10", "17", "15", "13"],
        answer: "17"
    },
    {
        question: "A certain sum of money amounts to $ 7350 in 2 years and to $ 8575 in 3 years. What is the sum and the rate of interest?",
        options: ["$ 6200, 5%", "$ 6300, 5%", "$ 6500, 5%", "$ 6200, 6%"],
        answer: "$ 6200, 5%"
    },
    {
        question: "If 8x - 5 = 19, what is the value of 3x?",
        options: ["8", "9", "7", "6"],
        answer: "9"
    },
    {
        question: "The difference between a two-digit number and the number obtained by interchanging the digits is 36. What is the difference between the two digits of the number?",
        options: ["3", "4", "5", "6"],
        answer: "3"
    },
    {
        question: "A boat covers 24 km upstream and 36 km downstream in 6 hours, while it covers 36 km upstream and 24 km downstream in 6.5 hours. What is the speed of the boat in still water and the speed of the current?",
        options: ["8 km/h, 2 km/h", "9 km/h, 2 km/h", "10 km/h, 2 km/h", "8 km/h, 1.5 km/h"],
        answer: "8 km/h, 2 km/h"
    },
    {
        question: "The cost price of 15 articles is the same as the selling price of x articles. If the profit is 20%, what is the value of x?",
        options: ["10", "11", "12", "13"],
        answer: "12"
    },
    {
        question: "A vendor bought toffees at 6 for a dollar. How many for a dollar must he sell to gain 20%?",
        options: ["6", "5", "7", "8"],
        answer: "5"
    }
];

// ... (remaining code)





let currentUser = null;
let currentQuestion = 0;
let score = 0;
let startTime;
let endTime;
let timerInterval;
let results = [];

function startTimer(duration, display) {
    let timer = duration;
    timerInterval = setInterval(function () {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;

        display.textContent = `Time Remaining: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (--timer < 0) {
            clearInterval(timerInterval);
            submitAnswer();
        }
    }, 1000);
}

function login() {
    startTime = new Date();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] === password) {
        currentUser = username;
        document.getElementById('login').style.display = 'none';
        renderQuestion();
        document.getElementById('quiz').style.display = 'block';
        const duration = 60 * 2; 
        const display = document.querySelector('#timer');
        startTimer(duration, display);
    } else {
        alert("Invalid username or password. Please try again.");
    }
}

function renderQuestion() {
    const currentQuizQuestion = quizQuestions[currentQuestion];
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');

    questionElement.innerText = currentQuizQuestion.question;
    optionsElement.innerHTML = '';

    currentQuizQuestion.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.innerHTML = `
            <input type="radio" id="option${index}" name="option" value="${option}">
            <label for="option${index}">${option}</label><br>
        `;
        optionsElement.appendChild(optionElement);
    });
}

function submitAnswer() {
    clearInterval(timerInterval);
    const selectedOption = document.querySelector('input[name="option"]:checked').value;
    const currentQuizQuestion = quizQuestions[currentQuestion];

    if (selectedOption === currentQuizQuestion.answer) {
        score++;
    }
    clearInterval(timerInterval);
    currentQuestion++;

    if (currentQuestion < quizQuestions.length) {
        renderQuestion();
        const duration = 60 * 2; 
        const display = document.querySelector('#timer');
        startTimer(duration, display); 
    } else {
        endTime = new Date();
        const totalTimeInSeconds = (endTime - startTime) / 1000;
        const minutes = Math.floor(totalTimeInSeconds / 60);
        const seconds = totalTimeInSeconds % 60;
        const totalTimeText = `Total Time: ${minutes} minutes and ${seconds} seconds`;
        document.getElementById('quiz').style.display = 'none';
        document.getElementById('result').style.display = 'block';
        document.getElementById('resultText').innerText = `Dear ${currentUser}, your score is ${score}/${quizQuestions.length}`;
        document.getElementById('timeText').innerText = totalTimeText;
    }
    if (currentQuestion >= quizQuestions.length) {
        results.push({ user: currentUser, score: score });
        showResult();
        saveResults();
        displayAllResults();
        
    }
}
function showResult() {
    results.sort((a, b) => b.score - a.score);
    const resultElement = document.getElementById('result');
    resultElement.style.display = 'block';
    resultElement.innerHTML = `<h2>Results</h2>`;
    results.forEach((result, index) => {
        resultElement.innerHTML += `<p>${index + 1}. ${result.user}: ${result.score}/${quizQuestions.length}</p>`;
    });
}
function saveResults() {
    if (localStorage.getItem('quizResults')) {
        const existingResults = JSON.parse(localStorage.getItem('quizResults'));
        localStorage.setItem('quizResults', JSON.stringify(existingResults.concat(results)));
    } else {
        localStorage.setItem('quizResults', JSON.stringify(results));
    }
}

function displayAllResults() {
    const allResults = JSON.parse(localStorage.getItem('quizResults'));
    const resultElement = document.getElementById('result');
    resultElement.style.display = 'block';
    resultElement.innerHTML = `<h2>All Results</h2>`;
    if (allResults) {
        allResults.forEach((result, index) => {
            resultElement.innerHTML += `<p>${index + 1}. ${result.user}: ${result.score}/${quizQuestions.length}</p>`;
        });
    } else {
        resultElement.innerHTML = 'No results found.';
    }
}
