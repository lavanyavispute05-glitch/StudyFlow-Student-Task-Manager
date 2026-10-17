let currentFilter = "all";
let searchText = "";

// =========================
// Get logged-in user
// =========================

const user = JSON.parse(localStorage.getItem("user"));

const welcomeMessage = document.getElementById("welcomeMessage");

if (welcomeMessage && user) {
    welcomeMessage.textContent =
        "Welcome back, " + user.name.trim() + "! 👋";
}

if (!user) {
    alert("Please login first.");
    window.location.href = "login.html";
}

// =========================
// Display Tasks
// =========================

async function displayTasks() {

    const taskList =
        document.getElementById("taskList");

    if (!taskList || !user) {
        return;
    }

    taskList.innerHTML = "";

    try {

        const response = await fetch(
            `http://localhost:5050/api/tasks/${user._id}`
        );

        const tasks = await response.json();

        if (!response.ok) {

            console.log(
                "Failed to load tasks:",
                tasks
            );

            return;
        }


        // =========================
        // Today's Reminder
        // =========================

        updateTodayReminder(tasks);


        // =========================
        // Statistics
        // =========================

        const totalTasks =
            document.getElementById("totalTasks");

        const pendingTasks =
            document.getElementById("pendingTasks");

        const completedTasks =
            document.getElementById("completedTasks");


        const completedCount =
            tasks.filter(function(task) {

                return task.completed === true;

            }).length;


        const pendingCount =
            tasks.filter(function(task) {

                return task.completed !== true;

            }).length;


        if (totalTasks) {

            
    totalTasks.textContent = tasks.length;

        }


        if (pendingTasks) {

            pendingTasks.textContent =
                pendingCount;
        }


        if (completedTasks) {

            completedTasks.textContent =
                completedCount;
        }


        // =========================
        // Today's Progress
        // =========================

        const progressText =
            document.getElementById(
                "todayProgressText"
            );

        const progressBar =
            document.getElementById(
                "todayProgressBar"
            );


        const now =
            new Date();


        const todayDate =
            now.getFullYear() +
            "-" +
            String(
                now.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                now.getDate()
            ).padStart(2, "0");


        const todayTasks =
            tasks.filter(function(task) {

                return task.date === todayDate;

            });


        const todayCompleted =
            todayTasks.filter(function(task) {

                return task.completed === true;

            }).length;


        const todayTotal =
            todayTasks.length;


        const progressPercentage =
            todayTotal === 0
                ? 0
                : Math.round(
                    (
                        todayCompleted /
                        todayTotal
                    ) * 100
                );


        if (progressText) {

            progressText.textContent =
                todayCompleted +
                " / " +
                todayTotal;
        }


        if (progressBar) {

            progressBar.style.width =
                progressPercentage + "%";
        }


        // =========================
        // Filter Tasks
        // =========================

        const filteredTasks =
            tasks.filter(function(task) {


                // Hide completed tasks
                // from All list

                if (
                    currentFilter === "all" &&
                    task.completed === true
                ) {

                    return false;
                }


                // Pending filter

                if (
                    currentFilter === "pending" &&
                    task.completed === true
                ) {

                    return false;
                }


                // Completed filter

                if (
                    currentFilter === "completed" &&
                    task.completed !== true
                ) {

                    return false;
                }


                // Search

                if (
                    searchText !== "" &&
                    !task.text
                        .toLowerCase()
                        .includes(
                            searchText.toLowerCase()
                        )
                ) {

                    return false;
                }


                return true;

            });


        // =========================
        // Display Each Task
        // =========================

        filteredTasks.forEach(
            function(task) {


                const li =
                    document.createElement("li");


                // =========================
                // Task Information
                // =========================

                const taskInfo =
                    document.createElement("div");


                const taskText =
                    document.createElement("strong");


                taskText.textContent =
                    task.text;


                if (task.completed) {

                    taskText.style.textDecoration =
                        "line-through";

                    taskText.style.opacity =
                        "0.5";
                }


                // =========================
// Task Date + Priority
// =========================

const taskDetails =
    document.createElement("div");

taskDetails.style.display =
    "block";

taskDetails.style.marginTop =
    "6px";

taskDetails.style.fontSize =
    "13px";


// =========================
// Task Date
// =========================

const taskDate =
    new Date(
        task.date + "T00:00:00"
    );

const today =
    new Date();

today.setHours(
    0,
    0,
    0,
    0
);


// IMPORTANT:
// This is the only tomorrow variable
// used inside this task loop.

const taskTomorrow =
    new Date(today);

taskTomorrow.setDate(
    today.getDate() + 1
);


// =========================
// Friendly Date
// =========================

let friendlyDate;

if (
    taskDate.getTime() ===
    today.getTime()
) {

    friendlyDate =
        "Today";

} else if (
    taskDate.getTime() ===
    taskTomorrow.getTime()
) {

    friendlyDate =
        "Tomorrow";

} else {

    friendlyDate =
        taskDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
}


// =========================
// Date + Priority Text
// =========================

taskDetails.textContent =
    "Due: " +
    friendlyDate +
    " • Priority: " +
    task.priority;


// =========================
// Due Date Color
// =========================

if (!task.completed) {

    // Overdue

    if (
        taskDate < today
    ) {

        taskInfo.classList.add(
            "due-overdue"
        );


    // Due Today

    } else if (
        taskDate.getTime() ===
        today.getTime()
    ) {

        taskInfo.classList.add(
            "due-today"
        );


    // Due Tomorrow

    } else if (
        taskDate.getTime() ===
        taskTomorrow.getTime()
    ) {

        taskInfo.classList.add(
            "due-tomorrow"
        );


    // Future

    } else {

        taskInfo.classList.add(
            "due-future"
        );
    }


} else {

    taskInfo.classList.add(
        "due-completed"
    );
}

                // =========================
                // Priority Color
                // =========================

                if (
                    task.priority === "High"
                ) {

                    taskDetails.style.color =
                        "red";

                } else if (
                    task.priority === "Medium"
                ) {

                    taskDetails.style.color =
                        "orange";

                } else {

                    taskDetails.style.color =
                        "green";
                }


                // =========================
                // Add Task Information
                // =========================

                taskInfo.appendChild(
                    taskText
                );


                taskInfo.appendChild(
                    document.createElement("br")
                );


                taskInfo.appendChild(
                    taskDetails
                );


                // =========================
                // Complete Button
                // =========================

                const completeButton =
                    document.createElement("button");


                completeButton.textContent =
                    "✓";


                completeButton.onclick =
                    async function() {

                        try {

                            const response =
                                await fetch(
                                    `http://localhost:5050/api/tasks/${task._id}`,
                                    {
                                        method: "PUT",

                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },

                                        body:
                                            JSON.stringify({
                                                completed:
                                                    !task.completed
                                            })
                                    }
                                );


                            if (response.ok) {

                                displayTasks();

                            }

                        } catch (error) {

                            console.log(
                                "Complete task error:",
                                error
                            );


                            showToast(
                                "Could not update task."
                            );
                        }
                    };


                // =========================
                // Edit Button
                // =========================

                const editButton =
                    document.createElement("button");


                editButton.textContent =
                    "✏️";


                editButton.onclick =
                    function() {

                        window.editingTask =
                            task;


                        const modal =
                            document.getElementById(
                                "editModal"
                            );


                        const editText =
                            document.getElementById(
                                "editTaskText"
                            );


                        const editDate =
                            document.getElementById(
                                "editTaskDate"
                            );


                        const editPriority =
                            document.getElementById(
                                "editTaskPriority"
                            );


                        editText.value =
                            task.text;


                        editDate.value =
                            task.date;


                        editPriority.value =
                            task.priority;


                        modal.style.display =
                            "flex";
                    };


                // =========================
                // Delete Button
                // =========================

                const deleteButton =
                    document.createElement("button");


                deleteButton.textContent =
                    "🗑️";


                deleteButton.onclick =
                    async function() {


                        const confirmed =
                            confirm(
                                "Are you sure you want to delete this task?"
                            );


                        if (!confirmed) {

                            return;
                        }


                        try {

                            const response =
                                await fetch(
                                    `http://localhost:5050/api/tasks/${task._id}`,
                                    {
                                        method:
                                            "DELETE"
                                    }
                                );


                            const data =
                                await response.json();


                            if (response.ok) {

                                showToast(
                                    "Task deleted successfully! 🗑️"
                                );


                                displayTasks();


                            } else {

                                showToast(
                                    data.message
                                );
                            }


                        } catch (error) {

                            console.log(
                                "Delete task error:",
                                error
                            );


                            showToast(
                                "Could not connect to the server."
                            );
                        }
                    };


                // =========================
                // Add Everything to Card
                // =========================

                li.appendChild(
                    taskInfo
                );


                li.appendChild(
                    completeButton
                );


                li.appendChild(
                    editButton
                );


                li.appendChild(
                    deleteButton
                );


                taskList.appendChild(
                    li
                );

            }
        );


    } catch (error) {

        console.log(
            "Error loading tasks:",
            error
        );


        showToast(
            "Could not load tasks."
        );
    }
}

