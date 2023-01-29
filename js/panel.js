
const orersList = document.querySelector(".panel__order-list");
const reRenderOrders = document.querySelector(".panel__orders-render");
const loader = document.querySelector(".loader-box");


let data = null;
reRenderOrders.addEventListener("click", fetchOrders);

async function fetchOrders() {
   orersList.innerHTML = '';
  loader.classList.add('show');
   await fetch("https://school-kitchen-b274e-default-rtdb.firebaseio.com/orders.json")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data = transformFbDataToArr(data);
      data.sort((a, b) => (a.breakNum > b.breakNum ? 1 : -1));
      loader.classList.remove("show");
      renderOrders(data);
    });
}
fetchOrders();

function renderOrders(ordersArr) {
  if (ordersArr.length > 0) {
    let ordersHtml = ordersArr
      .map((order) => {
        let orderPrice = 0;
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
                    <button class="panel__order-marker__btn">
                      Відмітити як виконаний
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
        } else {
          e.target.classList.add("done");
          e.target.textContent = "Виконано";
        }
      });
    });
  }
}

function transformFbDataToArr(fbData) {
  return Object.keys(fbData).map((key) => {
    const item = fbData[key];
    item.id = key;
    return item;
  });
}
