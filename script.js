const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const dateInput = document.getElementById("date");
const categoryInput = document.getElementById("category");
const addExpenseButton = document.getElementById("addExpense");

const totalAmount = document.getElementById("totalAmount");
const expenseList = document.getElementById("expenseList");
const budgetInput = document.getElementById("budgetInput");
const saveBudgetButton = document.getElementById("saveBudget");
const remainingAmount = document.getElementById("remainingAmount");
const foodTotal = document.getElementById("foodTotal");
const travelTotal = document.getElementById("travelTotal");
const collegeTotal = document.getElementById("collegeTotal");
const shoppingTotal = document.getElementById("shoppingTotal");
const otherTotal = document.getElementById("otherTotal");
let spendingChart;
const themeBtn = document.getElementById("themeBtn");
const budgetMessage = document.getElementById("budgetMessage");
const filterCategory = document.getElementById("filterCategory");

// Load saved expenses
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;

// Add expense
addExpenseButton.addEventListener("click", function () {

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const date = dateInput.value;
    const category = categoryInput.value;

    if (description === "" || amount <= 0 || date === "" || category === "") {
        alert("Please fill in all the details.");
        return;
    }

    const expense = {
        description: description,
        amount: amount,
        date: date,
        category: category
    };

    expenses.push(expense);

    // Save expenses
    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
    updateTotal();
    updateRemainingAmount();
    updateStatistics();

    // Clear form
    descriptionInput.value = "";
    amountInput.value = "";
    dateInput.value = "";
    categoryInput.value = "";
});


// Display expenses
function displayExpenses() {

    expenseList.innerHTML = "";

    const selectedCategory = filterCategory.value;

    const filteredExpenses = selectedCategory === "All"
        ? expenses
        : expenses.filter(function (expense) {
            return expense.category === selectedCategory;
        });

    filteredExpenses.forEach(function (expense) {

        const expenseItem = document.createElement("div");

        expenseItem.classList.add("expense-item");

        const actualIndex = expenses.indexOf(expense);

        expenseItem.innerHTML = `
            <div class="expense-info">
                <h3>${expense.description}</h3>
                <p>${expense.category} • ${expense.date}</p>
            </div>

            <strong>₹${expense.amount}</strong>

            <button class="edit-btn" onclick="editExpense(${actualIndex})">
                ✏️
            </button>

            <button class="delete-btn" onclick="deleteExpense(${actualIndex})">
                🗑️
            </button>
        `;

        expenseList.appendChild(expenseItem);
    });
}

// Calculate total
function updateTotal() {

    let total = 0;

    expenses.forEach(function (expense) {
        total += expense.amount;
    });

    totalAmount.textContent = `₹${total}`;
}

// Delete expense
function deleteExpense(index) {

    expenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
    updateTotal();
    updateRemainingAmount();
    updateStatistics();
}


// Show saved expenses when the page opens
displayExpenses();
updateTotal();
updateStatistics();

// Show saved budget when the page opens
if (budget > 0) {
    budgetInput.value = budget;
}

updateRemainingAmount();


// Save budget
saveBudgetButton.addEventListener("click", function () {

    const newBudget = Number(budgetInput.value);

    if (newBudget <= 0) {
        alert("Please enter a valid budget amount.");
        return;
    }

    budget = newBudget;

    localStorage.setItem("budget", budget);

    updateRemainingAmount();
});


// Calculate remaining amount
function updateRemainingAmount() {

    const totalspent = expenses.reduce(function (total, expense) {
        return total + expense.amount;
    }, 0);

    const remaining = budget - totalspent;

    remainingAmount.textContent = `₹${remaining}`;
   if (budget === 0) {
    budgetMessage.textContent = "";
    budgetMessage.className = "";
} else if (remaining < 0) {
    budgetMessage.textContent = `⚠️ You have exceeded your budget by ₹${Math.abs(remaining)}.`;
    budgetMessage.className = "budget-warning";
} else {
    budgetMessage.textContent = `💰 You have ₹${remaining} left in your budget.`;
    budgetMessage.className = "budget-safe";
}
}
// Calculate spending by category
function updateStatistics() {

    let food = 0;
    let travel = 0;
    let college = 0;
    let shopping = 0;
    let other = 0;

    expenses.forEach(function (expense) {

        if (expense.category === "Food") {
            food += expense.amount;
        }

        else if (expense.category === "Travel") {
            travel += expense.amount;
        }

        else if (expense.category === "College") {
            college += expense.amount;
        }

        else if (expense.category === "Shopping") {
            shopping += expense.amount;
        }

        else if (expense.category === "Other") {
            other += expense.amount;
        }
    });

    foodTotal.textContent = food;
    travelTotal.textContent = travel;
    collegeTotal.textContent = college;
    shoppingTotal.textContent = shopping;
    otherTotal.textContent = other;
    updateChart();
}
// Create spending chart
function updateChart() {

    const chartData = [
        foodTotal.textContent,
        travelTotal.textContent,
        collegeTotal.textContent,
        shoppingTotal.textContent,
        otherTotal.textContent
    ];

    const ctx = document.getElementById("spendingChart");

    if (spendingChart) {
        spendingChart.destroy();
    }

    spendingChart = new Chart(ctx, {
        type: "bar",

        data: {
            labels: ["Food", "Travel", "College", "Shopping", "Other"],

            datasets: [{
                label: "Amount Spent (₹)",
                data: chartData
            }]
        },

        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
// Dark mode
themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeBtn.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("theme", "light");
        themeBtn.textContent = "🌙 Dark Mode";
    }
});

// Load saved theme
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeBtn.textContent = "☀️ Light Mode";
}
//Edit expense
function editExpense(index) {

    const expense = expenses[index];

    descriptionInput.value = expense.description;
    amountInput.value = expense.amount;
    dateInput.value = expense.date;
    categoryInput.value = expense.category;

    expenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
    updateTotal();
    updateRemainingAmount();
    updateStatistics();
}
filterCategory.addEventListener("change", function () {
    displayExpenses();
});