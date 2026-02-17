// DOM Elements
const landingPage = document.getElementById("landing-page");
const quizPage = document.getElementById("quiz-page");
const resultsPage = document.getElementById("results-page");
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");

// Quiz state variables
let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedCategory = null;
let selectedDifficulty = null;
let userAnswers = [];

// Category data (Open Trivia Database categories)
const categories = [
  { id: 9, name: "General Knowledge", icon: "fas fa-globe-americas" },
  { id: 10, name: "Books", icon: "fas fa-book" },
  { id: 11, name: "Film", icon: "fas fa-film" },
  { id: 12, name: "Music", icon: "fas fa-music" },
  { id: 17, name: "Science & Nature", icon: "fas fa-leaf" },
  { id: 18, name: "Computers", icon: "fas fa-laptop-code" },
  { id: 21, name: "Sports", icon: "fas fa-futbol" },
  { id: 22, name: "Geography", icon: "fas fa-globe-asia" },
  { id: 23, name: "History", icon: "fas fa-landmark" },
  { id: 27, name: "Animals", icon: "fas fa-paw" },
];

// Initialize the app
function initApp() {
  renderCategories();
  setupEventListeners();
}

// Render category cards
function renderCategories() {
  const container = document.getElementById("categories-container");
  container.innerHTML = "";

  categories.forEach((category) => {
    const categoryCard = document.createElement("div");
    categoryCard.className = "category-card";
    categoryCard.dataset.id = category.id;
    categoryCard.innerHTML = `
            <i class="${category.icon}"></i>
            <span>${category.name}</span>
        `;

    categoryCard.addEventListener("click", () =>
      selectCategory(category.id, categoryCard),
    );
    container.appendChild(categoryCard);
  });
}

// Set up event listeners
function setupEventListeners() {
  // Difficulty selection
  document.querySelectorAll(".difficulty-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".difficulty-btn")
        .forEach((b) => b.classList.remove("selected"));
      this.classList.add("selected");
      selectedDifficulty = this.dataset.difficulty;
      checkStartButton();
    });
  });

  // Start quiz button
  document
    .getElementById("start-quiz-btn")
    .addEventListener("click", startQuiz);

  // Next question button
  document
    .getElementById("next-question-btn")
    .addEventListener("click", nextQuestion);

  // Restart quiz button
  document
    .getElementById("restart-quiz-btn")
    .addEventListener("click", restartQuiz);

  // Retry button for error state
  document.getElementById("retry-btn").addEventListener("click", () => {
    if (selectedCategory && selectedDifficulty) {
      startQuiz();
    } else {
      hideAllPages();
      landingPage.style.display = "block";
    }
  });
}

// Select a category
function selectCategory(categoryId, element) {
  // Remove selection from all categories
  document.querySelectorAll(".category-card").forEach((card) => {
    card.classList.remove("selected");
  });

  // Add selection to clicked category
  element.classList.add("selected");
  selectedCategory = categoryId;
  checkStartButton();
}

// Check if start button should be enabled
function checkStartButton() {
  const startBtn = document.getElementById("start-quiz-btn");
  startBtn.disabled = !(selectedCategory && selectedDifficulty);
}

