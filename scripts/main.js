"use strict";

// to show login/signup buttons
const menu = document.querySelector("nav ul i");
menu.addEventListener("click", () => {
  document.querySelector("aside").classList.toggle("vis");
});

class Task {
  constructor(title, type, priorities = []) {
    this.title = title;
    this.type = type; // section type: todo, in-progress, done, etc.
    this.completed = false;
    this.priorities = priorities;
    this.date = new Date().toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    this.person = document.querySelector("header img").getAttribute("src");
  }

  // method to render task as HTML element
  render() {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    taskDiv.innerHTML = `
      <div class="title">
        <i class="fa-regular fa-circle-check opacity-5"></i>
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
    `;

    // Toggle completion on icon click
    const checkIcon = taskDiv.querySelector("i");
    checkIcon.addEventListener("click", () => {
      this.completed = !this.completed;
      taskDiv.classList.toggle("completed", this.completed);
      checkIcon.classList.toggle("fa-regular", !this.completed);
      checkIcon.classList.toggle("fa-solid", this.completed);

      saveTasksForUser(currentUserEmail); // update storage when toggled
    });

    return taskDiv;
  }
}

let currentUserEmail = null;

function signup(email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (users.find((u) => u.email === email)) {
    alert("User already exists!");
    return false;
  }
  users.push({ email, password, tasks: [] });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Signup successful!");
  return true;
}

function login(email, password) {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);
  if (user) {
    currentUserEmail = email;
    renderTasks(user.tasks);
    alert("Login successful!");
    return true;
  } else {
    alert("Invalid credentials");
    return false;
  }
}

function saveTasksForUser(email) {
  console.log("hi from save");
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let user = users.find((u) => u.email === email);
  if (user) {
    // collect tasks from DOM
    console.log("hi from save2");
    let allTasks = [];
    document.querySelectorAll(".task").forEach((taskEl) => {
      const title = taskEl.querySelector("h3").innerText;
      const completed = taskEl.classList.contains("completed");
      allTasks.push({ title, completed });
    });
    user.tasks = allTasks;
    localStorage.setItem("users", JSON.stringify(users));
  }
}

function renderTasks(tasks) {
  document.querySelectorAll(".tasks").forEach((el) => (el.innerHTML = "")); // clear
  tasks.forEach((t) => {
    const newTask = new Task(t.title, "todo", []); // you can restore priorities too
    const section = document.querySelector(".todo .tasks");
    section.appendChild(newTask.render());
    if (t.completed) section.lastChild.classList.add("completed");
  });
}

const sections = document.querySelectorAll("section");
sections.forEach((section) => {
  section.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      if (currentUserEmail) {
        alert("You must log in first!");
        return;
      }

      const title = prompt("Enter task title:");
      const priorities = prompt("Enter priorities (low, medium, high):") || "";
      if (!title) return;

      // get section type from class (todo, in-progress, etc.)
      const type = section.classList[0];

      const newTask = new Task(title, type, priorities.split(" "));

      // render & append task to this section
      const tasksContainer = section.querySelector(".tasks");
      tasksContainer.insertBefore(newTask.render(), e.target);
      saveTasksForUser(currentUserEmail);
      console.log("✅ Task created:", newTask);
    }
  });
});

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
