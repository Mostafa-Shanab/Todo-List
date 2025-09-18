"use strict";

const translations = {
  en: {
    hello: "Hello",
    login: "Login",
    signup: "Signup",
    logout: "Logout",
    todo: "To do",
    inProgress: "In progress",
    done: "Done",
    notes: "Notes & Reference",
    addTask: "+ Add task",
    editTask: "Edit task title:",
    deleteConfirm: "Are you sure you want to delete this task?",
    mustLogin: "You must log in first!",
    tasktitle: "Enter Task title :",
  },
  ar: {
    hello: "مرحباً",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    logout: "تسجيل خروج",
    todo: "المهام",
    inProgress: "قيد التنفيذ",
    done: "منجز",
    notes: "ملاحظات ومرجع",
    addTask: "+ أضف مهمة",
    editTask: "عدل عنوان المهمة:",
    deleteConfirm: "هل أنت متأكد أنك تريد حذف هذه المهمة؟",
    mustLogin: "يجب تسجيل الدخول أولاً!",
    tasktitle: "ادخل عنوان المهمة",
  },
};

let currentLang = localStorage.getItem("lang") || "en";

class Task {
  constructor(title, type, priorities = [], completed = false, date = null) {
    this.title = title;
    this.type = type; // section type: todo, in-progress, done, etc.
    this.completed = completed;
    this.priorities = priorities;
    this.date =
      date ||
      new Date().toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    this.person =
      document.querySelector("header img")?.getAttribute("src") || "";
  }

  // render task as HTML element
  render() {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    if (this.completed) taskDiv.classList.add("completed");

    taskDiv.innerHTML = `
      <div class="title">
        <i class="${
          this.completed ? "fa-solid" : "fa-regular"
        } fa-circle-check opacity-5"></i>
        <h3>${this.title}</h3>
      </div>
      <div class="priorities">
        ${this.priorities
          .map((p) => `<span class="priority ${p.toLowerCase()}">${p}</span>`)
          .join("")}
      </div>
      <div class="person">
        <img src="${this.person}" alt="User Image" />
        <span class="opacity-5 date">${this.date}</span>
      </div>
      <div class="actions">
        <i class="fa-solid fa-pen-to-square edit"></i>
        <i class="fa-solid fa-trash delete"></i>
      </div>
    `;

    // ✅ Toggle completion
    const checkIcon = taskDiv.querySelector(".fa-circle-check");
    checkIcon.addEventListener("click", () => {
      this.completed = !this.completed;
      taskDiv.classList.toggle("completed", this.completed);
      checkIcon.classList.toggle("fa-regular", !this.completed);
      checkIcon.classList.toggle("fa-solid", this.completed);
      saveTasksForUser(currentUserEmail);
    });

    // ✅ Edit task
    const editBtn = taskDiv.querySelector(".edit");
    editBtn.addEventListener("click", () => {
      const newTitle = prompt(translations[currentLang].editTask, this.title);
      if (newTitle) {
        this.title = newTitle;
        taskDiv.querySelector("h3").innerText = newTitle;
        saveTasksForUser(currentUserEmail);
      }
    });

    // ✅ Delete task
    const deleteBtn = taskDiv.querySelector(".delete");
    deleteBtn.addEventListener("click", () => {
      if (confirm(translations[currentLang].deleteConfirm)) {
        taskDiv.remove();
        saveTasksForUser(currentUserEmail);
      }
    });

    return taskDiv;
  }
}

// ---------------------- USER SESSION ----------------------

let currentUserEmail = sessionStorage.getItem("currentUserEmail"); // restore only for this session
console.log("Current user:", currentUserEmail);

const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    if (login(email, password)) {
      window.location.href = "index.html";
    }
  });
}

const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const firstName = document.getElementById("firstName").value.trim();
    const lastName = document.getElementById("lastName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (signup(email, password)) {
      let users = JSON.parse(localStorage.getItem("users")) || [];
      let user = users.find((u) => u.email === email);
      if (user) {
        user.firstName = firstName;
        user.lastName = lastName;
        localStorage.setItem("users", JSON.stringify(users));
      }

      window.location.href = "index.html";
    }
  });
}

// If logged in, load their tasks on page load
if (currentUserEmail) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find((u) => u.email === currentUserEmail);
  if (user) {
    renderTasks(user.tasks);
  }
}

