const arrivalTime = document.querySelector("#arrival");
const serviceTime = document.querySelector("#service");
const maxCustomer = document.querySelector("#max");
const initCustomer = document.querySelector("#init");
const maxInit = document.querySelector(".horiz");
const mode = document.querySelector(".mode");

let activeChoice = mode.querySelector(".choice--active");

const cases = function () {
  const lambda = 1 / parseInt(arrivalTime.value);
  const mu = 1 / parseInt(serviceTime.value);

  // prevent do any calculation when one of the inputs equal to NAN.
  if (!(lambda && mu)) return;

  if (lambda > mu) {
    maxCustomer.closest(".input").classList.remove("input-disable");
    initCustomer.closest(".input").classList.add("input-disable");
    initCustomer.disabled = true;
    maxCustomer.disabled = false;
  } else {
    maxCustomer.closest(".input").classList.add("input-disable");
    initCustomer.closest(".input").classList.remove("input-disable");
    initCustomer.disabled = false;
    maxCustomer.disabled = true;
  }
};

arrivalTime.addEventListener("keyup", (e) => {
  const lambda = 1 / arrivalTime;

  cases();
});
serviceTime.addEventListener("keyup", (e) => {
  const mu = 1 / serviceTime.value;

  cases();
});

mode.addEventListener("click", (e) => {
  const choice = e.target;
  if (!choice.classList.contains("choice")) return;

  const type = choice.dataset.type;

  activeChoice.classList.remove("choice--active");
  choice.classList.add("choice--active");
  activeChoice = choice;

  switch (type) {
    case "dd1k":
      console.log(type);
      maxInit.classList.remove("invisible");
      initCustomer.closest(".input").classList.remove("invisible");
      maxCustomer.closest(".input").querySelector(".input__title").textContent =
        "Maximum customer (K - 1)";
      initCustomer
        .closest(".input")
        .querySelector(".input__title").textContent = "Initial Customer (M)";
      break;
    case "mm1":
      console.log(type);
      maxInit.classList.add("invisible");
      break;
    case "mm1k":
      maxInit.classList.remove("invisible");
      initCustomer.closest(".input").classList.add("invisible");
      maxCustomer.closest(".input").querySelector(".input__title").textContent =
        "Maximum customer (K)";
      console.log(type);
      break;
    case "mmc":
      maxInit.classList.remove("invisible");
      initCustomer.closest(".input").classList.add("invisible");
      maxCustomer.closest(".input").querySelector(".input__title").textContent =
        "systems (C)";
      console.log(type);
      break;
    case "mmck":
      maxInit.classList.remove("invisible");
      initCustomer.closest(".input").classList.remove("invisible");

      maxCustomer.closest(".input").querySelector(".input__title").textContent =
        "Maximum customer (K)";
      initCustomer
        .closest(".input")
        .querySelector(".input__title").textContent = "systems (C)";
      console.log(type);
      break;
  }
});
