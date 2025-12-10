// Decision Tree Logic

let currentQuestion = 1;
let answers = {
    q1: null,
    q2: null,
    q3: null
};

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
});

function initializeForm() {
    // Add event listeners to all radio buttons
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', handleAnswer);
    });
}

function handleAnswer(event) {
    const questionName = event.target.name;
    const value = event.target.value;
    
    // Store the answer
    answers[questionName] = value;
    
    // Wait a moment for visual feedback, then proceed
    setTimeout(() => {
        if (questionName === 'q1') {
            if (value === 'yes') {
                showQuestion(2);
            } else {
                showQuestion(3);
            }
        } else if (questionName === 'q2') {
            if (value === 'yes') {
                showResult('applied-research');
            } else {
                showResult('evidence-review');
            }
        } else if (questionName === 'q3') {
            if (value === 'yes') {
                showResult('applied-research');
            } else {
                showResult('consultation');
            }
        }
    }, 300);
}

function showQuestion(questionNumber) {
    // Hide all questions
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Show the target question
    const targetQuestion = document.getElementById('q' + questionNumber);
    if (targetQuestion) {
        targetQuestion.classList.add('active');
        currentQuestion = questionNumber;
        
        // Scroll to top of form
        targetQuestion.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showResult(resultType) {
    // Hide all questions
    document.querySelectorAll('.question-card').forEach(card => {
        card.classList.remove('active');
    });
    
    // Show result card
    const resultCard = document.getElementById('result');
    resultCard.classList.add('active');
    
    // Set recommendation content
    const recommendation = document.getElementById('recommendation');
    const resultLink = document.getElementById('resultLink');
    
    let title, description, link;
    
    switch(resultType) {
        case 'consultation':
            title = 'Consultation';
            description = 'A single discussion providing a behavioural science perspective on your challenge.';
            link = 'consultation.html';
            break;
        case 'evidence-review':
            title = 'Evidence Review';
            description = 'A structured evaluation of existing materials, services, or interventions against current evidence.';
            link = 'evidence-review.html';
            break;
        case 'applied-research':
            title = 'Applied Research';
            description = 'A full applied behavioural science project targeting a specific behaviour.';
            link = 'applied-research.html';
            break;
    }
    
    recommendation.innerHTML = `
        <h3>${title}</h3>
        <p>${description}</p>
    `;
    
    resultLink.href = link;
    
    // Scroll to result
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goBack(steps) {
    // Clear answers for questions after current
    if (currentQuestion === 2) {
        answers.q2 = null;
        document.querySelectorAll('input[name="q2"]').forEach(input => {
            input.checked = false;
        });
    } else if (currentQuestion === 3) {
        answers.q3 = null;
        document.querySelectorAll('input[name="q3"]').forEach(input => {
            input.checked = false;
        });
    }
    
    // Go back to previous question
    showQuestion(currentQuestion - steps);
}

function resetForm() {
    // Clear all answers
    answers = {
        q1: null,
        q2: null,
        q3: null
    };
    
    // Uncheck all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    // Show first question
    showQuestion(1);
}
