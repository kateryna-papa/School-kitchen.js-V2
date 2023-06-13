const trayBox = document.querySelector(".app__tray-box");
const trayInner = document.querySelector(".app__tray");
const foodsList = document.querySelector(".app__food-inner");
const totalPriceNode = document.querySelector(".app__price__number-num");
const notificationInner = document.querySelector(".notification__inner");
const formList = document.querySelector(".form__list-items");
const totalPriceForm = document.querySelector(".total__price_form");
const form = document.querySelector(".form");
const formButton = document.querySelector(".form__btn");
const deleteBtn = document.querySelector(".app__tray-prev");
const formModal = document.getElementById("Modal");
const doneModal = document.getElementById("Modal-done");
const modalOrders = document.querySelector(".modal-orders");
const closeModalOrdersBtn = document.querySelector(".close__orders-btn");
const openModalOrdersBtn = document.querySelector(".app__orders-list-btn");
const modalOrdersList = document.querySelector(".modal__orders-list");
const body = document.querySelector("body");
const sendModal = document.querySelector("#Modal-send_order");
const sendBtn = document.querySelector(".modal-send");
const noSendBtn = document.querySelector(".modal-no-send");
const modalSendDateNode = document.querySelector(".modal-send-date");
const loaderMenu = document.querySelector(".loader-menu");

let ErrorMessage = document.querySelector(".error-message");

let trayArr = [];
let personalOrders = [];

let isDesctop = true;

/**Перевірка на тип девайсу */
const isMobile = {
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
      isMobile.Android() ||
      isMobile.BlackBerry() ||
      isMobile.iOS() ||
      isMobile.Opera() ||
      isMobile.Windows()
    );
  },
};
if (isMobile.any()) {
  isDesctop = false;
} else {
  isDesctop = true;
}



if (localStorage.getItem("modalOrders")) {
  personalOrders = JSON.parse(localStorage.getItem("modalOrders"));
  renderModalOrders(personalOrders);
}

if (personalOrders.length > 0) {
  setInterval(() => {
    openModalOrdersBtn.classList.add("animate__swing");
    setTimeout(() => {
      openModalOrdersBtn.classList.remove("animate__swing");
    }, 1000);
  }, 3000);
}

/*Якась важлива штука, без якої не працює драг */
trayBox.addEventListener("dragover", function (event) {
  event.preventDefault();
});

/*Додавання товару до массиву подноса */
function addFoodToTray(dragEl) {
  let id = dragEl.getAttribute("data-id");
  let name = dragEl.querySelector(".app__food-name").textContent;
  let price = dragEl.querySelector(".app__food-price-num").textContent;
  let imgUrl = dragEl.querySelector(".app__food-img").getAttribute("src");
  let newFood = {
    id: id,
    name: name,
    price: price,
    imgUrl: imgUrl,
    count: 1,
  };

  if (trayArr.length == 0) {
    trayArr.push(newFood);
    return;
  }

  let flag = false;

  trayArr.forEach((obj) => {
    if (obj.id == newFood.id) {
      obj.count += 1;
      flag = true;
    }
  });

  if (flag == false) {
    trayArr.push(newFood);
  }
}

deleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  deleteLastFood(trayArr);
});

/*Логіка додавання в корзину */
function addToTray(e) {
  const dragEl = document.querySelector(".drag");
  trayBox.classList.add("pulse");
  setTimeout(() => {
    trayBox.classList.remove("pulse");
  }, 400);
  ErrorMessage.innerHTML = "";
  addFoodToTray(dragEl);
  calcPrice(trayArr);
  renderFoodsInTray(trayArr);
  renderFoodsList(trayArr);
  createNotification(dragEl);
}

function createDeleteNotification(obj) {
  let notification = `
          <li class="notification__item notification-remove">
          <span class="notification__text"> Страву </span>
          <span class="notification__name">${obj.name}</span>
          <span class="notification__text"> було видалено з замовлення </span>
        </li>
  `;
  notificationInner.innerHTML += notification;

  setTimeout(() => {
    notificationInner.lastElementChild.classList.add("blur-hide");
    setTimeout(() => {
      notificationInner.removeChild(notificationInner.lastElementChild);
    }, 280);
  }, 2600);
}

function createNotification(dragEl) {
  let name = dragEl.querySelector(".app__food-name").textContent;
  let notification = `
          <li class="notification__item notification-add">
          <span class="notification__text"> Страву </span>
          <span class="notification__name">${name}</span>
          <span class="notification__text"> було додано до замовлення </span>
        </li>
  `;
  notificationInner.innerHTML += notification;
  let notifications;
  setTimeout(() => {
    notificationInner.lastElementChild.classList.add("blur-hide");
    setTimeout(() => {
      notificationInner.removeChild(notificationInner.lastElementChild);
    }, 280);
  }, 2600);
}