// =========================
// Add New Task
// =========================

async function addTask() {

    const input =
        document.getElementById("taskInput");

    const date =
        document.getElementById("taskDate");

    const priority =
        document.getElementById("taskPriority");


    const task =
        input.value.trim();


    if (task === "") {

        showToast(
            "Please enter a task!"
        );

        return;
    }


    if (date.value === "") {

        showToast(
            "Please select a due date!"
        );

        return;
    }


    try {

        const response = await fetch(
            "http://localhost:5050/api/tasks",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({

                    userId: user._id,

                    text: task,

                    date: date.value,

                    priority: priority.value
                })
            }
        );


        const data =
            await response.json();


        if (response.ok) {

            showToast(
                data.message
            );

            input.value = "";

            date.value = "";

            priority.value = "Low";

            displayTasks();

        } else {

            showToast(
                data.message
            );
        }


    } catch (error) {

        console.log(
            "Add task error:",
            error
        );

        showToast(
            "Could not connect to the server."
        );
    }
}

// =========================
// Filter Tasks
// =========================

function filterTasks(filter) {

    currentFilter = filter;

    const buttons =
        document.querySelectorAll(
            ".task-filters button"
        );


    buttons.forEach(function(button) {

        button.classList.remove("active");

    });


    if (filter === "all") {

        if (buttons[0]) {
            buttons[0].classList.add("active");
        }

    } else if (filter === "pending") {

        if (buttons[1]) {
            buttons[1].classList.add("active");
        }

    } else if (filter === "completed") {

        if (buttons[2]) {
            buttons[2].classList.add("active");
        }
    }


    displayTasks();
}


