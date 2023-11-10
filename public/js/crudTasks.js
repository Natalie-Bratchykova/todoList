const buttonsOpenEditForm = document.querySelectorAll(".openEdit");
const buttonEditTask = document.querySelector("#editTask");
const buttonDeleteTask = document.querySelectorAll(".done");
const pageTitle = document.querySelector("title").textContent;
const form = document.querySelector("#editItemForm");
const editTask = form.querySelector("#task");
const editDeadline = form.querySelector("#deadline");

const overlayLay = document.querySelector(".overlay");

buttonsOpenEditForm.forEach((button) => {
  button.addEventListener("click", function (e) {
    let editTaskId = e.target.dataset.edit;

    let parentListItem = e.target.closest(".task__item");
    let oldTask = parentListItem.querySelector(".task").textContent;
    let oldDeadline = parentListItem.querySelector(".deadline").textContent;

    let editTask = form.querySelector("#task");
    let editDeadline = form.querySelector("#deadline");

    editTask.value = oldTask;

    editDeadline.value = oldDeadline;

    let formAction = form.getAttribute("action");
    form.setAttribute(
      "action",
      `${formAction}?list=${pageTitle}&task=${editTaskId}`
    );

    // open form
    overlayLay.style.height = document.body.scrollHeight + "px";
    overlayLay.classList.remove("--hidden");
    form.classList.remove("--hidden");
  });
});

buttonDeleteTask.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    let deleteTaskId = e.target.dataset.delete;
    fetch(`/delete`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deleteTaskId: deleteTaskId,
        listName: pageTitle,
      }),
    });

    location.reload();
  });
});
