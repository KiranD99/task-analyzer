from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Task
from .scoring import calculate_task_score


# ----------------------------
# 1. /analyze/ endpoint
# ----------------------------
@api_view(['POST'])
def analyze_tasks(request):
    task_list = request.data
    results = []

    for task_data in task_list:
        score = calculate_task_score(task_data)
        task_data["score"] = score
        results.append(task_data)

    sorted_results = sorted(results, key=lambda x: x["score"], reverse=True)
    return Response(sorted_results)


# ----------------------------
# Helper: Reason Generator
# ----------------------------
def get_reason(task):
    reasons = []
    from datetime import date

    days_until_due = (task.due_date - date.today()).days

    if days_until_due < 0:
        reasons.append("Overdue")
    elif days_until_due <= 3:
        reasons.append("Deadline very close")
    elif days_until_due <= 7:
        reasons.append("Due this week")

    if task.importance >= 8:
        reasons.append("Very important")
    elif task.importance >= 5:
        reasons.append("Moderately important")

    if task.estimated_hours < 2:
        reasons.append("Quick task")

    if not task.dependencies:
        reasons.append("No dependencies")

    return ", ".join(reasons) or "Balanced task"


# ----------------------------
# 2. /suggest/ endpoint
# ----------------------------
@api_view(['GET'])
def suggest_tasks(request):
    tasks = Task.objects.all()
    results = []

    for task in tasks:
        score = calculate_task_score(task)
        results.append({
            "title": task.title,
            "score": score,
            "reason": get_reason(task),
        })

    sorted_results = sorted(results, key=lambda x: x["score"], reverse=True)
    return Response(sorted_results[:3])