// =========================
// Search Tasks
// =========================

function searchTasks() {

    const searchInput =
        document.getElementById("searchInput");


    if (!searchInput) {
        return;
    }


    searchText =
        searchInput.value.trim();


    displayTasks();
}


// =========================
// Logout
// =========================

function logout() {

    localStorage.removeItem("user");

    window.location.href =
        "login.html";
}


// =========================
// Dark Mode
// =========================

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark-mode"
    );


    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(
        "darkMode",
        isDark
    );
}


if (
    localStorage.getItem("darkMode") === "true"
) {

    document.body.classList.add(
        "dark-mode"
    );
}


// =========================
// Toast Notification
// =========================

function showToast(message) {

    const toast =
        document.getElementById("toast");


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(function() {

        toast.classList.remove(
            "show"
        );

    }, 2500);
}


// =========================
// Load Tasks
// =========================

if (
    document.getElementById("taskList")
) {

    displayTasks();
}

// =========================
// Edit Modal Functions
// =========================

function closeEditModal() {

    const modal =
        document.getElementById("editModal");

    modal.style.display = "none";

    window.editingTask = null;
}


// =========================
// Save Edited Task
// =========================

async function saveEditedTask() {

    const task = window.editingTask;

    if (!task) {
        return;
    }

    const editText =
        document.getElementById("editTaskText");

    const editDate =
        document.getElementById("editTaskDate");

    const editPriority =
        document.getElementById("editTaskPriority");

    const updatedText =
        editText.value.trim();

    const updatedDate =
        editDate.value;

    const updatedPriority =
        editPriority.value;


    if (updatedText === "") {

        showToast("Task cannot be empty.");

        return;
    }


    if (updatedDate === "") {

        showToast("Please select a due date.");

        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5050/api/tasks/${task._id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    text: updatedText,
                    date: updatedDate,
                    priority: updatedPriority
                })
            }
        );


        const data =
            await response.json();


        if (response.ok) {

            closeEditModal();

            showToast(
                "Task updated successfully! ✏️"
            );

            displayTasks();

        } else {

            showToast(
                data.message ||
                "Could not update task."
            );
        }


    } catch (error) {

        console.log(
            "Edit task error:",
            error
        );

        showToast(
            "Could not connect to the server."
        );
    }
}