/*Функція рендеру товарів з массиву доданих товарів в корзину */
function renderFoodsInTray(arr) {
  let foodsHtml = arr.map((item) => {
    return `
        <div>
          <div class="app__tray-item-box">
            <img src="${item.imgUrl}" alt="food" class="app__food-img" />
            <span class="app__tray-count">${"x " + item.count}</span>
          </div>
        </div>
    `;
  });
  foodsHtml = foodsHtml.join(" ");
  trayInner.innerHTML = foodsHtml;
}

/**Функція підрахунку вартості */
function calcPrice(arr) {
  let totalPrice = 0;
  arr.forEach((item) => {
    totalPrice += +item.price * item.count;
  });
  totalPriceNode.innerHTML = totalPrice;
  totalPriceForm.innerHTML = totalPrice;
}

function transformFbDataToArr(fbData) {
  if (fbData) {
    return Object.keys(fbData).map((key) => {
      const item = fbData[key];
      item.id = key;
      return item;
    });
  } else{
    return
  }

}

fetchMenu();

async function fetchMenu() {
  foodsList.innerHTML = "";
  loaderMenu.classList.add('show');
  await fetch(
      "https://school-kitchen-f48e9-default-rtdb.firebaseio.com/menu.json"
  )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        data = transformFbDataToArr(data);
        renderFoodsItems(data);
        loaderMenu.classList.remove("show");
      })
      .catch((error)=>{
        console.log(error);
      });
}

/*Функція рендеру товарів */
function renderFoodsItems(arr) {
  if(arr){
  let foodsHtml = arr?.map((item) => {
    return `
    <li data-id="${item.id}" draggable="true" class="app__food-item">
      <img src="${item.image}" alt="food" class="app__food-img" />
      <h3 class="app__food-name">${item.name}</h3>
      <p class="app__food-price"><span class="app__food-price-num">${item.price}</span> <span>UAH</span></p>
       <div class="app__food-mobile__add-box">
        <div class="app__food-mobile__add">
          <button class="app__food-mobile__add-btn">Додати</button>
        </div>
       </div>
      </li>
    `;
  });
  foodsHtml = foodsHtml.join(" ");
  foodsList.innerHTML = foodsHtml;
  }
  let foods = document.querySelectorAll(".app__food-item");
  let foodBtnsModal = document.querySelectorAll(".app__food-mobile__add-box");
  let addBtns = document.querySelectorAll(".app__food-mobile__add-btn");

  foods.forEach((food, i) => {
    /*Додаєм клас елементу, якого перетягуєм, для його ідентифікації*/

    /**Додаваня в корзину драгНдроп*/
    if (isDesctop) {
      food.addEventListener("dragstart", () => {
        food.classList.add("drag");
      });
      /*Забираєм клас елементу, якого перетягуєм*/
      food.addEventListener("dragend", () => {
        food.classList.remove("drag");
      });
    }

    /**Додаваня в корзину по кліку на кнопку */
    if (!isDesctop) {
      food.addEventListener("click", () => {
        if (foodBtnsModal[i].classList.contains("show")) {
          closeModalBtns();
        } else if (foodBtnsModal[i].classList.contains("show-add")) {
          foodBtnsModal[i].classList.remove("show-add");
        } else {
          showModalBtn(i);
        }
      });
    }
  });

  trayBox.addEventListener("drop", addToTray);

  addBtns.forEach((item, i) => {
    item.addEventListener("click", () => {
      foods[i].classList.add("drag");
      addToTray();
      foods[i].classList.remove("drag");
      foodBtnsModal[i].classList.remove("show");
      foodBtnsModal[i].classList.add("show-add");
    });
  });

  function showModalBtn(i) {
    closeModalBtns();
    foodBtnsModal[i].classList.add("show");
  }

  function closeModalBtns() {
    foodBtnsModal.forEach((item) => {
      item.classList.remove("show");
    });
  }
}

/*Функція виводу товару в список в формі */
function renderFoodsList(arr) {
  const formText = document.querySelector(".form__list-text");
  if (trayArr.length == 0) {
    formText.style.display = "block";
    formList.innerHTML = "";
  } else {
    formText.style.display = "none";
    let foodsHtml = arr.map((item) => {
      return `
      <li data-id="${item.id}">
        <div class="price">
           <span>${item.name + ` x` + item.count}</span> 
          <div>
            <span>${item.price * item.count}</span> <span>UAH</span>
          </div>
        </div>
      </li>
    `;
    });
    foodsHtml = foodsHtml.join(" ");
    formList.innerHTML = foodsHtml;
  }
}

