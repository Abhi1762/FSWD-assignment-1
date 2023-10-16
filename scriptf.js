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
        question: "What does HTML stand for?",
        options: ["Hyperlinks and Text Markup Language", "Home Tool Markup Language", "Hyper Text Markup Language", "Hyperlink Text Markup Language"],
        answer: "Hyper Text Markup Language"
    },
    {
        question: "What does CSS stand for?",
        options: ["Colorful Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Computer Style Sheets"],
        answer: "Cascading Style Sheets"
    },
    {
        question: "Which HTML tag is used to define an internal style sheet?",
        options: ["script", "css", "style", "html"],
        answer: "style"
    },
    {
        question: "Which HTML attribute is used to define inline styles?",
        options: ["class", "font", "style", "styles"],
        answer: "style"
    },
    {
        question: "Which programming language is used for building the structure of web pages?",
        options: ["JavaScript", "CSS", "HTML", "Python"],
        answer: "HTML"
    },
    {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "Java", "Python", "CSS"],
        answer: "CSS"
    },
    {
        question: "Which of the following is not a JavaScript framework?",
        options: ["React", "Angular", "Vue", "Sass"],
        answer: "Sass"
    },
    {
        question: "What is the purpose of Bootstrap in web development?",
        options: ["Programming Language", "Server", "Text Editor", "CSS Framework"],
        answer: "CSS Framework"
    },
    {
        question: "Which of the following is a database management system?",
        options: ["MongoDB", "Express", "React", "Node.js"],
        answer: "MongoDB"
    },
    {
        question: "What does API stand for?",
        options: ["Application Program Interface", "Active Page Integration", "All Purpose Integration", "Active Program Integration"],
        answer: "Application Program Interface"
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
