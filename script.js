"use strict";

const arrivalTime = document.querySelector("#arrival");
const serviceTime = document.querySelector("#service");
const maxCustomer = document.querySelector("#max");
const initCustomer = document.querySelector("#init");
const numCustomer = document.querySelector("#num-customer");
const waitingTime = document.querySelector("#waiting-time");
const maxInit = document.querySelector(".horiz");
const inputs = document.querySelectorAll(".input");
const mode = document.querySelector(".mode");
const calcBtn = document.querySelector(".calc-btn");
let activeChoice = mode.querySelector(".choice--active");
const output = document.querySelector(".output");
const outputCustomer = document.querySelector(".result-customer");
const outputWaiting = document.querySelector(".result-waiting");

// Reset all input
const resetInputs = () =>
  inputs.forEach((input) => (input.querySelector(".input__field").value = ""));

// Change lambda value
const updateLambda = (value) =>
  lambda.forEach((lambda) => (lambda.textContent = value || 0));
// Change MU value
const updateMu = (value) => mu.forEach((mu) => (mu.textContent = value || 0));
// Change TI value
const updateTi = (value) => ti.forEach((ti) => (ti.textContent = value || 0));
// Change lambda ti value
const updateLambdaTi = (value) =>
  lambdaTi.forEach((ti) => (ti.textContent = value || 0));

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
  const lambda = 1 / arrivalTime.value;

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
      dd1k();
      break;
    case "mm1":
      mm1();
      break;
    case "mm1k":
      mm1k();
      break;
    case "mmc":
      mmc();
      break;
    case "mmck":
      mmck();
      break;
  }
});

calcBtn.addEventListener("click", () => {
  const type = activeChoice.dataset.type;
  const lambda = (1 / arrivalTime.value).toPrecision(2);
  const mu = (1 / serviceTime.value).toPrecision(2);
  const k = maxCustomer.value;

  numCustomer.disabled = false;
  waitingTime.disabled = false;

  if (type === "dd1k") updateDD1();
  if (type === "mm1") updateMM1();
  if (type === "mm1k") updateMM1k();
  if (type === "mmc") updateMMC();
});

numCustomer.addEventListener("keyup", function () {
  const lambda = (1 / arrivalTime.value).toFixed(3);
  const mu = (1 / serviceTime.value).toFixed(3);
  const k = maxCustomer.value;
  const m = initCustomer.value;
  const ti = +calcTi(lambda, mu, k);
  const tiFromM = calcTiForM(lambda, mu, m);
  let customer;
  const t = this.value;

  if (lambda > mu) {
    if (t <= parseInt(arrivalTime.value))
      customer = result(`t &#x2264; ${arrivalTime.value}`, `0`);
    if (parseInt(arrivalTime.value) < t && t <= ti)
      customer = result(
        `${arrivalTime.value} &#x3c; t &#x2264; ${ti}`,
        `${lambda * t - (mu * t - mu / lambda)}`
      );
    if (t > ti) customer = result(`t &gt; ${ti}`, k);
  } else {
    if (t < tiFromM)
      customer = result(`t &#x3c; ${tiFromM}`, `${m + lambda * t - mu * t}`);
    if (t >= tiFromM) customer = result(`t &#x2265; ${tiFromM}`, `1, 0`);
  }

  outputCustomer.innerHTML = customer;
});

waitingTime.addEventListener("keyup", function () {
  const lambda = (1 / arrivalTime.value).toFixed(3);
  const mu = (1 / serviceTime.value).toFixed(3);
  const k = maxCustomer.value;
  const m = initCustomer.value;
  const ti = calcTi(lambda, mu, k);
  const tiFromM = calcTiForM(lambda, mu, m);
  let n = parseInt(this.value) || 0;
  let waiting;

  if (lambda > mu) {
    if (n < lambda * ti)
      waiting = result(
        `n &#x3c; ${lambda * ti}`,
        `${(serviceTime.value - arrivalTime.value) * (n - 1)}`
      );
    if (n >= lambda * ti)
      waiting = result(
        `n &#x2265; ${lambda * ti}`,
        `${(serviceTime.value - arrivalTime.value) * (lambda * ti - 2)}`
      );
  } else {
    if (n == 0) waiting = result(`n = 0`, ((m - 1) / 2) * mu);

    if (n < lambda * tiFromM)
      waiting = result(
        `n < ${lambda * tiFromM}`,
        `${serviceTime.value * (m - 1 + n) - arrivalTime.value * n}`
      );

    if (n >= lambda * tiFromM)
      waiting = result(`n &#x2265; ${lambda * tiFromM}`, 0);
  }

  outputWaiting.innerHTML = waiting;
});