/*Ввидалення страви */
function deleteLastFood(trayArr) {
  if (trayArr.length > 0) {
    if (trayArr[trayArr.length - 1].count > 1) {
      createDeleteNotification(trayArr[trayArr.length - 1]);
      trayArr[trayArr.length - 1].count = trayArr[trayArr.length - 1].count - 1;
    } else {
      createDeleteNotification(trayArr[trayArr.length - 1]);
      trayArr.pop();
    }
    calcPrice(trayArr);
    renderFoodsInTray(trayArr);
    renderFoodsList(trayArr);
  }
}

/*Функція створення об’єкту, який збирає дані з форми*/
formButton.addEventListener("click", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const surname = formData.get("surname");
  const name = formData.get("name");
  const classNum = formData.get("classNum");
  const breakNum = formData.get("breakNum");

  /*Валідація форми*/
  const inputSurname = document.querySelector(".input__surname");
  const inputName = document.querySelector(".input__name");
  const selectClassNum = document.querySelector(".class__select");
  const selectBreakNum = document.querySelector(".break__select");

  if (trayArr.length == 0) {
    ErrorMessage.innerHTML = "Додайте хочаб 1 страву";
    form.classList.add("animate__headShake");
    setTimeout(() => {
      form.classList.remove("animate__headShake");
    }, 1000);
  } else if (!inputSurname.value) {
    ErrorMessage.innerHTML = "Введіть Ваше Прізвище";
    inputSurname.classList.add("invalid");
    form.classList.add("animate__headShake");
    setTimeout(() => {
      form.classList.remove("animate__headShake");
    }, 1000);
  } else if (!inputName.value) {
    ErrorMessage.innerHTML = "Введіть Ваше Ім'я";
    inputSurname.classList.remove("invalid");
    inputName.classList.add("invalid");
    form.classList.add("animate__headShake");
    setTimeout(() => {
      form.classList.remove("animate__headShake");
    }, 1000);
  } else if (!selectClassNum.value) {
    ErrorMessage.innerHTML = "Виберіть ваш клас";
    inputName.classList.remove("invalid");
    selectClassNum.classList.add("invalid");
    form.classList.add("animate__headShake");
    setTimeout(() => {
      form.classList.remove("animate__headShake");
    }, 1000);
  } else if (!selectBreakNum.value) {
    ErrorMessage.innerHTML = "Виберіть номер перерви";
    selectBreakNum.classList.add("invalid");
    selectClassNum.classList.remove("invalid");
    form.classList.add("animate__headShake");
    setTimeout(() => {
      form.classList.remove("animate__headShake");
    }, 1000);
  } else {
    ErrorMessage.innerHTML = "";
    selectBreakNum.classList.remove("invalid");
    inputName.classList.remove("invalid");
    selectClassNum.classList.remove("invalid");
    inputSurname.classList.remove("invalid");

    /*Створення та перевірка дати виконання замовлення */
    let date = new Date(); 
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let nowHours = date.getHours();
    let nowMinuts = date.getMinutes();
    let minuts =
      selectBreakNum.options[selectBreakNum.selectedIndex].dataset.minuts;
    let hours =
      selectBreakNum.options[selectBreakNum.selectedIndex].dataset.hours;

    /*Перевірки на актуальність перерви */
    if (date.getDay() == 0) {
      day++;
      showModal(sendModal);
      var deadline = new Date(year, month, day, hours, minuts, 0);
      modalSendDateNode.innerHTML =
        deadline.toLocaleDateString() + " " + hours.trim() + ":" + minuts;
      sendBtn.addEventListener("click", () => {
        const order = {
          surname: surname,
          name: name,
          classNum: classNum,
          breakNum: breakNum,
          list: trayArr,
          date: new Date().toLocaleString(),
          deadline: deadline,
        };

        sendOrdersToFireBase(order);
      });

      noSendBtn.addEventListener("click", () => {
        closeModal(sendModal);
        closeModal(formModal);
        form.reset();
        trayArr = [];
        trayInner.innerHTML = "";
        renderFoodsList(trayArr);
        calcPrice(trayArr);
      });
    } else if (date.getDay() == 6) {
      day = day + 2;
      showModal(sendModal);
      var deadline = new Date(year, month, day, hours, minuts, 0);
      modalSendDateNode.innerHTML =
        deadline.toLocaleDateString() + " " + hours.trim() + ":" + minuts;
      sendBtn.addEventListener("click", () => {
        const order = {
          surname: surname,
          name: name,
          classNum: classNum,
          breakNum: breakNum,
          list: trayArr,
          date: new Date().toLocaleString(),
          deadline: deadline,
        };

        sendOrdersToFireBase(order);
      });

      noSendBtn.addEventListener("click", () => {
        closeModal(sendModal);
        closeModal(formModal);
        form.reset();
        trayArr = [];
        trayInner.innerHTML = "";
        renderFoodsList(trayArr);
        calcPrice(trayArr);
      });
    }else if (hours <= nowHours && nowMinuts > minuts) {
      day++;
      showModal(sendModal);
      var deadline = new Date(year, month, day, hours, minuts, 0);
      modalSendDateNode.innerHTML =
        deadline.toLocaleDateString() + " " + hours.trim() + ":" + minuts;
      sendBtn.addEventListener("click", () => {
        const order = {
          surname: surname,
          name: name,
          classNum: classNum,
          breakNum: breakNum,
          list: trayArr,
          date: new Date().toLocaleString(),
          deadline: deadline,
        };

        sendOrdersToFireBase(order);
      });

      noSendBtn.addEventListener("click", () => {
        closeModal(sendModal);
        closeModal(formModal);
        form.reset();
        trayArr = [];
        trayInner.innerHTML = "";
        renderFoodsList(trayArr);
        calcPrice(trayArr);
      });
    } else {
      var deadline = new Date(year, month, day, hours, minuts, 0);
      const order = {
        surname: surname,
        name: name,
        classNum: classNum,
        breakNum: breakNum,
        list: trayArr,
        date: new Date().toLocaleString(),
        deadline: deadline,
      };

      sendOrdersToFireBase(order);
    }
  }
});

