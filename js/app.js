const trayBox = document.querySelector(".app__tray-box");
const trayInner = document.querySelector(".app__tray");
const foodsList = document.querySelector(".app__food-inner");
const totalPriceNode = document.querySelector(".app__price__number-num");
const notificationInner = document.querySelector(".notification__inner");
const formList = document.querySelector(".form__list-items");
const totalPriceForm = document.querySelector(".total__price_form");

let trayArr = [];

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

renderFoodsItems(goods);

/*Якась важлива штука, без якої не працює драг */
trayBox.addEventListener("dragover", function (event) {
  event.preventDefault();
});

let iniqueTrayMass = [];

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

  console.log(trayArr);
}

/*Логіка додавання в корзину */
function addToTray(e) {
  e.preventDefault();
  const dragEl = document.querySelector(".drag");
  // const img = dragEl.querySelector("img");
  // let clone = img.cloneNode(true);
  // trayInner.appendChild(clone);
  trayBox.classList.add("pulse");
  setTimeout(() => {
    trayBox.classList.remove("pulse");
  }, 400);

  addFoodToTray(dragEl);
  calcPrice(trayArr);
  renderFoodsInTray(trayArr);
  renderFoodsList(trayArr);
  createNotification(dragEl);
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
            <span class="app__tray-count">${'x ' + item.count}</span>
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

/*Функція рендеру товарів */
function renderFoodsItems(arr) {
  let foodsHtml = arr.map((item) => {
    return `
                <li data-id="${item.id}" draggable="true" class="app__food-item">
              <img src="${item.imgUrl}" alt="food" class="app__food-img" />
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

  let foods = document.querySelectorAll(".app__food-item");
  foods.forEach((food) => {
    /*Додаєм клас елементу, якого перетягуєм, для його ідентифікації*/
    food.addEventListener("dragstart", () => {
      food.classList.add("drag");
    });
    /*Забираєм клас елементу, якого перетягуєм*/
    food.addEventListener("dragend", () => {
      food.classList.remove("drag");
    });
  });
  trayBox.addEventListener("drop", addToTray);
}

/*Функція виводу товару в список в формі */
function renderFoodsList(arr) {
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
