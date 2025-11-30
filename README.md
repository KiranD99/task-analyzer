# Task Analyzer

Task Analyzer is a full-stack application that helps users evaluate and rank tasks based on urgency, importance, effort, and dependencies. The backend is built with Django REST Framework, and the frontend uses HTML, CSS, and vanilla JavaScript. The goal is to simulate how people naturally prioritize tasks and automatically generate a priority score.

---

## Setup Instructions (Windows)

### 1. Clone the Repository
git clone https://github.com/KiranD99/task-analyzer.git



### 2. Navigate to Backend and Set It Up

cd task-analyzer/backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver



Backend will run at:
http://127.0.0.1:8000/



### 3. Run the Frontend

No setup required.  
Simply open this file in your browser:

frontend/index.html



---

## How the Priority Algorithm Works

The scoring algorithm uses four major factors to determine which tasks should come first:

### 1. Urgency
The nearer the due date, the higher the urgency:
- Overdue tasks get a major score boost.
- Due in ≤ 3 days → high urgency score.
- Due in ≤ 7 days → medium urgency.
- Anything further still contributes slightly.

This simulates natural human behavior around deadlines.

### 2. Importance
Users assign a value from 1 to 10.
Higher importance directly raises the score.
This helps separate “urgent” from “important”.

### 3. Effort
Tasks estimated under 2 hours get a small bonus.
These “quick wins” help shorten the task list fast.

### 4. Dependencies
- Tasks with **no dependencies** get a small boost.
- Tasks **blocking other tasks** often rank higher.
This keeps the workflow unblocked.

The final score is a weighted combination of all these factors.

---

## Design Decisions

- Chose Django REST Framework for clean and structured APIs.
- Kept the frontend framework-free for simplicity and clarity.
- Algorithm uses simple and explainable math — no black-box ML.
- Sorting strategies allow viewing tasks differently (urgency, importance, effort, dependencies).
- Codebase is modular to make each component easy to modify.

---

## Time Breakdown

Approximate time invested:

- Backend setup & models — 20 minutes  
- Priority scoring algorithm — 45 minutes  
- API views & Postman testing — 20 minutes  
- Frontend (HTML/CSS/JS) — 1 hour  
- Sorting strategies — 30 minutes  
- Debugging & fixes — 45 minutes  
- README & cleanup — 30 minutes  

**Total time: ~3 hours 45 minutes**

---

## Unit Tests

Three unit tests are included to validate the scoring logic.

They test:

1. Whether urgency scores overdue tasks appropriately  
2. Whether importance correctly increases the priority  
3. Whether dependencies influence the score properly  

Run tests using:

pytest



---

## Repository Link

https://github.com/KiranD99/task-analyzer