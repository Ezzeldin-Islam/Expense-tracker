let balanceEl = document.getElementById("balance");
let incomeAmountEl = document.getElementById("income-amount");
let expenseAmountEl = document.getElementById("expense-amount");

let transactionsContainer = document.getElementById("transaction-list");

let transactionForm = document.getElementById("transaction-form");
let descriptionInput = document.getElementById("description");
let amountInput = document.getElementById("amount");

let transactions = [];

if (localStorage.getItem("transactions")) {
  transactions = JSON.parse(localStorage.getItem("transactions"));
  updateBalance();
  transactions.forEach((transaction) => {
    createTransaction(transaction);
  });
} else {
  transactions = [];
}

transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let description = descriptionInput.value.trim();
  let amount = parseFloat(amountInput.value.trim());

  transactions.push({
    id: Date.now(),
    description: description,
    amount: amount,
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateSalaries();
  updateBalance();

  descriptionInput.value = "";
  amountInput.value = "";

  createTransaction(
    JSON.parse(localStorage.getItem("transactions")).slice(-1)[0],
  );
});

transactionsContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-btn")) {
    deleteTransaction(e);
  }
  if (e.target.classList.contains("transaction")) {
    editTransaction(e);
  }
});

function updateBalance() {
  balanceEl.textContent = `$${JSON.parse(localStorage.getItem("transactions"))
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2)}`;
  incomeAmountEl.textContent = `$${JSON.parse(
    localStorage.getItem("transactions"),
  )
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2)}`;
  expenseAmountEl.textContent = `$${Math.abs(
    JSON.parse(localStorage.getItem("transactions"))
      .filter((transaction) => transaction.amount < 0)
      .reduce((acc, transaction) => acc + transaction.amount, 0),
  ).toFixed(2)}`;
}

function updateSalaries() {
  balanceEl.textContent = `$${transactions.reduce((acc, transaction) => acc + transaction.amount, 0).toFixed(2)}`;
  incomeAmountEl.textContent = `$${transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0)
    .toFixed(2)}`;
  expenseAmountEl.textContent = `$${Math.abs(transactions.filter((transaction) => transaction.amount < 0).reduce((acc, transaction) => acc + transaction.amount, 0)).toFixed(2)}`;
}

function createTransaction(data) {
  if (data.description === "" || isNaN(data.amount)) {
    return;
  } else {
    let transactionEl = document.createElement("li");
    transactionEl.classList.add("transaction");
    transactionEl.setAttribute("data-id", data.id);
    if (data.amount < 0) {
      transactionEl.classList.add("expense");
    } else {
      transactionEl.classList.add("income");
    }
    transactionEl.innerHTML = `
    <span>${data.description}</span>
    <span>
    ${data.amount < 0 ? "-" : ""}$${Math.abs(data.amount).toFixed(2)}
    <button class="delete-btn">x</button>
    </span>
    `;
    transactionsContainer.prepend(transactionEl);
  }
}

function deleteTransaction(e) {
  let parent = e.target.parentElement.parentElement;
  let id = parent.getAttribute("data-id");
  transactions = transactions.filter((transaction) => transaction.id != id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  parent.remove();
  updateBalance();
}

function editTransaction(e) {
  let parent = e.target;
  let title = parent.querySelector("span:first-child");
  let amount = parent.querySelector("span:last-child");
  let id = parent.getAttribute("data-id");

  descriptionInput.value = title.textContent;
  amountInput.value = parseFloat(amount.textContent.replace(/[^0-9.-]+/g, ""));
  transactionForm.querySelector("button").textContent = "Update Transaction";
  transactionForm.onsubmit = function (e) {
    e.preventDefault();
    let description = descriptionInput.value.trim();
    let amount = parseFloat(amountInput.value.trim());
    transactions = transactions.map((transaction) => {
      if (transaction.id == id) {
        transactions.splice(transactions.indexOf(transaction), 1, {
          id: transaction.id,
          description: description,
          amount: amount,
        });
        localStorage.setItem("transactions", JSON.stringify(transactions));

        updateSalaries();
        updateBalance();

        descriptionInput.value = "";
        amountInput.value = "";
        transactionForm.querySelector("button").textContent = "Add Transaction";
        window.location.reload();
      }
    });
  };
}
