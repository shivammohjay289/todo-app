// ===== Show/Hide Sections =====
const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');
const todoSection = document.getElementById('todoSection');

document.getElementById('showSignup').addEventListener('click', () => {
  loginSection.style.display = 'none';
  signupSection.style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', () => {
  signupSection.style.display = 'none';
  loginSection.style.display = 'block';
});

// ===== Signup =====
const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/users/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Signup successful! Please login.");
      signupSection.style.display = 'none';
      loginSection.style.display = 'block';
    } else {
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    alert(err.message);
  }
});

// ===== Login =====
const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showTodoSection();
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert(err.message);
  }
});

// ===== Show Todo Section =====
function showTodoSection() {
  loginSection.style.display = 'none';
  signupSection.style.display = 'none';
  todoSection.style.display = 'block';

  const currentUser = JSON.parse(localStorage.getItem("user"));
  document.getElementById("welcome").innerText = `Welcome, ${currentUser.name}!`;
  renderTasks();
}

// ===== Todo Logic =====
const addTaskBtn = document.getElementById("addTask");
const taskInput = document.getElementById("taskInput");
const todoList = document.getElementById("todoList");

// ---- Fetch all Todos (GET) ----
async function renderTasks() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert('Please login');
    return;
  }

  try {
    const res = await fetch("/api/todo/get", {
      method: "GET",
      headers: { "Authorization": `Bearer ${token}` },
    });

    // defensive: if server returned non-json (rare if server correct), show text
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error('Non-JSON response when fetching todos:', text);
      alert('Server returned non-JSON response. Check server logs.');
      return;
    }

    if (!res.ok) {
      alert(data.message || "Failed to fetch todos");
      return;
    }

    const todos = data.getodo || [];
    todoList.innerHTML = '';

    todos.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.title + ' ';

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => deleteTask(item._id));
      li.appendChild(delBtn);

      todoList.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    alert("Error fetching todos");
  }
}

// ---- Add Todo (POST) ----
addTaskBtn.addEventListener("click", async () => {
  const task = taskInput.value.trim();
  if (!task) return;

  const token = localStorage.getItem("token");
  if (!token) {
    alert('Please login first');
    return;
  }

  try {
    const res = await fetch("/api/todo/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ title: task, description: "todo task" }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Todo added successfully!");
      taskInput.value = '';
      renderTasks();
    } else {
      alert(data.message || "Failed to add todo");
    }
  } catch (err) {
    console.error(err);
    alert("Error adding todo");
  }
});

// ---- Delete Todo (DELETE) ----
async function deleteTask(id) {
  const token = localStorage.getItem("token");
  if (!token) return alert('Please login');

  try {
    const res = await fetch(`/api/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert("Todo deleted successfully!");
      renderTasks();
    } else {
      alert(data.message || "Failed to delete todo");
    }
  } catch (err) {
    console.error(err);
    alert("Error deleting todo");
  }
}

// ===== Logout =====
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  todoSection.style.display = 'none';
  loginSection.style.display = 'block';
});

// ===== Auto login if already logged in =====
if (localStorage.getItem("user") && localStorage.getItem("token")) {
  showTodoSection();
}
