let lists = [], selectedList = null;
const el = id => document.getElementById(id);

function addList() {
  const name = el('new-list').value.trim();
  if (!name) return;
  lists.push({ id: Date.now(), name, tasks: [] });
  el('new-list').value = "";
  renderLists();
}

function selectList(id) {
  selectedList = lists.find(l => l.id === id);
  el('list-title').textContent = selectedList.name;
  el('task-section').classList.remove('hidden');
  renderTasks();
}

function addTask() {
  if (!selectedList) return;
  const title = el('task-title').value.trim();
  const date = el('task-date').value;
  const time = el('task-time').value;
  if (!title) return;
  selectedList.tasks.push({ id: Date.now(), title, date, time, completed: false });
  el('task-title').value = ""; el('task-date').value = ""; el('task-time').value = "";
  renderTasks();
}

function editList(id) {
  const list = lists.find(l => l.id === id);
  const name = prompt("Edit list name:", list.name);
  if (name) { list.name = name; if (list === selectedList) el('list-title').textContent = name; }
  renderLists();
}

function deleteList(id) {
  if (confirm("Delete this list?")) {
    lists = lists.filter(l => l.id !== id);
    if (selectedList?.id === id) {
      selectedList = null;
      el('task-section').classList.add('hidden');
      el('list-title').textContent = "Select a List";
    }
    renderLists();
  }
}

function editTask(id) {
  const task = selectedList.tasks.find(t => t.id === id);
  const title = prompt("Edit task title:", task.title);
  if (title) { task.title = title; renderTasks(); }
}

function deleteTask(id) {
  selectedList.tasks = selectedList.tasks.filter(t => t.id !== id);
  renderTasks();
}

function toggleCompleteTask(id) {
  const task = selectedList.tasks.find(t => t.id === id);
  task.completed = !task.completed;
  renderTasks();
}

function renderLists() {
  el('lists').innerHTML = "";
  lists.forEach(l => {
    const div = document.createElement('div');
    div.className = "list-item";
    div.innerHTML = `
      <button onclick="selectList(${l.id})">${l.name}</button>
      <button onclick="editList(${l.id})">✏️</button>
      <button onclick="deleteList(${l.id})">🗑️</button>`;
    el('lists').appendChild(div);
  });
}

function renderTasks() {
  el('tasks').innerHTML = "";
  let anyUnchecked = false;
  selectedList.tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = "task-item" + (t.completed ? " completed" : "");
    li.innerHTML = `
      <input type="checkbox" class="checkbox" ${t.completed ? 'checked' : ''} onchange="toggleCompleteTask(${t.id})">
      <span>${t.title} <small>${t.date} ${t.time}</small></span>
      <div class="task-buttons">
        <button onclick="editTask(${t.id})">Edit</button>
        <button onclick="deleteTask(${t.id})">Delete</button>
      </div>`;
    if (!t.completed) anyUnchecked = true;
    el('tasks').appendChild(li);
  });
  el('complete-selected').classList.toggle('hidden', !anyUnchecked);
}

function completeSelectedTasks() {
  selectedList.tasks.forEach(t => t.completed = true);
  renderTasks();
}
