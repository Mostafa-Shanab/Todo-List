"use strict";

class Task {
  constructor(title, type, priorities = []) {
    this.title = title;
    this.type = type; // section type: todo, in-progress, done, etc.
    this.completed = false;
    this.priorities = priorities;
    this.date = new Date().toLocaleDateString("en-US", { weekday: "long" });
    this.person = document.querySelector("header img").getAttribute("src");
  }

  // method to render task as HTML element
  render() {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    if (this.type == "done") {
      taskDiv.innerHTML = `
      <div class="title">
        <i class="fa-solid fa-circle-check opacity-5"></i>
        <h3>${this.title}</h3>
      </div>
      <div class="priorities">
        ${this.priorities
          .map((p) => `<span class="priority">${p}</span>`)
          .join("")}
      </div>
      <div class="person">
        <img src="${this.person}" alt="User Image" />
        <span class="opacity-5 date">${this.date}</span>
      </div>
    `;
      return taskDiv;
    }
    taskDiv.innerHTML = `
      <div class="title">
        <i class="fa-regular fa-circle-check opacity-5"></i>
        <h3>${this.title}</h3>
      </div>
      <div class="priorities">
        ${this.priorities
          .map((p) => `<span class="priority">${p}</span>`)
          .join("")}
      </div>
      <div class="person">
        <img src="${this.person}" alt="User Image" />
        <span class="opacity-5 date">${this.date}</span>
      </div>
    `;

    return taskDiv;
  }
}

const sections = document.querySelectorAll("section");

sections.forEach((section) => {
  section.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const title = prompt("Enter task title:");
      const priorities = prompt("Enter Priorities:");
      if (!title) return;

      // get section type from class (todo, in-progress, etc.)
      const type = section.classList[0];

      const newTask = new Task(title, type, priorities.split(" "));

      // render & append task to this section
      const tasksContainer = section.querySelector(".tasks");
      tasksContainer.insertBefore(newTask.render(), e.target);

      console.log("✅ Task created:", newTask);
    }
  });
});
