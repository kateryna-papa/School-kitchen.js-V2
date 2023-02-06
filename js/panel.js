const orersList = document.querySelector(".panel__order-list");
const reRenderOrders = document.querySelector(".panel__orders-render");
const loader = document.querySelector(".loader-box");
const panelList = document.querySelector(".panel__menu-list");
const selectFilter = document.querySelector(".panel__select");
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

function renderOrders(ordersArr) {
  if (ordersArr) {
    console.log('a');
    let ordersHtml = ordersArr
      .map((order) => {
        let orderPrice = 0;
        let progresClass = null;
        let btnText = null;
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

/*Масив товарів */
let goods = [
  {
    id: 0,
    name: "Hot dog",
    price: 30,
    imgUrl: "images/dogg.png",
    count: 1,
  },
  {
    id: 1,
    name: "Donut",
    price: 20,
    imgUrl: "images/dogg.png",
    count: 1,
  },
  {
    id: 2,
    name: "Sauces",
    price: 10,
    imgUrl: "images/dogg.png",
    count: 1,
  },
  {
    id: 3,
    name: "Pizza",
    price: 30,
    imgUrl: "images/dogg.png",
    count: 1,
  },
  {
    id: 4,
    name: "Burger",
    price: 30,
    imgUrl: "images/2.png",
    count: 1,
  },
];

renderMenuItems(goods);

function renderMenuItems(menu) {
  let menuHtml = menu.map((item) => {
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

