const tasks = [
  { id: 1, title: "خرید میوه برای خانه", done: true, priority: "medium" },
  { id: 2, title: "تماس با مبل فروشی", done: true, priority: "high" },
  { id: 3, title: "جلسه با مرتضی در مورد مصاحبه", done: true, priority: "low" },
];

//Pending Tasks
const pendingEl = document.getElementById("pending-tasks");
const countE1 = document.getElementById("pending-count");

const pendingCount = tasks.filter((t) => !t.done).length;
countE1.textContent = pendingCount;

function renderPendingTasks() {
  pendingEl.innerHTML = "";
  tasks
    .filter((t) => !t.done)
    .forEach((task) => {
      const li = document.createElement("li");
      const colors = { high: "#FF5F37", medium: "#FFAF37", low: "#11A483" };
      const spanColorClass = `bg-[${colors[task.priority]}]`;
      li.className = `relative flex items-center justify-between w-[328px] h-[105px] sm:w-[744px] rounded-xl border py-3 px-4 sm:py-6 sm:px-5 bg-white`;
      li.innerHTML = `
        <span class="absolute right-0 top-0 bottom-0 my-auto h-[76px] sm:h-[78px] w-[4px] ${spanColorClass} rounded-l-lg"></span>
        <div class="flex items-center justify-start sm:flex-1 gap-4">
          <input type="checkbox" class="w-5 h-5" ${task.done ? "checked" : ""}>
          <span class="text-sm font-semibold sm:text-base sm:font-medium">${
            task.title
          }</span>
        </div>
        <img src="./assets/icons/Edit-menu.svg" alt="edit-menu" class="flex items-center justify-end h-[18px]">`;

      const checkbox = li.querySelector('input[type="checkbox"]');
      checkbox.addEventListener("change", () => {
        task.done = true;
        renderPendingTasks();
        renderDoneTasks();
      });

      pendingEl.appendChild(li);
    });
}

//Done Tasks
const doneE1 = document.getElementById("done-tasks");
const countE2 = document.getElementById("done-count");

const doneCount = tasks.filter((t) => t.done).length;
countE2.textContent = doneCount;

function renderDoneTasks() {
  doneE1.innerHTML = "";
  tasks
    .filter((t) => t.done)
    .forEach((task) => {
      const li = document.createElement("li");
      const colors = { high: "#FF5F37", medium: "#FFAF37", low: "#11A483" };
      const spanColorClass = `bg-[${colors[task.priority]}]`;
      li.className = `relative flex items-center justify-between w-[328px] h-[66px] sm:w-[744px] sm:h-[74px] rounded-xl border py-3 px-4 sm:py-6 sm:px-5 bg-white`;
      li.innerHTML = `
        <span class="absolute right-0 top-0 bottom-0 my-auto h-[42px] sm:h-[48px] w-[4px] ${spanColorClass} rounded-l-lg"></span>
        <div class="flex items-center justify-start sm:flex-1 gap-4">
          <input type="checkbox" class="w-5 h-5" ${task.done ? "checked" : ""}>
          <span class="text-sm font-semibold sm:text-base sm:font-medium line-through">${
            task.title
          }</span>
        </div>
        <img src="./assets/icons/Edit-menu.svg" alt="edit-menu" class="flex items-center justify-end h-[18px]">`;

      const checkbox = li.querySelector('input[type="checkbox"]');
      checkbox.addEventListener("change", () => {
        task.done = false;
        renderDoneTasks();
        renderPendingTasks();
      });

      doneE1.appendChild(li);
    });
}

renderPendingTasks();
renderDoneTasks();
