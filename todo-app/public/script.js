// Example client-side script to add tasks dynamically

const taskList = document.getElementById('task-list');

// Sample tasks (for demo purposes)
const tasks = [
    { id: 1, name: 'Do the laundry', completed: false },
    { id: 2, name: 'Buy groceries', completed: true },
];

// Render the tasks
function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.name;
        taskList.appendChild(li);
    });
}

renderTasks();