function signup(email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find((u) => u.email === email)) {
    alert("User already exists!");
    return false;
  }
  users.push({ email, password, tasks: [] });
  localStorage.setItem("users", JSON.stringify(users));

  // auto login after signup
  sessionStorage.setItem("currentUserEmail", email);
  alert("Signup successful!");
  // renderTasks([]);
  return true;
}

function login(email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    alert("Login successful!");
    sessionStorage.setItem("currentUserEmail", email);
    // renderTasks(user.tasks);
    return true;
  } else {
    alert("Invalid credentials You should register first");
    return false;
  }
}

function saveTasksForUser(email) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find((u) => u.email === email);
  if (user) {
    let allTasks = [];
    document.querySelectorAll(".task").forEach((taskEl) => {
      const title = taskEl.querySelector("h3").innerText;
      const completed = taskEl.classList.contains("completed");
      const date = taskEl.querySelector(".date").innerText;
      const priorities = [...taskEl.querySelectorAll(".priority")].map(
        (p) => p.innerText
      );
      const type = taskEl.closest("section").classList[0]; // type (todo / in-progress / done / notes)

      allTasks.push({ title, completed, date, priorities, type });
    });
    user.tasks = allTasks;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

function renderTasks(tasks) {
  document.querySelectorAll(".tasks").forEach((el) => (el.innerHTML = "")); // clear
  tasks.forEach((t) => {
    const newTask = new Task(
      t.title,
      t.type || "todo",
      t.priorities || [],
      t.completed,
      t.date
    );
    const section = document.querySelector(`.${t.type || "todo"} .tasks`);
    if (section) section.appendChild(newTask.render());
  });
  document.querySelectorAll(".tasks").forEach((el) => {
    const addBtn = document.createElement("button");
    addBtn.className = "opacity-5";
    addBtn.textContent = translations[currentLang].addTask;
    el.appendChild(addBtn);
  });
}

const sections = document.querySelectorAll("section");
if (sections) {
  sections.forEach((section) => {
    section.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        if (!currentUserEmail) {
          alert("You must log in first!");
          return;
        }

        // const title = prompt("Enter task title:");
        const title = prompt(translations[currentLang].tasktitle);
        const priorities =
          prompt("Enter priorities (low, medium, high):") || "";
        if (!title) return;

        const type = section.classList[0]; // get section type
        const newTask = new Task(title, type, priorities.split(" "));

        const tasksContainer = section.querySelector(".tasks");
        tasksContainer.insertBefore(newTask.render(), e.target);
        saveTasksForUser(currentUserEmail);
      }
    });
  });
}

// ---------------------- MENU ----------------------
// to show login/signup buttons
const menu = document.querySelector("nav ul i");
if (menu) {
  menu.addEventListener("click", () => {
    document.querySelector("aside").classList.toggle("vis");
  });
}

function logout() {
  sessionStorage.removeItem("currentUserEmail");
  window.location.href = "index.html";
}

// function createTask(title, type, priorities) {
//   const newTask = new Task(title, type, priorities);
//   const section = document.querySelector(`.${type}`);
//   const tasksContainer = section.querySelector(".tasks");
//   tasksContainer.insertBefore(
//     newTask.render(),
//     section.querySelector("button")
//   );
//   return newTask;
// }

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  // غيّر النصوص حسب العناصر
  document.querySelector("#login-btn").innerText = translations[lang].login;
  document.querySelector("#signup-btn").innerText = translations[lang].signup;
  document.querySelector("#logout-btn").innerText = translations[lang].logout;
  document.querySelector(".todo h2").innerText = translations[lang].todo;
  document.querySelector(".in-progress h2").innerText =
    translations[lang].inProgress;
  document.querySelector(".done h2").innerText = translations[lang].done;
  document.querySelector(".notes h2").innerText = translations[lang].notes;

  // كل أزرار إضافة مهمة
  document.querySelectorAll(".tasks button").forEach((btn) => {
    btn.innerText = translations[lang].addTask;
  });

  // لو الموقع عربي خلي الـ direction RTL
  document.body.dir = lang === "ar" ? "rtl" : "ltr";
}

const langToggle = document.getElementById("lang-toggle");
if (langToggle) {
  langToggle.addEventListener("click", () => {
    setLanguage(currentLang === "en" ? "ar" : "en");
  });
}

// أول تحميل: طبق اللغة المحفوظة
window.addEventListener("DOMContentLoaded", () => {
  setLanguage(currentLang);
});
