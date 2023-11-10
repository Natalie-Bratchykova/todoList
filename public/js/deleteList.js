const buttonsDelete = document.querySelectorAll(".delete");

buttonsDelete.forEach((button) => {
  button.addEventListener("click", (e) => {
    let currBtn = e.target.closest(".delete");
    console.log(currBtn);
    let currListId = currBtn.dataset.list;
    console.log(currListId);
    fetch("/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deleteList: currListId,
      }),
    });

    // reload page
    location.reload();
  });
});
