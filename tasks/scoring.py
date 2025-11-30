from datetime import date, datetime

def calculate_task_score(task):

    # Default values even if missing
    title = task.get("title", "")
    due_date = task.get("due_date", None)
    estimated_hours = task.get("estimated_hours", 0)
    importance = task.get("importance", 1)
    dependencies = task.get("dependencies", [])

    # Fix hours if empty or string
    try:
        estimated_hours = int(estimated_hours)
    except:
        estimated_hours = 0

    # Fix importance if empty or string
    try:
        importance = int(importance)
    except:
        importance = 1

    # Fix dependencies if not a list
    if not isinstance(dependencies, list):
        dependencies = []

    # Parse date safely
    if isinstance(due_date, str) and due_date.strip() != "":
        try:
            due_date = datetime.strptime(due_date, "%Y-%m-%d").date()
        except:
            due_date = None  # invalid date
    else:
        due_date = None

    # Calculate score
    score = 0

    # Urgency calculation
    if due_date:
        days_until_due = (due_date - date.today()).days

        if days_until_due < 0:
            score += 100
        elif days_until_due <= 3:
            score += 50
        elif days_until_due <= 7:
            score += 30
        else:
            score += 10
    else:
        score += 0   # no date → no urgency boost

    # Importance
    score += importance * 5

    # Quick task bonus
    if estimated_hours <= 2:
        score += 10

    # Dependencies
    dep_count = len(dependencies)
    if dep_count == 0:
        score += 15
    elif dep_count <= 2:
        score += 5
    else:
        score -= 5

    return score
