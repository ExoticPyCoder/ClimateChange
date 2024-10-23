// Fetch data from NASA EONET API
async function fetchClimateEvents() {
    const response = await fetch('https://eonet.gsfc.nasa.gov/api/v2.1/events');
    const data = await response.json();
    return data.events;
}




// Group events by category
function groupEventsByCategory(events) {
    const categoryCounts = {};




    events.forEach(event => {
        const category = event.categories[0].title;
        if (categoryCounts[category]) {
            categoryCounts[category]++;
        } else {
            categoryCounts[category] = 1;
        }
    });




    return categoryCounts;
}




// Generate random numbers for multiple choice, including the correct answer
function generateMultipleChoices(correctCount) {
    const choices = new Set();
    choices.add(correctCount);




    while (choices.size < 4) { // Generate 3 incorrect options
        const randomChoice = Math.floor(Math.random() * (correctCount + 10)) + 1;
        choices.add(randomChoice);
    }




    return Array.from(choices).sort(() => Math.random() - 0.5);
}




// Generate quiz question with multiple choice options
function generateQuizQuestion(category, count) {
    let questionTitle;




    // Assign titles based on the category
    switch (category) {
        case "Severe Storms":
            questionTitle = "How many Severe Storms are occurring in the world?";
            break;
        case "Wildfires":
            questionTitle = "What is the number of Wildfires occurring in the world?";
            break;
        case "Volcanoes":
            questionTitle = "How many Volcanoes are currently erupting?";
            break;
        case "Water-Related Disasters":
            questionTitle = "What is the number of the current Water-Related disasters around the world?";
            break;
        default:
            questionTitle = `What is the number of the current Water-Related disasters around the world <strong>${category}</strong>?`;
            break;
    }




    const choices = generateMultipleChoices(count);
    const question = document.createElement('div');




    // Insert the small heading before the question
    const smallHeading = `<h4>As of Today...</h4>`;




    question.innerHTML = `
        ${smallHeading}
        <h3>${questionTitle}</h3>
        ${choices.map((choice) => `
            <label>
                <input type="radio" name="question-${category}" value="${choice}">
                ${choice}
            </label>
        `).join('')}
        <button onclick="checkAnswer('${category}', ${count})">Submit Answer</button>
        <div id="result-${category}"></div>
    `;
    return question;
}




// Check the user's answer and provide feedback
function checkAnswer(category, correctCount) {
    const selectedOption = document.querySelector(`input[name="question-${category}"]:checked`);
    const resultDiv = document.getElementById(`result-${category}`);




    if (!selectedOption) {
        resultDiv.innerHTML = "<p class='incorrect'>Please select an option.</p>";
        return;
    }




    const userAnswer = parseInt(selectedOption.value, 10);




    if (userAnswer === correctCount) {
        resultDiv.innerHTML = "<p class='correct'>Correct!</p>";
    } else {
        resultDiv.innerHTML = `<p class='incorrect'>Incorrect! The correct answer is: ${correctCount}</p>`;
    }
}




// Load quiz questions
async function loadQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    const loadingContainer = document.getElementById('loading-container');


    // Create a fragment to append all quiz questions
    const fragment = document.createDocumentFragment();


    // Add static questions to the fragment first
    const staticQuestions = generateStaticQuestions();
    fragment.appendChild(staticQuestions);


    // Fetch dynamic questions from the API
    const events = await fetchClimateEvents();
    const groupedEvents = groupEventsByCategory(events);


    // Generate dynamic questions and append to the fragment
    Object.keys(groupedEvents).forEach(category => {
        const quizQuestion = generateQuizQuestion(category, groupedEvents[category]);
        fragment.appendChild(quizQuestion);
    });


    // Append the fragment to the quiz container
    quizContainer.appendChild(fragment);


    // Hide loading screen and show quiz container
    loadingContainer.style.display = 'none';
    quizContainer.style.display = 'block';
}


