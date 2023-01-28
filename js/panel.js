const orersList = document.querySelector(".panel__order-list");

let data = null;

fetch("https://school-kitchen-b274e-default-rtdb.firebaseio.com/orders.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    data = transformFbDataToArr(data);
    console.log(data);
    renderOrders(data);
  });

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
                  <div class="panel__order-timeout">Перерва: 2</div>
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
          e.target.textContent = 'Не виконано'
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
