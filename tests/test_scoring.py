import pytest
from tasks.scoring import calculate_task_score
from datetime import date, timedelta

# 1. Urgency test
def test_urgency_high_priority():
    task = {
        "title": "Urgent Task",
        "due_date": (date.today() - timedelta(days=1)).strftime("%Y-%m-%d"),
        "estimated_hours": 2,
        "importance": 5,
        "dependencies": []
    }
    score = calculate_task_score(task)
    assert score >= 100    # overdue → should be high

# 2. Importance weighting
def test_importance_affects_score():
    low = {
        "title": "Low",
        "due_date": (date.today() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "estimated_hours": 2,
        "importance": 2,
        "dependencies": []
    }
    high = {
        "title": "High",
        "due_date": (date.today() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "estimated_hours": 2,
        "importance": 9,
        "dependencies": []
    }
    assert calculate_task_score(high) > calculate_task_score(low)

# 3. Dependencies test
def test_dependencies_increase_priority():
    no_dep = {
        "title": "A",
        "due_date": (date.today() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "estimated_hours": 3,
        "importance": 5,
        "dependencies": []
    }
    dep = {
        "title": "B",
        "due_date": (date.today() + timedelta(days=5)).strftime("%Y-%m-%d"),
        "estimated_hours": 3,
        "importance": 5,
        "dependencies": ["A"]
    }
    assert calculate_task_score(dep) > calculate_task_score(no_dep)
