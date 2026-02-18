🧠 QuizMaster - Interactive Quiz Application

QuizMaster is a fully responsive, vanilla JavaScript quiz application that fetches real trivia questions from the Open Trivia Database. Users can select a category and difficulty level, answer multiple‑choice questions, and receive immediate feedback with a detailed score report at the end.

🔗 Live Demo: https://alx-capstone-quiz-app.netlify.app/

📁 Folder Structure
The project follows a simple, organised file structure:

📁 alx-fe-capstone-quiz-app/
├── 01-index.html
├── css/
│ └── 02-style.css
├── js/
│ └── 03-script.js
└── 04-readme.md

01-index.html – Main HTML file containing the structure of the app.
02-style.css – All styles, including design tokens, components, and responsive rules.
03-script.js – Vanilla JavaScript implementing the quiz logic, API integration, and DOM updates.
04-readme.md – This documentation file.

🎯 Figma Design Files
The UI was designed in Figma before implementation.
These files include wireframes, high‑fidelity mockups, and interactive prototypes that guided the development. You can view the design files here:

01-Guidelines: [Figma-Capstone Project Guidelines](https://www.figma.com/design/QvGZU924YSW3FrN7tffoUO/Capstone-Project?node-id=0-1)

02-[The Idea: Figma-The Idea](https://www.figma.com/design/QvGZU924YSW3FrN7tffoUO/Capstone-Project?node-id=4-16)

03-[The Design: Figma-The Design](https://www.figma.com/design/QvGZU924YSW3FrN7tffoUO/Capstone-Project?node-id=36-1982)

🎨 Design System
01-Color Palette
CSS variables are used for consistent theming:

:root {
--primary: #4361ee;
--primary-dark: #3a56d4;
--secondary: #7209b7;
--success: #4cc9f0;
--error: #f72585;
--light: #f8f9fa;
--dark: #212529;
--gray: #6c757d;
--light-gray: #e9ecef;
--border-radius: 12px;
--box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
--transition: all 0.3s ease;
}

🔤Typography
02-Primary Font: Segoe UI – weights 300, 400, 500, 600, 700, 800.
-Fallback: sans-serif.
-Font sizes scale gracefully across breakpoints using rem units.

👨‍💻Components & Interactive States
03-All interactive elements include clearly defined states:
Component,States, Visual, and Feedback

-Category Card: Default, Hover, Selected Scale, border colour, background change
-Difficulty Btn: Default, Hover, Selected Background colour change
-Answer Button: Default, Hover, Selected, Correct, Incorrect Border, background, letter‑circle colour
-Primary Button: Default, Hover, Disabled Background, shadow, translateY animation
-Progress Bar: Incremental fill Smooth width transition (0.5s ease)

The design is fully responsive with breakpoints at 768px and 480px, ensuring a great experience on any device.

🔌 API Reference
04-Endpoint: https://opentdb.com/api.php
Parameters:

-amount=10 – Number of questions.
-category – Category ID
-difficulty – easy, medium, or hard.
-type=multiple – Multiple choice questions.

Example Request:
https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple

Response Format:
The API returns a JSON object with a results array containing question objects, each with:

-question – The question text (may contain HTML entities).
-correct_answer – The correct answer.
-incorrect_answers – An array of three incorrect answers.
-difficulty, category, etc.

⚙️ Setup & Installation
To run this project locally:

01- Clone the repository
git clone https://github.com/assaawin/alx-fe-capstone-quiz-app.git
cd alx-fe-capstone-quiz-app

02-Open the project
Simply open 01-index.html in your favourite browser.
No server or build tools required – it works directly from the file system

🙌 Credits
01-Open Trivia Database – Free and awesome trivia API.
https://opentdb.com/

02-Font Awesome – Icons.
https://fontawesome.com/

03-Figma – Design and prototyping tool used for the UI mockups.