function sendOrdersToFireBase(obj) {
  class ApiService {
    constructor(baseUrl) {
      this.url = baseUrl;
    }

    async createOrder(obj) {
      try {
        const request = new Request(this.url + "/orders.json", {
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

  apiService.createOrder(obj);

  personalOrders.push(obj);
  renderModalOrders(personalOrders);
  localStorage.setItem("modalOrders", JSON.stringify(personalOrders));

  closeModal(formModal);
  closeModal(sendModal);
  showModal(doneModal);
  setTimeout(() => {
    closeModal(doneModal);
  }, 1500);
  form.reset();
  trayArr = [];
  trayInner.innerHTML = "";
  renderFoodsList(trayArr);
  calcPrice(trayArr);
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

openModalOrdersBtn.addEventListener("click", () => {
  modalOrders.classList.add("open");
  body.classList.add("hidden");
});
closeModalOrdersBtn.addEventListener("click", () => {
  modalOrders.classList.remove("open");
  body.classList.remove("hidden");
});

setInterval(() => {
  renderModalOrders(personalOrders);
}, 1000);

/*Рендер замовлень з таймером на сторінці користувача */
function renderModalOrders(ordersArr) {
  if (ordersArr.length > 0) {
    let ordersHtml = ordersArr
      .map((order) => {
        let orderPrice = 0;
        let message;
        let allMilliseconds =
          Date.parse(order.deadline) - Date.parse(new Date());
        let hours, minuts, seconds;
        if (allMilliseconds <= 0) {
          hours = 0;
          minuts = 0;
          seconds = 0;
          message = `<div class="order-done">Замовлення готове! Смачного:)</div>`;
        } else {
          (hours = Math.floor(allMilliseconds / (60 * 60 * 1000))),
            (minuts = Math.floor((allMilliseconds / (1000 * 60)) % 60)),
            (seconds = Math.floor((allMilliseconds / 1000) % 60));
          message = "";
        }

        let orderFood = order.list
          .map((food) => {
            orderPrice += food.count * +food.price;
            return `
           <li class="panel__orders-food">${
             food.name + " x" + food.count + "  (" + food.price + "UAH)"
           }</li>
          `;
          })
          .join(" ");
        return `
            <li class="panel__order-item">
                <div class="panel__order-item-box  personal__orders-box">
                  <div class="panel__order-timeout personal__orders-box">Перерва: ${
                    order.breakNum
                  }</div>
                  <div class="panel__order-timeout panel__order-date personal__orders-box">Дата: ${
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
                  </div>
                  <ol class="panel__orders-list__items">
                    ${orderFood}
                  </ol>
                  <p class="panel__order-fullprice">
                    Загальна сумма замовлення: ${orderPrice} UAH
                  </p>
                    <div class="panel__order-timer-box">
                      Залишилось часу:
                      <ul class="panel__order-timer-list">
                        <li class="panel__order-timer-hours">${hours} <span>Годин</span></li>
                        <li class="panel__order-timer-minuts">${minuts}<span>Хвилин</span></li>
                        <li class="panel__order-timer-seconds">${seconds} <span>Секунд</span></li>
                      </ul>
                    </div>
                    ${message}
                </div>
            </li>
        `;
      })
      .join(" ");

    modalOrdersList.innerHTML = ordersHtml;
  } else {
    modalOrdersList.innerHTML = ` <span class="no-orders">Упс! Ви ще не зробили жодного замовлення:)</span>`;
  }
}
