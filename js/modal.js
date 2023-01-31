let modal = document.querySelector(".modal");
let openModalBtn = document.querySelector(".app__btn");
let closeBtn = document.querySelector(".close-btn");
const bodyNode = document.querySelector("body");
let firstModal = document.querySelector("#FirstModal")
let ModalBtn = document.querySelector("#ModalBtn");

if (localStorage['visited'] == 'true') {
    document.addEventListener('DOMContentLoaded', function () {
        showModal(firstModal)
    })
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
