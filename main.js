

document.addEventListener("DOMContentLoaded", function () {
  const initialState = document.getElementById("initialState");
  const initialContent = document.getElementById("initialContent");
  const addTaskModal = document.getElementById("addTaskModal");
  const addTaskButton = initialState.querySelector("button");
  const taskForm = document.getElementById("taskForm");
  const tasksContainer = document.getElementById("tasksContainer");
  const activeTasksList = document.getElementById("activeTasksList");
  const tagBtn = document.getElementById("tagBtn");
  const priorityTags = document.getElementById("priorityTags");
  const lowPriorityBtn = document.getElementById("low");
  const mediumPriorityBtn = document.getElementById("medium");
  const highPriorityBtn = document.getElementById("high");

  let tasks = [];
  let selectedPriority = null;
  let currentlyEditingTask = null; // برای نگهداری تسکی که در حال ویرایش است

  // Initialize UI
  addTaskModal.classList.add("hidden");
  tasksContainer.classList.add("hidden");
  priorityTags.classList.add("hidden");

  // Event for adding new task button
  addTaskButton.addEventListener("click", function () {
      initialState.classList.add("hidden");
      addTaskModal.classList.remove("hidden");
  });

  // Toggle tag visibility
  tagBtn.addEventListener("click", function (e) {
      e.preventDefault();
      priorityTags.classList.toggle("hidden");

      // Toggle tag icons
      const defaultIcon = tagBtn.querySelector(".default-tag-icon");
      const activeIcon = tagBtn.querySelector(".active-tag-icon");
      defaultIcon.classList.toggle("hidden");
      activeIcon.classList.toggle("hidden");
  });

  function displaySelectedTag(priority, modal) {
      const selectedTagContainer = modal.querySelector(".selected-tag-container");
      selectedTagContainer.innerHTML = `
          <div class="flex items-center gap-2 mb-2">
              <button data-priority="${priority}" class="priority-filter flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${getPriorityClass(priority)}">
                  ${getPriorityText(priority)}
                  <img src="./assets/icons/close-circle.png" class="w-4 h-4 cursor-pointer remove-tag-btn" />
              </button>
          </div>
      `;

      const removeTagBtn = selectedTagContainer.querySelector(".remove-tag-btn");
      removeTagBtn.addEventListener("click", (e) => {
          e.preventDefault();
          selectedPriority = null;
          selectedTagContainer.innerHTML = "";
          tagBtn.classList.remove("hidden");
          const defaultIcon = tagBtn.querySelector(".default-tag-icon");
          const activeIcon = tagBtn.querySelector(".active-tag-icon");
          defaultIcon.classList.remove("hidden");
          activeIcon.classList.add("hidden");
          document.querySelectorAll(".priority-filter").forEach((btn) => btn.classList.remove("active"));
      });
  }

  function handlePrioritySelection(priority, modal) {
      selectedPriority = priority;
      priorityTags.classList.add("hidden");
      tagBtn.classList.add("hidden");
      displaySelectedTag(priority, modal);

      // Reset tag icons in tagBtn
      const defaultIcon = tagBtn.querySelector(".default-tag-icon");
      const activeIcon = tagBtn.querySelector(".active-tag-icon");
      defaultIcon.classList.remove("hidden");
      activeIcon.classList.add("hidden");
  }

  lowPriorityBtn.addEventListener("click", function (e) {
      e.preventDefault();
      handlePrioritySelection("low", addTaskModal);
  });
  mediumPriorityBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handlePrioritySelection("medium", addTaskModal);
  });
  highPriorityBtn.addEventListener('click', function(e){
      e.preventDefault();
      handlePrioritySelection("high", addTaskModal);
  });

  // Form submission
  taskForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const title = document.getElementById("taskTitle").value;
      const description = document.getElementById("taskDescription").value;
      const priority = selectedPriority || "medium";

      const newTask = {
          id: Date.now(),
          title,
          description,
          priority,
          completed: false,
      };

      tasks.push(newTask);
      renderTasks();

      // Reset form and UI
      addTaskModal.classList.add("hidden");
      initialState.classList.remove("hidden");
      initialContent.classList.add("hidden");

      //  reset form completely
      taskForm.reset();

      tasksContainer.classList.remove("hidden");

      // Reset tag selection UI
      const selectedTagContainer = document.querySelector(".selected-tag-container");
      if (selectedTagContainer) {
          selectedTagContainer.innerHTML = "";
      }
      tagBtn.classList.remove("hidden");
      document
          .querySelectorAll(".priority-filter")
          .forEach((btn) => btn.classList.remove("active"));
      selectedPriority = null;

      // Reset tag icons in tagBtn
      const defaultIcon = tagBtn.querySelector(".default-tag-icon");
      const activeIcon = tagBtn.querySelector(".active-tag-icon");
      defaultIcon.classList.remove("hidden");
      activeIcon.classList.add("hidden");
  });

  // Render tasks function
  function renderTasks() {
      activeTasksList.innerHTML = "";

      const activeTasks = tasks.filter((task) => !task.completed);

      activeTasks.forEach((task) => {
          const taskElement = createTaskElement(task);
          activeTasksList.appendChild(taskElement);
      });

      updateTaskCounts();

      // بستن فرم ویرایش در صورت وجود
      const editForm = document.querySelector(".edit-task-form");
      if (editForm) {
          editForm.remove();
      }
  }

  function createTaskElement(task) {
      const taskElement = document.createElement("div");
      taskElement.className =
          "flex items-center justify-between p-4 border rounded-lg mb-3 bg-white relative";
      taskElement.dataset.id = task.id;

      let priorityTagClass, priorityTagText;
      switch (task.priority) {
          case "high":
              priorityTagClass = "bg-[#FFE2DB] text-[#FF5F37]";
              priorityTagText = "بالا";
              break;
          case "medium":
              priorityTagClass = "bg-[#FFEFD6] text-[#FFAF37]";
              priorityTagText = "متوسط";
              break;
          case "low":
              priorityTagClass = "bg-[#C3FFF1] text-[#11A483]";
              priorityTagText = "پایین";
              break;
          default:
              priorityTagClass = "bg-[#E0E0E0] text-[#757575]";
              priorityTagText = "متوسط";
              break;
      }

      taskElement.innerHTML = `
          <div class="flex flex-col items-start justify-center gap-3 w-full">

              <div class="flex items-start justify-start gap-2">
                  <input type="checkbox" class="w-5 h-5 rounded border-gray-300" ${task.completed ? "checked" : ""}>
                  <h3 class="font-bold ${task.completed ? "line-through text-gray-400" : "text-gray-800"}">
                      ${task.title}
                  </h3>
                  <span class="text-xs px-2 py-1 rounded-lg ${priorityTagClass}">
                      ${priorityTagText}
                  </span>
              </div>
              <p class="text-sm ${task.completed ? "text-gray-400" : "text-gray-500"}">
                  ${task.description}
              </p>
          </div>


              <div class="task-actions relative">
                  <img src="./assets/icons/Frame 33317.png" alt="actions" class="cursor-pointer">
                  <div class="hidden flex flex-row absolute top-[25px] left-[-50px] bg-white shadow rounded-md p-2  gap-2 z-10">
                      <img src="./assets/icons/tabler_edit.png" alt="edit" class="cursor-pointer w-5 h-5 edit-task-icon">
                      <img src="./assets/icons/Vector.png" alt="delete" class="cursor-pointer w-5 h-5 delete-task-icon">
                  </div>
              </div>

      `;

      const checkbox = taskElement.querySelector('input[type="checkbox"]');
      checkbox.addEventListener("change", function () {
          const taskId = parseInt(taskElement.dataset.id);
          const taskIndex = tasks.findIndex((t) => t.id === taskId);

          if (taskIndex !== -1) {
              tasks[taskIndex].completed = this.checked;
              renderTasks();
          }
      });

      const actionsButton = taskElement.querySelector(".task-actions > img");
      const actionsDiv = taskElement.querySelector(".task-actions > div");

      actionsButton.addEventListener("click", () => {
          actionsDiv.classList.toggle("hidden");
      });

      const editButton = taskElement.querySelector(".edit-task-icon");
      editButton.addEventListener("click", () => {
          const taskId = parseInt(taskElement.dataset.id);
          const taskToEdit = tasks.find((task) => task.id === taskId);
          if (taskToEdit) {
              showEditForm(taskToEdit);
          }
          actionsDiv.classList.add("hidden");
      });

      const deleteButton = taskElement.querySelector(".delete-task-icon");
      deleteButton.addEventListener("click", () => {
          const taskId = parseInt(taskElement.dataset.id);
          deleteTask(taskId);
      });

      return taskElement;
  }