function dd1k() {
  resetInputs();
  const InitIn = initCustomer.closest(".input");
  maxInit.classList.remove("invisible");
  InitIn.classList.remove("invisible");
  maxCustomer.closest(".input").querySelector(".input__title").textContent =
    "Maximum customer (K - 1)";
  InitIn.querySelector(".input__title").textContent = "Initial Customer (M)";
  arrivalTime.closest(".input").querySelector(".input__title").textContent =
    "Arrival rate (1/λ)";
  serviceTime.closest(".input").querySelector(".input__title").textContent =
    "Service rate (1/μ)";
}

function mm1() {
  resetInputs();
  maxInit.classList.add("invisible");
  arrivalTime.closest(".input").querySelector(".input__title").textContent =
    "Mean arrival rate (λ)";
  serviceTime.closest(".input").querySelector(".input__title").textContent =
    "Mean service rate (μ)";
}

function mm1k() {
  resetInputs();

  maxInit.classList.remove("invisible");
  initCustomer.closest(".input").classList.add("invisible");
  maxCustomer.closest(".input").querySelector(".input__title").textContent =
    "Maximum customer (K)";
  arrivalTime.closest(".input").querySelector(".input__title").textContent =
    "Mean arrival rate (λ)";
  serviceTime.closest(".input").querySelector(".input__title").textContent =
    "Mean service rate (μ)";
}

function mmc() {
  resetInputs();

  maxInit.classList.remove("invisible");
  initCustomer.closest(".input").classList.add("invisible");
  maxCustomer.closest(".input").querySelector(".input__title").textContent =
    "systems (C)";
  arrivalTime.closest(".input").querySelector(".input__title").textContent =
    "Mean arrival rate (λ)";
  serviceTime.closest(".input").querySelector(".input__title").textContent =
    "Mean service rate (μ)";
}

function mmck() {
  resetInputs();

  maxInit.classList.remove("invisible");
  initCustomer.closest(".input").classList.remove("invisible");

  maxCustomer.closest(".input").querySelector(".input__title").textContent =
    "Maximum customer (K)";
  initCustomer.closest(".input").querySelector(".input__title").textContent =
    "systems (C)";
  arrivalTime.closest(".input").querySelector(".input__title").textContent =
    "Mean arrival rate (λ)";
  serviceTime.closest(".input").querySelector(".input__title").textContent =
    "Mean service rate (μ)";
}

