let modal = document.querySelector(".modal");
let openModalBtn = document.querySelector(".app__btn");
let closeBtn = document.querySelector(".close-btn");

openModalBtn.addEventListener("click", () => {
  showModal(modal);
});

closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
});

modal.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("modal__inner")) {
    closeModal(modal);
  } else if (event.target === closeBtn) {
    closeModal(modal);
  }
});

function closeModal(modal) {
  modal.classList.add('blur-hide')
  setTimeout(() => {
    modal.classList.remove("show");
    modal.classList.remove("blur-hide");
  }, 280);
}

function showModal(modal) {
  modal.classList.add("show");
  modal.classList.add("blur-show");
  setTimeout(() => {
    modal.classList.remove("blur-show");
  }, 280);
}
