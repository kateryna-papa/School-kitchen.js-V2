let modal = document.querySelector(".modal");
let openModalBtn = document.querySelector(".app__btn");
let closeBtn = document.querySelector(".close-btn");
const bodyNode = document.querySelector("body");
let firstModal = document.querySelector("#FirstModal")
let ModalBtn = document.querySelector("#ModalBtn");



let isDesctopModal = true;
/**Перевірка на тип девайсу */
const isMobileModal = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (
      isMobileModal.Android() ||
      isMobileModal.BlackBerry() ||
      isMobileModal.iOS() ||
      isMobileModal.Opera() ||
      isMobileModal.Windows()
    );
  },
};
if (isMobileModal.any()) {
  isDesctopModal = false;
} else {
  isDesctopModal = true;
}



if (localStorage["visited"] != "true" && isDesctopModal) {
  document.addEventListener("DOMContentLoaded", function () {
    showModal(firstModal);
  });
}
if (!isDesctopModal) {
  closeModal(firstModal);
}

ModalBtn.addEventListener('click', function (e) {
    localStorage.setItem('visited', 'true')
    closeModal(firstModal)
})

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
        bodyNode.classList.remove("hidden");
    }, 280);
}

function showModal(modal) {
    modal.classList.add("show");
    modal.classList.add("blur-show");
    setTimeout(() => {
        modal.classList.remove("blur-show");
        bodyNode.classList.add("hidden");
    }, 280);
}
