// Get the elements we need from the page
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const errorMessage = document.getElementById("error-message");
const emptyMessage = document.getElementById("empty-message");
const taskCount = document.getElementById("task-count");

// This array holds all the tasks. Each task looks like:
// { id: 1697040000000, text: "Buy milk", completed: false }
let tasks = [];

// Load the saved tasks from localStorage (if there are any)
function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  if (savedTasks) {
    try {
      tasks = JSON.parse(savedTasks) || [];
    } catch (error) {
      // If the saved data is broken, just start with an empty list
      tasks = [];
    }
  }
}

// Save the tasks array to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Show an error message under the input box
function showError(message) {
  errorMessage.textContent = message;
  taskInput.classList.add("input-error");
}

// Hide the error message again
function clearError() {
  errorMessage.textContent = "";
  taskInput.classList.remove("input-error");
}

// Add a new task to the array
function addTask(text) {
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

// Switch a task between complete and not complete
function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

// Remove a task from the array
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
  renderTasks();
}

// Build the <li> element for one task
function createTaskElement(task) {
  const li = document.createElement("li");
  li.className = "task";
  if (task.completed) {
    li.classList.add("completed");
  }

  // The label makes it so clicking the text also ticks the checkbox
  const label = document.createElement("label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const text = document.createElement("span");
  text.textContent = task.text;

  label.appendChild(checkbox);
  label.appendChild(text);

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-btn";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", (event) => {
    // Ignore the 2nd click of a double-click, otherwise the task that
    // moves up into this spot would get deleted too
    if (event.detail > 1) {
      return;
    }
    deleteTask(task.id);
  });

  li.appendChild(label);
  li.appendChild(deleteButton);

  return li;
}

// Draw the whole list on the page using the tasks array
function renderTasks() {
  // Clear the old list first so nothing gets duplicated
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });

  if (tasks.length === 0) {
    emptyMessage.style.display = "block";
    taskCount.textContent = "";
  } else {
    emptyMessage.style.display = "none";

    const completedCount = tasks.filter((task) => task.completed).length;
    taskCount.textContent = "Completed: " + completedCount + " / " + tasks.length;
  }
}

// Runs when the user clicks "Add" or presses Enter
function handleSubmit(event) {
  event.preventDefault(); // stop the form from reloading the page

  const text = taskInput.value.trim();

  if (text === "") {
    showError("Please type a task before adding it.");
    taskInput.focus();
    return;
  }

  clearError();
  addTask(text);
  taskInput.value = "";
  taskInput.focus();
}

taskForm.addEventListener("submit", handleSubmit);
taskInput.addEventListener("input", clearError);

// Load saved tasks and show them when the page opens
loadTasks();
renderTasks();
