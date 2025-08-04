// script.js

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const todoStats = document.getElementById('todo-stats');
const todoCount = document.getElementById('todo-count');
const todoCompleted = document.getElementById('todo-completed');

let tasks = [];

// Load tasks from local storage
document.addEventListener('DOMContentLoaded', function() {
  const storedTasks = localStorage.getItem('tasks');
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    tasks.forEach(task => addTask(task.text, task.completed));
    updateStats();
  }
});

todoForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const newTask = todoInput.value;

  if (newTask === '') {
    alert('Please enter a task!');
    return;
  }
  todoInput.value = '';
  addTask(newTask);
  updateStats();
});

function addTask(task, completed = false) {
  const listItem = document.createElement('li');
  const taskText = document.createElement('span');
  taskText.textContent = task;
  listItem.appendChild(taskText);

  const checkBox = document.createElement('input');
  checkBox.setAttribute('type', 'checkbox');
  checkBox.checked = completed;
  listItem.appendChild(checkBox);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  listItem.appendChild(deleteButton);

  const editButton = document.createElement('button');
  editButton.textContent = 'Edit';
  listItem.appendChild(editButton);

  todoList.appendChild(listItem);

  checkBox.addEventListener('change', function() {
    if (this.checked) {
      taskText.style.textDecoration = 'line-through';
      listItem.classList.add('completed');
    } else {
      taskText.style.textDecoration = 'none';
      listItem.classList.remove('completed');
    }
    updateStats();
  });

  deleteButton.addEventListener('click', function() {
    todoList.removeChild(listItem);
    tasks = tasks.filter(t => t.text !== task);
    updateStats();
  });

  editButton.addEventListener('click', function() {
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = taskText.textContent;
    listItem.appendChild(editInput);
    taskText.style.display = 'none';

    editInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        taskText.textContent = editInput.value;
        taskText.style.display = 'block';
        listItem.removeChild(editInput);
        tasks = tasks.map(t => t.text === task ? { text: editInput.value, completed: t.completed } : t);
        updateStats();
      }
    });
  });

  tasks.push({ text: task, completed: false });
  saveTasksToLocalStorage();
  updateStats();
}

function updateStats() {
  const taskCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  todoCount.textContent = `${taskCount} tasks`;
  todoCompleted.textContent = `${completedCount} completed`;
}

function saveTasksToLocalStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Add a "See My List" button to display the task list
const seeMyListButton = document.createElement('button');
seeMyListButton.textContent = 'See My List';
todoStats.appendChild(seeMyListButton);

seeMyListButton.addEventListener('click', function() {
  todoList.style.display = 'block';
  todoStats.style.display = 'none';
});

// Add a "New Task" button to add a new task
const newTaskButton = document.createElement('button');
newTaskButton.textContent = 'New Task';
todoStats.appendChild(newTaskButton);

newTaskButton.addEventListener('click', function() {
  todoForm.style.display = 'block';
  todoStats.style.display = 'none';
});