// Check once when the page loads

// =========================
// Today's Reminder
// =========================

function updateTodayReminder(tasks) {

    const reminderBox =
        document.getElementById("todayReminder");

    if (!reminderBox) {
        return;
    }


    // =========================
    // Today's Date
    // =========================

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const todayDate =
        today.getFullYear() +
        "-" +
        String(
            today.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            today.getDate()
        ).padStart(2, "0");


    // =========================
    // Tomorrow's Date
    // =========================

    const tomorrow =
        new Date(today);

    tomorrow.setDate(
        today.getDate() + 1
    );


    const tomorrowDate =
        tomorrow.getFullYear() +
        "-" +
        String(
            tomorrow.getMonth() + 1
        ).padStart(2, "0") +
        "-" +
        String(
            tomorrow.getDate()
        ).padStart(2, "0");


    // =========================
    // Find Tasks
    // =========================

    const todayTasks =
        tasks.filter(function(task) {

            return (
                task.date === todayDate &&
                task.completed !== true
            );

        });


    const tomorrowTasks =
        tasks.filter(function(task) {

            return (
                task.date === tomorrowDate &&
                task.completed !== true
            );

        });


    const overdueTasks =
        tasks.filter(function(task) {

            return (
                task.date < todayDate &&
                task.completed !== true
            );

        });


    // =========================
    // No Reminders
    // =========================

    if (
        todayTasks.length === 0 &&
        tomorrowTasks.length === 0 &&
        overdueTasks.length === 0
    ) {

        reminderBox.innerHTML = "";

        reminderBox.style.display =
            "none";

        return;
    }


    // =========================
    // Show Reminder Box
    // =========================

    reminderBox.style.display =
        "block";


    let reminderHTML = "";


    // =========================
    // Overdue
    // =========================

    if (
        overdueTasks.length > 0
    ) {

        reminderHTML += `
            <div>
                ⚠️ You have
                <strong>
                    ${overdueTasks.length}
                </strong>
                overdue assignment${ 
                    overdueTasks.length > 1
                        ? "s"
                        : ""
                }.
            </div>
        `;
    }


    // =========================
    // Due Today
    // =========================

    if (
        todayTasks.length > 0
    ) {

        reminderHTML += `
            <div>
                🔔 You have
                <strong>
                    ${todayTasks.length}
                </strong>
                pending task${
                    todayTasks.length > 1
                        ? "s"
                        : ""
                }
                due today.
            </div>
        `;
    }


    // =========================
    // Due Tomorrow
    // =========================

    if (
        tomorrowTasks.length > 0
    ) {

        reminderHTML += `
            <div>
                📅 You have
                <strong>
                    ${tomorrowTasks.length}
                </strong>
                pending task${
                    tomorrowTasks.length > 1
                        ? "s"
                        : ""
                }
                due tomorrow.
            </div>
        `;
    }


    reminderBox.innerHTML =
        reminderHTML;
}