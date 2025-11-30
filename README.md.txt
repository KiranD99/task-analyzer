Task Analyzer

This project is a small full-stack application that helps users rank their tasks based on urgency, importance, effort, and dependencies. The backend is built using Django REST Framework, and the frontend uses plain HTML, CSS, and JavaScript. The goal is to simulate how someone might evaluate tasks in real life and assign them a priority score.

Setup Instructions
1. Clone the Repository
git clone https://github.com/YOUR-USERNAME/task-analyzer.git

2. Set Up the Backend

Move into the backend directory:

cd task-analyzer/backend


Create a virtual environment:

python -m venv venv


Activate it:

Windows

venv\Scripts\activate


Mac/Linux

source venv/bin/activate


Install the dependencies:

pip install -r requirements.txt


Run migrations:

python manage.py migrate


Start the server:

python manage.py runserver


The API will run on:

http://127.0.0.1:8000/

3. Run the Frontend

Open the following file in your browser:

frontend/index.html


There is no build step required.

How the Priority Algorithm Works

The algorithm is designed to imitate how people naturally think about task importance. It uses four main factors that influence the final score:

1. Urgency (How soon the task is due)

The due date plays a major role. The closer the deadline, the higher the score.

If the task is overdue, it gets a large boost.

If it is due very soon (within 3 days), it receives a high urgency score.

Due within 7 days gives a medium score.

Anything further away still gets a small contribution.

This mirrors how most people treat deadlines—things that are due sooner feel more important.

2. Importance (How valuable the task is)

The user assigns a value between 1 and 10. Higher values mean the task matters more, and this adds a steady amount to the score. This helps the algorithm separate something “urgent” from something “important”.

3. Effort (How long the task will take)

Short tasks (usually under 2 hours) get a small positive bump. This is meant to encourage completing “quick wins” that clear mental space and reduce the to-do list quickly.

4. Dependencies (Does this task block others?)

A task with no dependencies can be done immediately and gets a small bonus.
If a task blocks other tasks, it gets slightly higher priority.
The idea is that completing upstream tasks keeps the workflow unblocked.

The final score is the combination of all four categories. Tasks with the highest total score appear first.

Design Decisions

I chose Django REST Framework for the backend because it made it easy to build clean API endpoints. The frontend is intentionally lightweight to focus on functionality rather than UI frameworks. The scoring algorithm uses simple arithmetic instead of machine learning to keep it explainable. The sorting strategies allow users to view tasks from different perspectives such as urgency-based, effort-based, importance-based, or dependency-based.

The overall design aims for clarity, predictability, and maintainability.

Time Breakdown

Here is a rough estimate of the time spent on each part:

Backend setup and models: 20 minutes

Priority scoring algorithm: 45 minutes

API endpoints and testing with Postman: 20 minutes

Frontend development (HTML, CSS, JS): 1 hour

Sorting strategy logic: 30 minutes

Debugging, bug fixing, and polishing: 45 minutes

Writing README, documentation, and cleanup: 30 minutes

Total: approximately 3 hours and 45 minutes.

Unit Tests

Three unit tests are included for the scoring algorithm. These tests check:

Whether urgency is reflected correctly in overdue tasks

Whether importance increases the score properly

Whether dependencies affect the score as expected

You can run tests using:

pytest
