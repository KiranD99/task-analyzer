let tasks = [];  // store tasks when using form mode

// (kept) safe date parser for reliable "due" sorting
function parseDateSafe(dateString) {
    if (!dateString || typeof dateString !== "string") return null;
    const parts = dateString.split("-");
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[2]);
    const d = new Date(year, month, day);
    return isNaN(d) ? null : d;
}

// --------------------
// Toggle Input Mode
// --------------------
function toggleInputMode() {
    const toggle = document.getElementById("modeToggle");
    const formInput = document.getElementById("formInput");
    const jsonInput = document.getElementById("jsonInput");
    if (toggle.checked) {
        formInput.style.display = "none";
        jsonInput.style.display = "block";
    } else {
        jsonInput.style.display = "none";
        formInput.style.display = "block";
    }
}

// --------------------
// Add Task (Form Mode)
// --------------------
function addTask() {
    const title = document.getElementById("title").value;
    const due_date = document.getElementById("due_date").value;
    const hours = document.getElementById("hours").value;
    const importance = document.getElementById("importance").value;
    const dependencies = document.getElementById("dependencies").value;

    if (!title || !due_date || !hours || !importance) {
        alert("Please fill all fields!");
        return;
    }

    const task = {
        title,
        due_date,
        estimated_hours: parseInt(hours),
        importance: parseInt(importance),
        dependencies: dependencies ? dependencies.split(",").map(d => d.trim()) : []
    };

    tasks.push(task);
    updateTaskList();
    clearForm();
}

function updateTaskList() {
    const list = document.getElementById("taskList");
    list.innerHTML = "";
    tasks.forEach(task => {
        list.innerHTML += `<li>${task.title} (Due: ${task.due_date})</li>`;
    });
}

function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("due_date").value = "";
    document.getElementById("hours").value = "";
    document.getElementById("importance").value = "";
    document.getElementById("dependencies").value = "";
}

// --------------------
// Analyze Tasks (Form Mode)
// --------------------
async function analyzeTasks() {
    if (tasks.length === 0) {
        alert("Add at least one task!");
        return;
    }

    const response = await fetch("http://127.0.0.1:8000/tasks/analyze/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tasks)
    });

    const data = await response.json();
    applySortingStrategy(data);
    displayResults(data);
}

// --------------------
// Analyze JSON Mode
// --------------------
async function analyzeJSON() {
    let raw = document.getElementById("jsonTextarea").value;
    try {
        let jsonTasks = JSON.parse(raw);

        const response = await fetch("http://127.0.0.1:8000/tasks/analyze/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonTasks)
        });

        const data = await response.json();
        applySortingStrategy(data);
        displayResults(data);

    } catch (e) {
        alert("Invalid JSON input!");
    }
}

// --------------------
// Apply Sorting Strategy (simple/original)
// --------------------
function applySortingStrategy(data) {
    const strategy = document.getElementById("strategy").value;

    const parseDateSafe = (dateString) => {
        const parts = dateString.split("-");
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };

    switch (strategy) {

        // 1. URGENCY
        case "urgency":
            data.sort((a, b) => {
                const da = parseDateSafe(a.due_date);
                const db = parseDateSafe(b.due_date);
                return da - db;
            });
            break;

        // 2. IMPORTANCE
        case "importance":
            data.sort((a, b) => b.importance - a.importance);
            break;

        // 3. EFFORT
        case "effort":
            data.sort((a, b) => a.estimated_hours - b.estimated_hours);
            break;

        // 4. DEPENDENCIES
        case "dependencies":
            data.sort((a, b) => (b.dependencies?.length || 0) - (a.dependencies?.length || 0));
            break;

        // OLD MODES
        case "hours":
            data.sort((a, b) => a.estimated_hours - b.estimated_hours);
            break;

        case "due":
            data.sort((a, b) => parseDateSafe(a.due_date) - parseDateSafe(b.due_date));
            break;

        default:
            data.sort((a, b) => b.score - a.score);
    }
}


// --------------------
// Display Results (no overdue class)
// --------------------
function displayResults(tasks) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    tasks.forEach(task => {
        // color only by score
        let priorityClass = "low";
        if ((task.score ?? 0) >= 80) priorityClass = "high";
        else if ((task.score ?? 0) >= 50) priorityClass = "medium";

        const card = `
            <div class="task-card ${priorityClass}">
                <h3>${task.title}</h3>
                <p><strong>Score:</strong> ${task.score}</p>
                <p><strong>Due Date:</strong> ${task.due_date}</p>
                <p><strong>Importance:</strong> ${task.importance}</p>
                <p><strong>Estimated Hours:</strong> ${task.estimated_hours}</p>
                <p><strong>Dependencies:</strong> ${JSON.stringify(task.dependencies)}</p>
            </div>
        `;
        resultsDiv.innerHTML += card;
    });
}
