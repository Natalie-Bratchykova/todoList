const showForm = function (
  buttonSelector,
  formSelector,
  overlaySelector,
  hiddenClass = "--hidden"
) {
  let openBtnS = buttonSelector || "";
  let formS = formSelector || "";
  let overlayS = overlaySelector || "";

  if (openBtnS !== "" && formS !== "" && overlayS !== "") {
    const openBtn = document.querySelector(openBtnS);
    const form = document.querySelector(formS);
    const overlay = document.querySelector(overlayS);

    openBtn.addEventListener("click", function (e) {
      overlay.classList.remove(hiddenClass);
      form.classList.remove(hiddenClass);
    });
  }
};

const hideForm = function (
  buttonSelector,
  formSelector,
  overlaySelector,
  hiddenClass = "--hidden"
) {
  let openBtnS = buttonSelector || "";
  let formS = formSelector || "";
  let overlayS = overlaySelector || "";

  if (openBtnS !== "" && formS !== "" && overlayS !== "") {
    const openBtn = document.querySelector(openBtnS);
    const form = document.querySelector(formS);
    const overlay = document.querySelector(overlayS);

    openBtn.addEventListener("click", function (e) {
      overlay.classList.add(hiddenClass);
      form.classList.add(hiddenClass);
    });
  }
};

showForm(".addItem", ".task__form", ".overlay");

hideForm(".add", ".task__form", ".overlay");
hideForm(".overlay", ".task__form", ".overlay");
hideForm(".overlay", "#editItemForm", ".overlay");