const orersList = document.querySelector(".panel__order-list");
const reRenderOrders = document.querySelector(".panel__orders-render");
const loader = document.querySelector(".loader-box");
const loaderMenu = document.querySelector(".loader-box-menu");
const modalBbtn = document.querySelector(".app__btn-panel");
const modal = document.querySelector("#Modal-menu");
let closeBtn = document.querySelector(".close-btn");
const panelList = document.querySelector(".panel__menu-list");
const selectFilter = document.querySelector(".panel__select");
const bodyNode = document.querySelector("body");
const errorNode = document.querySelector(".error-block");

let data = null;
let selectValue = "break";

selectFilter.addEventListener("change", function () {
  selectValue = this.value;
  fetchOrders();
});

reRenderOrders.addEventListener("click", fetchOrders);

async function fetchOrders() {
  orersList.innerHTML = "";
  loader.classList.add("show");
  await fetch(
    "https://school-kitchen-f48e9-default-rtdb.firebaseio.com/orders.json"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data = transformFbDataToArr(data);
      if (selectValue == "break" && data) {
        data.sort((a, b) => (a.breakNum > b.breakNum ? 1 : -1));
      } else if (selectValue == "date" && data) {
        data.sort((a, b) => (a.date < b.date ? 1 : -1));
      }
      loader.classList.remove("show");
      renderOrders(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
fetchOrders();

async function fetchMenu() {
  panelList.innerHTML = "";
  loaderMenu.classList.add("show");
  await fetch(
    "https://school-kitchen-f48e9-default-rtdb.firebaseio.com/menu.json"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data = transformFbDataToArr(data);
      loaderMenu.classList.remove("show");
      renderMenuItems(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
fetchMenu();

modalBbtn.addEventListener("click", () => {
  showModal(modal);
});
modal.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.classList.contains("modal__inner")) {
    closeModal(modal);
  } else if (event.target === closeBtn) {
    closeModal(modal);
  }
});

function renderOrders(ordersArr) {
  if (ordersArr) {
    let ordersHtml = ordersArr
      ?.map((order) => {
        let orderPrice = 0;
        let progresClass = null;
        let btnText = null;
        let deadline = new Date(order.deadline);
        let deadlineStr =
          deadline.toLocaleDateString() +
          " " +
          deadline.getHours() +
          ":" +
          deadline.getMinutes();
        if (localStorage.getItem(order.id) == "true") {
          progresClass = "done";
          btnText = "Виконано";
        } else {
          progresClass = "";
          btnText = "Не виконано";
        }
        let orderFood = order.list
          ?.map((food) => {
            orderPrice += food.count * +food.price;
            return `
           <li class="panel__orders-food">${food.name + " x" + food.count}</li>
          `;
          })
          .join(" ");
        return `
            <li class="panel__order-item panel__order-item-dark">
                <div class="panel__order-item-box">
                  <div class="panel__order-timeout">Перерва: ${
                    order.breakNum
                  }</div>
                  <div class="panel__order-timeout panel__order-date">Дата: ${
                    order.date
                  }</div>
                  <div class="panel__order-top">
                    <p class="panel__order-info">${
                      order.name +
                      " " +
                      order.surname +
                      " Клас - " +
                      order.classNum
                    }</p>
                    <button data-id='${
                      order.id
                    }' class="panel__order-marker__btn ${progresClass}">
                      ${btnText}
                    </button>
                  </div>
                  <ol class="panel__orders-list__items">
                    ${orderFood}
                  </ol>
                  <p class="panel__order-fullprice">
                    Загальна сумма замовлення: ${orderPrice} UAH
                  </p>
                  <p class="panel__order-deadline">
                    Дедлайн -  ${deadlineStr}
                  </p>
                </div>
            </li>
        `;
      })
      .join(" ");

    orersList.innerHTML = ordersHtml;

    let doneBtns = document.querySelectorAll(".panel__order-marker__btn");
    doneBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (e.target.classList.contains("done")) {
          e.target.classList.remove("done");
          e.target.textContent = "Не виконано";
          localStorage.setItem(e.target.dataset.id, "false");
        } else {
          e.target.classList.add("done");
          e.target.textContent = "Виконано";
          localStorage.setItem(e.target.dataset.id, "true");
        }
      });
    });
  } else {
    orersList.innerHTML = `<p class="no-orders no-orders-dark">Замовлень немає</p>`;
  }
}

function transformFbDataToArr(fbData) {
  if (fbData) {
    return Object.keys(fbData).map((key) => {
      const item = fbData[key];
      item.id = key;
      return item;
    });
  } else {
    return;
  }
}

const form = document.querySelector(".form");
const formButton = document.querySelector(".form__btn");

formButton.addEventListener("click", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name-food");
  const price = formData.get("price");
  const image = formData.get("image");

  const nameVal = document.querySelector(".input__name");
  const priceVal = document.querySelector(".input__price");
  const imageVal = document.querySelector(".image__select");

  if (!nameVal.value) {
    errorNode.innerHTML = "Введіть ціну";
    nameVal.classList.add("invalid");
    form.classList.add("animate__headShake");
    setTimeout(() => {
      form.classList.remove("animate__headShake");
    }, 1000);
  } else if (!priceVal.value) {
    errorNode.innerHTML = "Введіть ціну";
    nameVal.classList.remove("invalid");
    priceVal.classList.add("invalid");
    form.classList.add("animate__headShake");
    setTimeout(() => {
      form.classList.remove("animate__headShake");
    }, 1000);
  } else if (!imageVal.value) {
    errorNode.innerHTML = "Виберіть картинку";
    priceVal.classList.remove("invalid");
    imageVal.classList.add("invalid");
    form.classList.add("animate__headShake");
    setTimeout(() => {
      form.classList.remove("animate__headShake");
    }, 1000);
  } else {
    errorNode.innerHTML = "";
    nameVal.classList.remove("invalid");
    priceVal.classList.remove("invalid");
    imageVal.classList.remove("invalid");
    const menu = {
      name: name,
      price: price,
      image: image,
    };
    closeModal(modal);
    sendMunuToFfirebase(menu);
  }

  /*Відправка меню в базу даних*/
});

function sendMunuToFfirebase(obj) {
  class ApiService {
    constructor(baseUrl) {
      this.url = baseUrl;
    }

    async createMenu(obj) {
      try {
        const request = new Request(this.url + "/menu.json", {
          method: "POST",
          body: JSON.stringify(obj),
        });
        const response = await fetch(request);
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const apiService = new ApiService(
    "https://school-kitchen-f48e9-default-rtdb.firebaseio.com"
  );
  apiService.createMenu(obj);
  let menuArray = transformFbDataToArr(obj);
  renderMenuItems(menuArray);
  fetchMenu();
}

function renderMenuItems(menuArr) {
  let menuHtml = menuArr.map((item) => {
    return `
           <li class="panel__menu__item">
                <div class="panel__menu__item-box">
                  <p class="panel__menu__item-name">${item.name}</p>
                  <p class="panel__menu__item-price">Ціна: ${item.price} UAH</p>
                </div>
              </li>
          `;
  });
  menuHtml = menuHtml.join(" ");
  panelList.innerHTML = menuHtml;
}

function closeModal(modal) {
  modal.classList.add("blur-hide");
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