function calcTi(lambda, mu, K) {
  const numerator = K - mu / lambda;
  const denumerator = lambda - mu;
  const arrivalTime = 1 / lambda;

  let curTi = Math.round(numerator / denumerator);
  let prevTi = 0;

  while (true) {
    let p1 = Math.round(lambda * curTi);
    let p2 = Math.round(mu * curTi - mu / lambda);

    if (p1 - p2 === K) [prevTi, curTi] = [curTi, curTi - arrivalTime];
    else return curTi;
  }

function calcTiForM(lambda, mu, M) {
  let ti = Math.trunc(M / (mu - lambda));
  let arrivalTime = 1 / lambda;

  while (true) {
    ti -= arrivalTime;
    let check = Math.trunc(mu * ti) - Math.trunc(lambda * ti);
    if (check != M) {
      break;
    }
  }
  return Math.round(ti + arrivalTime);
}

function result(title, value) {
  return `<div class="result">
              <div class="result__title">${title}</div>
              <div class="result__value">${value}</div>
          </div>`;
}

function updateDD1() {
  const lambda = (1 / arrivalTime.value).toFixed(3);
  const mu = (1 / serviceTime.value).toFixed(3);
  const k = maxCustomer.value;
  const m = initCustomer.value;
  const ti = calcTi(lambda, mu, k);
  const tiFromM = calcTiForM(lambda, mu, m);
  let customer, waiting;

  if (lambda > mu) {
    customer =
      result(`t &#x2264; ${arrivalTime.value}`, `0`) +
      result(
        `${arrivalTime.value} &#x3c; t &#x2264; ${ti}`,
        `[${lambda}t] - [${mu}t - ${mu / lambda}]`
      ) +
      result(`t &gt; ${ti}`, k);

    waiting =
      result(
        `n &#x3c; ${lambda * ti}`,
        `[${serviceTime.value - arrivalTime.value}](n - 1)`
      ) +
      result(
        `n &#x2265; ${lambda * ti}`,
        `${(serviceTime.value - arrivalTime.value) * (lambda * ti - 2)}`
      );
  } else {
    customer =
      result(`t &#x3c; ${tiFromM}`, `${m} + [${lambda}t] - [${mu}t]`) +
      result(`t &#x2265; ${tiFromM}`, `1, 0`);

    waiting =
      result(`n = 0`, ((m - 1) / 2) * mu) +
      result(
        `n < ${lambda * tiFromM}`,
        `${serviceTime.value}(${m - 1} + n) - ${arrivalTime.value}n`
      ) +
      result(`n &#x2265; ${lambda * tiFromM}`, 0);
  }

  output.innerHTML = `<div class="customer-number">
                    <div class="result-header">
                        <h2 class="secondary-heading">Number of customer n(t)</h2>
                        <input type="number" name="arrival" id="num-customer" placeholder="n(t)"
                            class="input__field input-customer" min="0" disabled>
                    </div>
                    <div class="result-customer">${customer}</div>
                </div>
                <hr>
                <div class="waiting time">
                    <div class="result-header">
                        <h2 class="secondary-heading">Waiting time w<sub>q</sub>(t)</h2>
                        <input type="number" name="arrival" id="waiting-time" placeholder="wq(t)"
                            class="input__field input-waiting" min="0" disabled>
                    </div>
                    <div class="result-waiting">${waiting}</div>
                </div>`;
  // outputCustomer.innerHTML = customer;
  // outputWaiting.innerHTML = waiting;
}

function updateMM1() {
  const lambda = arrivalTime.value;
  const mu = serviceTime.value;

  output.innerHTML =
    result("L", lambda / (mu - lambda)) +
    result("L<sub>q</sub>", (lambda * lambda) / (mu - lambda)) +
    result("W", 1 / (mu - lambda)) +
    result("W<sub>q</sub>", lambda / (mu * (mu - lambda)));
}
function updateMM1k() {
  const lambda = parseInt(arrivalTime.value);
  const mu = parseInt(serviceTime.value);
  const k = parseInt(maxCustomer.value);
  const row = lambda / mu;
  let l, pk;
  if (row === 1) {
    l = k / 2;
    pk = 1 / (k + 1);
  } else {
    const numerator = 1 - (k + 1) * Math.pow(row, k) + k * Math.pow(row, k + 1);
    const denominator = (1 - row) * (1 - Math.pow(row, k + 1));
    l = row * (numerator / denominator);
    pk = Math.pow(row, k) * ((1 - row) / (1 - Math.pow(row, k + 1)));
  }
  const lambdaDash = lambda * (1 - pk);
  const w = l / lambdaDash;
  const wq = w - 1 / mu;
  const lq = lambdaDash * wq;

  output.innerHTML =
    result("L", l.toFixed(3)) +
    result("L<sub>q</sub>", lq.toFixed(3)) +
    result("W", w.toFixed(3)) +
    result("W<sub>q</sub>", wq.toFixed(3));
}
function updateMMC() {}
