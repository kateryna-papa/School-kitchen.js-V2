const orersList = document.querySelector(".panel__order-list");
const reRenderOrders = document.querySelector(".panel__orders-render");
const loader = document.querySelector(".loader-box");
const modalBbtn = document.querySelector(".app__btn-panel");
const modal = document.querySelector("#Modal-menu");
let closeBtn = document.querySelector(".close-btn");
const panelList = document.querySelector(".panel__menu-list");
const selectFilter = document.querySelector(".panel__select");
const bodyNode = document.querySelector("body");
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
    "https://school-kitchen-b274e-default-rtdb.firebaseio.com/orders.json"
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
    .catch((error)=>{
      console.log(error);
    });
}
fetchOrders();

async function fetchMenu() {
  panelList.innerHTML = "";
  await fetch(
    "https://school-kitchen-b274e-default-rtdb.firebaseio.com/menu.json"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data = transformFbDataToArr(data);
      renderMenuItems(data);
    })
    .catch((error)=>{
      console.log(error);
    });
}

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
      .map((order) => {
        let orderPrice = 0;
        let progresClass = null;
        let btnText = null;
        let deadline = new Date(order.deadline);
        let deadlineStr = deadline.toLocaleDateString() + ' ' + deadline.getHours() + ':' + deadline.getMinutes();
        if (localStorage.getItem(order.id) == "true") {
          progresClass = "done";
          btnText = "Виконано";
        } else {
          progresClass = "";
          btnText = "Не виконано";
        }
        let orderFood = order.list
          .map((food) => {
            orderPrice += food.count * +food.price;
            return `
           <li class="panel__orders-food">${food.name + " x" + food.count}</li>
          `;
          })
          .join(" ");
        return `
            <li class="panel__order-item">
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
  }else{
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
  } else{
    return
  }

}

const form = document.querySelector(".form");
const formButton = document.querySelector(".form__btn");

formButton .addEventListener("click", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name-food");
  const price = formData.get("price");
  const image = formData.get("image");

  const menu = {
    name: name,
    price: price,
    image: image
  };
  console.log(menu);

  /*Відправка меню в базу даних*/
  class ApiService {
    constructor(baseUrl) {
      this.url = baseUrl;
    }

    async createMenu(menu) {
      try {
        const request = new Request(this.url + "/menu.json", {
          method: "POST",
          body: JSON.stringify(menu),
        });
        const response = await fetch(request);
        return await response.json();
      } catch (error) {
        console.error(error);
      }
    }
  }

  const apiService = new ApiService(
      "https://school-kitchen-b274e-default-rtdb.firebaseio.com"
  );
  apiService.createMenu(menu);
  fetchMenu();
  let menuArray = transformFbDataToArr(menu);
  renderMenuItems(menuArray);
});

/*Масив товарів */
/*let goods = [
  {
    id: 0,
    name: "Hot dog",
    price: 30,
    imgUrl: "images/dogg.png",
    count: 1,
  },
  {
    id: 1,
    name: "Pizza",
    price: 30,
    imgUrl: "images/pizza.png",
    count: 1,
  },
  {
    id: 2,
    name: "Burger",
    price: 30,
    imgUrl: "images/burger.png",
    count: 1,
  },
  {
    id: 3,
    name: "Fried egg",
    price: 15,
    imgUrl: "images/egg.png",
    count: 1,
  },
  {
    id: 4,
    name: "French fries",
    price: 30,
    imgUrl: "images/fries.png",
    count: 1,
  },
  {
    id: 5,
    name: "Sandwich",
    price: 25,
    imgUrl: "images/sandwich.png",
    count: 1,
  },
  {
    id: 6,
    name: "Pasta",
    price: 15,
    imgUrl: "images/pasta.png",
    count: 1,
  },
  {
    id: 7,
    name: "Bread",
    price: 5,
    imgUrl: "images/bread.png",
    count: 1,
  },
  {
    id: 8,
    name: "Sauces",
    price: 10,
    imgUrl: "images/sauces.png",
    count: 1,
  },
  {
    id: 9,
    name: "Donut",
    price: 20,
    imgUrl: "images/donut.png",
    count: 1,
  },
  {
    id: 10,
    name: "Chocolate",
    price: 30,
    imgUrl: "images/chocolate.png",
    count: 1,
  },
  {
    id: 11,
    name: "Ice cream",
    price: 20,
    imgUrl: "images/ice.png",
    count: 1,
  },
  {
    id: 12,
    name: "Coca Cola",
    price: 20,
    imgUrl: "images/cola.png",
    count: 1,
  },
  {
    id: 13,
    name: "Tea",
    price: 5,
    imgUrl: "images/tea.png",
    count: 1,
  }
];*/

function renderMenuItems(menuArr) {
    let menuHtml = menuArr
        .map((item) => {
            return `
           <li class="panel__menu__item">
                <div class="panel__menu__item-box">
                  <p class="panel__menu__item-name">${item.name}</p>
                  <p class="panel__menu__item-price">Ціна: ${item.price} UAH</p>
                </div>
              </li>
          `;
          })
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
