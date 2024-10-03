document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const taskList = document.getElementById('taskList');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const undoDeleteBtn = document.getElementById('undoDeleteBtn'); // Undo button
    const priorityInput = document.getElementById('priority');

    let lastDeletedTask = null; // To store the last deleted task
    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach((li) => {
            const taskText = li.textContent.replace(/Delete$/, '').trim(); // Get the task text
            const dueDate = li.querySelector('span.date') ? li.querySelector('span.date').textContent.replace('(Due: ', '').replace(')', '').trim() : '';
            const priority = li.getAttribute('data-priority') || 'Medium'; // Default priority
            tasks.push({ taskText, dueDate, priority });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Store as JSON string
        console.log('Tasks saved:', tasks); // Log the saved tasks
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        console.log('Tasks loaded:', tasks); // Log the loaded tasks
        tasks.forEach((task) => {
            addTaskToDOM(task.taskText, task.dueDate, task.priority);
        });
    }

    // Function to add a task to the DOM
    function addTaskToDOM(taskText, dueDate, priority) {
        const li = document.createElement('li');
        li.textContent = taskText;
        li.setAttribute('data-priority', priority);

        // Add click event for toggling completion
        li.onclick = function() {
            toggleComplete(li);
        };

        // Display the due date if provided
        if (dueDate) {
            const dateSpan = document.createElement('span');
            dateSpan.classList.add('date');
            dateSpan.textContent = ` (Due: ${dueDate})`;
            li.appendChild(dateSpan);
        }

        // Display the priority
        const prioritySpan = document.createElement('span');
        prioritySpan.classList.add('priority');
        prioritySpan.textContent = ` [${priority} Priority]`;
        li.appendChild(prioritySpan);

        // Add a delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() {
            lastDeletedTask = {
                element: li,
                taskText,
                dueDate,
                priority
            };
            taskList.removeChild(li);
            saveTasks(); // Save tasks after deletion
        };

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    }
    // Function to toggle task completion
    function toggleComplete(taskItem) {
        taskItem.classList.toggle('completed');
        saveTasks();
    }

    // Function to add a task
    function addTask() {
        const taskText = taskInput.value.trim();
        const dueDate = dueDateInput.value;
        const priority = priorityInput.value;

        if (taskText === "") return;

        const li = document.createElement('li');
        li.textContent = taskText;

        li.setAttribute('data-priority', priority);  

        // Add click event for toggling completion
        li.onclick = function() {
            toggleComplete(li);
        };

        // Display the due date if provided
        if (dueDate) {
            const dateSpan = document.createElement('span');
            dateSpan.classList.add('date');  // Add the class for styling
            dateSpan.textContent = ` (Due: ${dueDate})`;
            li.appendChild(dateSpan);
        }

        // Display the priority
        const prioritySpan = document.createElement('span');
        prioritySpan.classList.add('priority');  // Add the class for styling
        prioritySpan.textContent = ` [${priority}]`;
        li.appendChild(prioritySpan);

        // Add a delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() {
            lastDeletedTask = {
                element: li,
                taskText: taskText,
                dueDate: dueDate,
                priority: priority
            };
            console.log('Task deleted:', lastDeletedTask); // Log deleted task for debugging
            taskList.removeChild(li);
        };

        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        // Clear input fields after adding the task
        taskInput.value = '';
        dueDateInput.value = '';
        priorityInput.value = 'Medium'; // Reset to default
    }

    // Event listener for the Add Task button
    addTaskBtn.addEventListener('click', addTask);

    // Function to clear all tasks
    function clearAllTasks() {
        taskList.innerHTML = ''; // Clears all tasks
    }

    // Event listener for the Clear All button
    clearAllBtn.addEventListener('click', clearAllTasks);

    // Function to undo the last deletion
    function undoLastDelete() {
        if (lastDeletedTask) {
            console.log('Undo last deleted task:', lastDeletedTask); // Log task being restored
            const li = document.createElement('li');
            li.textContent = lastDeletedTask.taskText;
    
            li.setAttribute('data-priority', lastDeletedTask.priority);
    
            // Add click event for toggling completion
            li.onclick = function() {
                toggleComplete(li);
            };
    
            // Display the due date if it was provided
            if (lastDeletedTask.dueDate) {
                const dateSpan = document.createElement('span');
                dateSpan.classList.add('date');  // Add the class for styling
                dateSpan.textContent = ` (Due: ${lastDeletedTask.dueDate})`;
                li.appendChild(dateSpan);
            }
    
            // Display the priority
            const prioritySpan = document.createElement('span');
            prioritySpan.classList.add('priority');  // Add the class for styling
            prioritySpan.textContent = ` [${lastDeletedTask.priority}]`;
            li.appendChild(prioritySpan);
    
            // Add the delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                lastDeletedTask = {
                    element: li,
                    taskText: lastDeletedTask.taskText,
                    dueDate: lastDeletedTask.dueDate,
                    priority: lastDeletedTask.priority
                };
                taskList.removeChild(li);
                saveTasks(); // Save tasks after deletion
            };
    
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
    
            // Save tasks after undoing the deletion
            saveTasks(); // <-- This line ensures the task is saved after restoration
            lastDeletedTask = null; // Clear after undoing
        } else {
            console.log('No task to undo.');
        }
    }
    

    // Event listener for the Undo button
    undoDeleteBtn.addEventListener('click', function() {
        console.log('Undo button clicked');
        undoLastDelete();
    });
});


