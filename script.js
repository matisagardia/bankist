'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



const displayMovements = function(movements) {
  // This function loops over the movements array, check if positive (deposit) or negative (withdraw) and create a variable that changes
// the variables inside the container based on the data. Then inserts it to the html by the insertAdjacentHTML method.
  containerMovements.innerHTML = '';

  movements.forEach((move, i) => {

    const type = move > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
                  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                  <div class="movements__value">${move}</div>
                  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
});
};

displayMovements(account1.movements);


const calcDisplayBalance = function(movements) {
  // Use the reduce method to add the balance values and display it.
  const balance = movements.reduce((acc, value) => acc + value, 0);
  labelBalance.textContent = `${balance} $`;
};

calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (movements) {
  //Filter all the positive and negative moves and the accumulates all to display on the summary below the page
  //Calculates some percentaje of the deposits to generate the interest label
  const incomes = movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}$`;

  const out = movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}$`;

  const interest = movements.filter(mov => mov > 0).map(mov => mov * 1.2/100).reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}$`;
}

calcDisplaySummary(account1.movements);

const createUsername = function(accs) {
  // it receives an array, loops through it and add the username key to each object of the array. The username key is the owner of the account with 
  // array methods in order to get the first two letters of the name and lastname.
  accs.forEach(acc => {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};

createUsername(accounts);

// Create the variable for the current account inserted on the login, but it is empty. Then, we create an eventlistener for the login username field
// so when the user inserts the username and clicks on login, the .find method looks for the account with that username and stores it on the currentAccount.

let currentAccount;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);
});