// Generate static quiz questions with predefined choices and feedback
function generateStaticQuestions() {
    const staticQuestions = [
        {
            stage: "Stage 1: Air Quality",
            task: "Task 1: Most efficient of ways to reduce transportation emissions",
            whyImportant: "Most transportation methods involve non-renewable resources that contribute to global warming",
            options: ["A. Gas-powered transportation", "B. Electric transportation", "C. Human powered transportation", "D. Water transportation"],
            correctAnswer: "C",
            correctFeedback: "You have reduced your effect lowering levels of atmospheric emissions",
            incorrectFeedback: "People will die due to fine particulate matter which is toxic to breathe in"
        },
        {
            stage: "Stage 1: Air Quality",
            task: "Task 2: Identify the largest activity that MOST contributes to air pollution",
            whyImportant: "Understanding the primary sources of air pollution can increase awareness and decrease the effects of such activities",
            options: ["A. Industrial factory emissions", "B. Burning of Fossil Fuels", "C. Transportation emissions", "D. Agricultural practices"],
            correctAnswer: "B",
            correctFeedback: "You have raised the awareness for air pollution",
            incorrectFeedback: "Plants and animals within the radius of the air pollution will perish"
        },
        {
            stage: "Stage 2: Habitable Water Temperature",
            task: "Task 1: Find the typical range of water temperature to support healthy aquatic ecosystems",
            whyImportant: "To analyze the impact of climate change, it's beneficial to monitor the water temperature to view how organisms adapt over time",
            options: ["A. 0°C to 5°C", "B. 10°C to 18°C", "C. 18°C to 22°C", "D. 22°C to 28°C"],
            correctAnswer: "B",
            correctFeedback: "You have reduced your impact lowering levels of climate change",
            incorrectFeedback: "All marine ecosystems will die"
        },
        {
            stage: "Stage 2: Habitable Water Temperature",
            task: "Task 2: Describe how an increase in water temperature will impact salmon populations",
            whyImportant: "It's beneficial to monitor water temperature to see how organisms adapt over time",
            options: ["A. Does not impact salmon populations", "B. Increases salmon reproduction rates", "C. Decreases oxygen levels, impacting fish survival", "D. Decreases salmon population"],
            correctAnswer: "C",
            correctFeedback: "You have saved the salmon population",
            incorrectFeedback: "The salmon population will near the point of extinction"
        },
        {
            stage: "Stage 3: Carbon-Footprint",
            task: "Task 1: Adjust your diet to decrease carbon-footprint",
            whyImportant: "Livestock farming is one of the main contributors to methane emissions",
            options: ["A. Non-veg diet including beef/pork", "B. A plant-based diet", "C. Vegetarian diet", "D. Non-veg diet including only chicken"],
            correctAnswer: "B",
            correctFeedback: "You have reduced your effect lowering your carbon footprint",
            incorrectFeedback: "Your diet significantly impacts greenhouse gasses negatively affecting climate change"
        },
        {
            stage: "Stage 3: Carbon-Footprint",
            task: "Task 2: Identify what contributes most to an individual's carbon-footprint",
            whyImportant: "Carbon footprint indicates the total amount of greenhouse gasses generated by human actions",
            options: ["A. Operating a gasoline-powered car", "B. Using energy-efficient home appliances", "C. Conserving water usage", "D. Flying frequently"],
            correctAnswer: "D",
            correctFeedback: "You know how to identify actions that increase carbon footprints",
            incorrectFeedback: "You missed one of the most important contributors to your carbon-footprint"
        },
        {
            stage: "Stage 4: Surface Temperatures",
            task: "Task 1: What factor contributes to Droughts?",
            whyImportant: "Understanding the primary causes of droughts can help us determine corrective actions",
            options: ["A. Increased Greenhouse-Gas emissions", "B. Deforestation", "C. Poor agriculture", "D. Climate Change"],
            correctAnswer: "A",
            correctFeedback: "You know how to identify actions that increase carbon footprints",
            incorrectFeedback: "You missed a key factor contributing to droughts"
        },
        {
            stage: "Stage 4: Surface Temperatures",
            task: "Task 2: What human activity can MOST reduce the effects of rising surface temperature?",
            whyImportant: "Understanding the actions that reduce surface temperature effects is vital for maintaining living conditions",
            options: ["A. Plastic waste", "B. Use of renewable-energy sources", "C. Solar-Panel installed homes", "D. Increased water use"],
            correctAnswer: "B",
            correctFeedback: "You have identified the correct action to reduce surface temperature",
            incorrectFeedback: "You have failed to identify a major component that alters surface temperature"
        }
    ];


    // Generate each question in the staticQuestions array
    const fragment = document.createDocumentFragment();
    staticQuestions.forEach(questionData => {
        const question = document.createElement('div');
        question.innerHTML = `
            <h3>${questionData.stage} - ${questionData.task}</h3>
            <p><strong>Why is this important?</strong> ${questionData.whyImportant}</p>
            ${questionData.options.map((option, index) => `
                <label>
                    <input type="radio" name="question-${questionData.task}" value="${String.fromCharCode(65 + index)}">
                    ${option}
                </label>
            `).join('')}
            <button onclick="checkStaticAnswer('${questionData.task}', '${questionData.correctAnswer}', '${questionData.correctFeedback}', '${questionData.incorrectFeedback}')">Submit Answer</button>
            <div id="result-${questionData.task}"></div>
        `;
        fragment.appendChild(question);
    });


    return fragment;
}


// Check static answers function
function checkStaticAnswer(task, correctAnswer, correctFeedback, incorrectFeedback) {
    const selectedOption = document.querySelector(`input[name="question-${task}"]:checked`);
    const resultDiv = document.getElementById(`result-${task}`);


    if (!selectedOption) {
        resultDiv.innerHTML = "<p class='incorrect'>Please select an option.</p>";
        return;
    }


    const userAnswer = selectedOption.value;


    if (userAnswer === correctAnswer) {
        resultDiv.innerHTML = `<p class='correct'>${correctFeedback}</p>`;
    } else {
        resultDiv.innerHTML = `<p class='incorrect'>${incorrectFeedback}</p>`;
    }
}


// Start loading quiz on page load
window.onload = loadQuiz;
//window.onload = generateStaticQuestion;













