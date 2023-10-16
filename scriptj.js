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
        question: "What is the correct way to declare a variable to store an integer value in Java?",
        options: ["int 1x=10;", "int x=10;", "float x=10.0f;", "string x='10';"],
        answer: "int x=10;"
    },
    {
        question: "Which method must be implemented by all threads?",
        options: ["wait()", "start()", "run()", "wait(timeout)"],
        answer: "run()"
    },
    {
        question: "Which of these data types is used to create a variable that should store text?",
        options: ["String", "Text", "myString", "Txt"],
        answer: "String"
    },
    {
        question: "What is the output of this code: `System.out.println(10/3);`?",
        options: ["3", "3.33", "3.0", "3.3"],
        answer: "3"
    },
    {
        question: "Which keyword is used to inherit a class in Java?",
        options: ["super", "this", "extends", "inherits"],
        answer: "extends"
    },
    {
        question: "What is the output of the following code snippet?\n`String str1 = \"hello\";\nString str2 = \"world\";\nSystem.out.println(str1 + str2);`",
        options: ["helloworld", "hello world", "hello+world", "Compilation Error"],
        answer: "helloworld"
    },
    {
        question: "Which package is directly available to a class even without importing it?",
        options: ["java.util", "java.lang", "java.awt", "java.io"],
        answer: "java.lang"
    },
    {
        question: "Which of the following is not a keyword in Java?",
        options: ["static", "boolean", "void", "NULL"],
        answer: "NULL"
    },
    {
        question: "What is the return type of the `hashCode()` method in the `Object` class?",
        options: ["void", "int", "Object", "String"],
        answer: "int"
    },
    {
        question: "Which of the following is a marker interface in Java?",
        options: ["Runnable", "Result", "Remote", "Readable"],
        answer: "Remote"
    }
];




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