// Start the quiz
async function startQuiz() {
  // Show loading state
  hideAllPages();
  loadingState.style.display = "block";

  try {
    // Fetch questions from Open Trivia Database API
    const apiUrl = `https://opentdb.com/api.php?amount=10&category=${selectedCategory}&difficulty=${selectedDifficulty}&type=multiple`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (data.response_code === 0) {
      quizData = data.results;
      currentQuestionIndex = 0;
      score = 0;
      userAnswers = [];

      // Initialize quiz
      hideAllPages();
      quizPage.style.display = "block";
      loadQuestion();
    } else {
      throw new Error("Could not fetch quiz questions. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    hideAllPages();
    errorState.style.display = "block";
    document.getElementById("error-text").textContent =
      error.message ||
      "There was a problem fetching the quiz questions. Please try again.";
  }
}

// Load the current question
function loadQuestion() {
  if (currentQuestionIndex >= quizData.length) {
    showResults();
    return;
  }

  const questionData = quizData[currentQuestionIndex];
  const questionNumber = currentQuestionIndex + 1;

  // Update question counter
  document.getElementById("question-counter").textContent =
    `Question ${questionNumber} of ${quizData.length}`;

  // Update score display
  document.getElementById("current-score").textContent = score;

  // Update progress bar
  const progressPercent = (currentQuestionIndex / quizData.length) * 100;
  document.getElementById("quiz-progress").style.width = `${progressPercent}%`;

  // Decode HTML entities in question text
  document.getElementById("question-text").textContent = decodeHtmlEntities(
    questionData.question,
  );

  // Prepare answers (correct + incorrect)
  const answers = [
    ...questionData.incorrect_answers.map((answer) => ({
      text: answer,
      isCorrect: false,
    })),
    {
      text: questionData.correct_answer,
      isCorrect: true,
    },
  ];

  // Shuffle answers
  shuffleArray(answers);

  // Display answers
  const answersContainer = document.getElementById("answers-container");
  answersContainer.innerHTML = "";

  const answerLetters = ["A", "B", "C", "D"];

  answers.forEach((answer, index) => {
    const answerBtn = document.createElement("button");
    answerBtn.className = "answer-btn";
    answerBtn.innerHTML = `
            <div class="answer-letter">${answerLetters[index]}</div>
            <div class="answer-text">${decodeHtmlEntities(answer.text)}</div>
        `;

    answerBtn.addEventListener("click", () =>
      selectAnswer(answerBtn, answer.isCorrect, answer.text),
    );
    answersContainer.appendChild(answerBtn);
  });

  // Disable next button until an answer is selected
  document.getElementById("next-question-btn").disabled = true;
}

// Select an answer
function selectAnswer(answerBtn, isCorrect, answerText) {
  // Disable all answer buttons
  document.querySelectorAll(".answer-btn").forEach((btn) => {
    btn.style.pointerEvents = "none";
  });

  // Mark selected answer
  answerBtn.classList.add("selected");

  // Check if answer is correct
  if (isCorrect) {
    answerBtn.classList.add("correct");
    score++;
    document.getElementById("current-score").textContent = score;
  } else {
    answerBtn.classList.add("incorrect");

    // Also highlight the correct answer
    document.querySelectorAll(".answer-btn").forEach((btn) => {
      if (
        btn.querySelector(".answer-text").textContent ===
        decodeHtmlEntities(quizData[currentQuestionIndex].correct_answer)
      ) {
        btn.classList.add("correct");
      }
    });
  }

  // Store user's answer
  userAnswers.push({
    question: quizData[currentQuestionIndex].question,
    userAnswer: answerText,
    correctAnswer: quizData[currentQuestionIndex].correct_answer,
    isCorrect: isCorrect,
  });

  // Enable next button
  document.getElementById("next-question-btn").disabled = false;
}

// Move to next question
function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex < quizData.length) {
    loadQuestion();
  } else {
    showResults();
  }
}

// Show results page
function showResults() {
  hideAllPages();
  resultsPage.style.display = "block";

  const percentage = Math.round((score / quizData.length) * 100);

  // Update results display
  document.getElementById("final-score").textContent = `${percentage}%`;
  document.getElementById("correct-answers").textContent = score;
  document.getElementById("total-questions").textContent = quizData.length;
  document.getElementById("percentage").textContent = `${percentage}%`;

  // Set feedback based on score
  let feedback = "";
  if (percentage >= 90) {
    feedback = "Outstanding! You're a quiz master!";
  } else if (percentage >= 70) {
    feedback = "Great job! You know your stuff!";
  } else if (percentage >= 50) {
    feedback = "Good effort! Keep learning!";
  } else {
    feedback = "Nice try! Practice makes perfect!";
  }

  document.getElementById("result-feedback").textContent = feedback;

  // Update the score circle with animation
  const scoreCircle = document.querySelector(".score-circle");
  scoreCircle.style.background = `conic-gradient(var(--primary) 0% ${percentage}%, var(--light-gray) ${percentage}% 100%)`;
}

// Restart the quiz
function restartQuiz() {
  // Reset selection
  selectedCategory = null;
  selectedDifficulty = null;

  // Reset UI
  document
    .querySelectorAll(".category-card")
    .forEach((card) => card.classList.remove("selected"));
  document
    .querySelectorAll(".difficulty-btn")
    .forEach((btn) => btn.classList.remove("selected"));
  document.getElementById("start-quiz-btn").disabled = true;

  // Show landing page
  hideAllPages();
  landingPage.style.display = "block";
}

// Helper function to hide all pages
function hideAllPages() {
  landingPage.style.display = "none";
  quizPage.style.display = "none";
  resultsPage.style.display = "none";
  loadingState.style.display = "none";
  errorState.style.display = "none";
}

// Helper function to decode HTML entities
function decodeHtmlEntities(text) {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

// Helper function to shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
