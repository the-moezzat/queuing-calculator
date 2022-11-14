const arrivalTime = document.querySelector("#arrival");
const serviceTime = document.querySelector("#service");
const maxCustomer = document.querySelector("#max");
const initCustomer = document.querySelector("#init");

const cases = function () {
  const lambda = 1 / parseInt(arrivalTime.value);
  const mu = 1 / parseInt(serviceTime.value);

  // prevent do any calculation when one of the inputs equal to NAN.
  if (!(lambda && mu)) return;

  if (lambda > mu) {
    initCustomer.disabled = true;
    maxCustomer.disabled = false;
  } else {
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
