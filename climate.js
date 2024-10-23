let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 25; // Total number of questions
const meterProgress = document.getElementById('meter-progress');
let meterValue = 0; // Start meter value
const quizContainer = document.getElementById('quiz-container');
const loadingContainer = document.getElementById('loading-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const submitBtn = document.getElementById('submit-btn');

const questions = [
    // Sample questions, replace these with your API or data source
    {
        question: "What is climate change?",
        options: [
            "A natural process",
            "Caused by human activities",
            "Irrelevant to our lives",
            "All of the above"
        ],
        answer: 1 // Index of the correct option
    },
    {
        question: "What gas is most responsible for climate change?",
        options: [
            "Oxygen",
            "Carbon Dioxide",
            "Nitrogen",
            "Hydrogen"
        ],
        answer: 1
    },
    // Add more questions here
];

function updateMeter(isCorrect) {
    if (isCorrect) {
        meterValue += 4; // Increase meter value for a correct answer
    } else {
        meterValue -= 4; // Decrease meter value for an incorrect answer
    }

    // Clamp meter value to a range of 0-100
    meterValue = Math.max(0, Math.min(meterValue, 100));
    const progressPercentage = meterValue; // Direct percentage based on value
    meterProgress.style.height = progressPercentage + '%';
}

function loadNextQuestion() {
    // Load next question if available
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionText.textContent = currentQuestion.question;
        optionsContainer.innerHTML = '';

        currentQuestion.options.forEach((option, index) => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'option';
            radio.value = index; // Set the value to the index of the option
            label.appendChild(radio);
            label.appendChild(document.createTextNode(option));
            optionsContainer.appendChild(label);
        });
    } else {
        endQuiz();
    }
}

function handleSubmitQuestion() {
    const selectedOption = document.querySelector('input[name="option"]:checked');

    if (selectedOption) {
        const selectedAnswer = parseInt(selectedOption.value);
        const isCorrect = selectedAnswer === questions[currentQuestionIndex].answer;

        // Update score
        if (isCorrect) {
            score++;
        }

        // Update the meter
        updateMeter(isCorrect);

        // Move to the next question
        currentQuestionIndex++;
        loadNextQuestion();
    } else {
        alert('Please select an answer before submitting!');
    }
}

function endQuiz() {
    quizContainer.style.display = 'none'; // Hide the quiz
    const resultMessage = document.createElement('div');
    resultMessage.innerHTML = `<h3>Quiz Finished!</h3><p>Your score: ${score} out of ${questions.length}</p>`;
    document.body.appendChild(resultMessage);
}

// Start the quiz after loading
function startQuiz() {
    loadingContainer.style.display = 'none'; // Hide loading
    quizContainer.style.display = 'flex'; // Show quiz
    loadNextQuestion();
}

// Event listener for submit button
submitBtn.addEventListener('click', handleSubmitQuestion);

// Simulate loading (you can replace this with your actual loading logic)
setTimeout(startQuiz, 2000); // Simulate a loading time of 2 seconds