function showEditForm(task) {
  const editForm = document.createElement("form");
  editForm.className =
      "edit-task-form flex flex-col gap-3 mt-4 p-4 border rounded-md bg-gray-100";
  editForm.innerHTML = `
      <input type="text" id="editTaskTitle" placeholder="نام تسک" class="w-full px-3 py-2 rounded-md font-bold" required value="${task.title}">
      <input type="text" id="editTaskDescription" placeholder="توضیحات" class="w-full px-3 py-2 rounded-md" value="${task.description}">
      <div class="flex w-fit gap-2 border p-2 rounded-lg text-sm font-medium text-[#AFAEB2] mb-1 cursor-pointer edit-tag-button">
          <img src="./assets/icons/tag-right.png" alt="tags" class="default-tag-icon ${task.priority ? "hidden" : ""}">
          <img src="./assets/icons/tag-right(1).png" alt="tags" class="active-tag-icon ${task.priority ? "" : "hidden"}">
          تگ ها
      </div>
      <div id="editPriorityTags" class="hidden gap-6 mb-0 border w-fit p-2 shadow-none">
          <button data-priority="low" class="priority-filter px-3 py-1 rounded-lg bg-[#C3FFF1] text-[#11A483] text-sm font-medium hover:bg-green-200 ${task.priority === "low" ? "active" : ""}">پایین</button>
          <button data-priority="medium" class="priority-filter px-3 py-1 rounded-lg bg-[#FFEFD6] text-[#FFAF37] text-sm font-medium hover:bg-yellow-100 ${task.priority === "medium" ? "active" : ""}">متوسط</button>
          <button data-priority="high" class="priority-filter px-3 py-1 rounded-lg bg-[#FFE2DB] text-[#FF5F37] text-sm font-medium hover:bg-red-200 ${task.priority === "high" ? "active" : ""}">بالا</button>
      </div>
      <div class="selected-tag-container">
          ${task.priority ? `
              <div class="flex items-center gap-2 mb-2">
                  <button data-priority="${task.priority}" class="priority-filter flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getPriorityClass(task.priority)}">
                      ${getPriorityText(task.priority)}
                      <img src="./assets/icons/close-circle.png" class="w-4 h-4 cursor-pointer remove-edit-tag-btn" />
                  </button>
              </div>
          ` : ""}
      </div>
      <div class="w-full flex justify-end gap-2 border-t-[1px] pt-2">
          <button type="button" class="px-4 py-2 mt-0 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 cancel-edit-btn">لغو</button>
          <button type="submit" class="px-4 py-2 mt-0 bg-[#007BFF] text-white rounded-lg hover:bg-blue-400">ذخیره تغییرات</button>
      </div>
  `;

  const taskElement = activeTasksList.querySelector(`[data-id="${task.id}"]`);
  if (taskElement) {
      taskElement.insertAdjacentElement("afterend", editForm);

      const editPriorityTags = editForm.querySelector("#editPriorityTags");
      const editTagBtn = editForm.querySelector(".edit-tag-button");
      const editPriorityButtons = editPriorityTags.querySelectorAll(".priority-filter");
      const selectedEditTagContainer = editForm.querySelector(".selected-tag-container");
      const cancelEditBtn = editForm.querySelector(".cancel-edit-btn");
      const editFormElement = editForm;

      editTagBtn.addEventListener("click", (e) => {
          e.preventDefault();
          editPriorityTags.classList.toggle("hidden");
          editTagBtn
              .querySelector(".default-tag-icon")
              .classList.toggle("hidden");
          editTagBtn.querySelector(".active-tag-icon").classList.toggle("hidden");
      });

      function displayEditSelectedTag(priority) {
          selectedEditTagContainer.innerHTML = `
              <div class="flex items-center gap-2 mb-2">
                  <button data-priority="${priority}" class="priority-filter flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium ${getPriorityClass(priority)}">
                      ${getPriorityText(priority)}
                      <img src="./assets/icons/close-circle.png" class="w-4 h-4 cursor-pointer remove-edit-tag-btn" />
                  </button>
              </div>
          `;

          const removeEditTagBtn = selectedEditTagContainer.querySelector(".remove-edit-tag-btn");
          removeEditTagBtn.addEventListener("click", (e) => {
              e.preventDefault();
              selectedPriority = null;
              selectedEditTagContainer.innerHTML = "";
              editTagBtn.classList.remove("hidden");
              const defaultIcon = editTagBtn.querySelector(".default-tag-icon");
              const activeIcon = editTagBtn.querySelector(".active-tag-icon");
              defaultIcon.classList.remove("hidden");
              activeIcon.classList.add("hidden");
              editPriorityButtons.forEach((b) => b.classList.remove("active"));
          });
      }

      editPriorityButtons.forEach((btn) => {
          btn.addEventListener("click", function (e) {
              e.preventDefault();
              editPriorityButtons.forEach((b) => b.classList.remove("active"));
              this.classList.add("active");
              selectedPriority = this.dataset.priority;
              displayEditSelectedTag(this.dataset.priority);
              editPriorityTags.classList.add("hidden");
              editTagBtn
                  .querySelector(".default-tag-icon")
                  .classList.remove("hidden");
              editTagBtn.querySelector(".active-tag-icon").classList.add("hidden");
          });
      });

      cancelEditBtn.addEventListener("click", (e) => {
          e.preventDefault();
          editFormElement.remove();
          currentlyEditingTask = null;
      });

      editFormElement.addEventListener("submit", (e) => {
          e.preventDefault();
          const editTitle = document.getElementById("editTaskTitle").value;
          const editDescription = document.getElementById("editTaskDescription").value;
          const priority = selectedPriority || task.priority || "medium";

          const index = tasks.findIndex((t) => t.id === task.id);
          if (index !== -1) {
              tasks[index].title = editTitle;
              tasks[index].description = editDescription;
              tasks[index].priority = priority;
          }
          renderTasks();
          currentlyEditingTask = null;
      });

      // نمایش تگ انتخاب شده‌ی اولیه در فرم ویرایش
      if (task.priority) {
          editTagBtn.classList.add("hidden");
          displayEditSelectedTag(task.priority);
          // فعال کردن دکمه‌ی مربوط به اولویت در لیست تگ‌ها
          editPriorityButtons.forEach(button => {
              if (button.dataset.priority === task.priority) {
                  button.classList.add("active");
              } else {
                  button.classList.remove("active");
              }
          });
      } else {
          editTagBtn.classList.remove("hidden");
      }
  }
}

  function deleteTask(taskId) {
      tasks = tasks.filter((task) => task.id !== taskId);
      renderTasks();
  }

  function updateTaskCounts() {
      const activeCount = tasks.filter((task) => !task.completed).length;
      const countText =
          activeCount === 0
              ? "هیچ تسکی برای انجام ندارید"
              : `${activeCount} تسک را باید انجام دهید.`;

      document.getElementById("activeTasksCountText").textContent = countText;
  }

  function getPriorityClass(priority) {
      switch (priority) {
          case "high":
              return "bg-[#FFE2DB] text-[#FF5F37]";
          case "medium":
              return "bg-[#FFEFD6] text-[#FFAF37]";
          case "low":
              return "bg-[#C3FFF1] text-[#11A483]";
          default:
              return "bg-[#E0E0E0] text-[#757575]";
      }
  }

  function getPriorityText(priority) {
      switch (priority) {
          case "high":
              return "بالا";
          case "medium":
              return "متوسط";
          case "low":
              return "پایین";
          default:
              return "متوسط";
      }
  }
});