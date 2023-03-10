'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Matias Sagardia',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

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


// Create a function to format the date on the movements. It takes a date (then called at the displayMovements function), and calculates
// the difference with another date, to get the amount of days. Depending on the days passed, it returns a different message on the movement.

const formatMovementDate = function(date, locale) {

  const calcDaysPassed = (date1, date2) => Math.round(Math.abs((date1 - date2) / (1000 * 60 * 60 * 24)));
  const daysPassed = calcDaysPassed(new Date(), date);

  if(daysPassed === 0) return 'Today';
  if(daysPassed === 0) return 'Today';
  if(daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
  }


}

// Function to adapt the format of the values depending on the locale and currency of each accunt

const formatCur = function(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
}

const displayMovements = function(acc, sort = false) {

  // This function loops over the movements array of the given account, check if positive (deposit) or negative (withdraw) and create a variable that changes
  // the variables inside the container based on the data. Then inserts it to the html by the insertAdjacentHTML method.
  // Also sets sort to false, to be able to sort when clicking on the button. The movs variable stores the sorted array.
  // Creates a new date based on the index of the movements array to set it on each transfer.

  containerMovements.innerHTML = '';

  const movs = sort ? currentAccount.movements.slice().sort((a, b) => a - b) : currentAccount.movements;

  movs.forEach((move, i) => {

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(move, acc.locale, acc.currency);

    const type = move > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
                  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
                  <div class="movements__date">${displayDate}</div>
                  <div class="movements__value">${formattedMov}</div>
                  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
});
};

// to sort the movements

let sorted = false;

btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
})


const calcDisplayBalance = function(acc) {
  // Use the reduce method to add the balance values and display it.
  const balance = acc.movements.reduce((acc, value) => acc + value, 0);
  acc.balance = balance;
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};


const calcDisplaySummary = function (acc) {
  //Receives an account as paramenter
  //Filter all the positive and negative moves and the accumulates all to display on the summary below the page
  //Calculates some percentaje of the deposits to generate the interest label based on each account interest
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);;

  const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements.filter(mov => mov > 0).map(mov => mov * acc.interestRate/100).reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
}

const createUsername = function(accs) {
  // it receives an array, loops through it and add the username key to each object of the array. The username key is the owner of the account with 
  // array methods in order to get the first two letters of the name and lastname.
  accs.forEach(acc => {
    acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
  });
};


createUsername(accounts);

const updateUI = function(acc) {
  displayMovements(acc);
  calcDisplaySummary(acc);
  calcDisplayBalance(acc);
}

// function to start the timer to log out the account

const startLogOutTimer = function() {
  const tick = function(){

    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;


    if(time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    time--;
}
  let time = 120;
  tick();

  const timer = setInterval(tick, 1000);

  return timer;
}




// EVENT HANDLERS


// Create the variable for the current account inserted on the login, but it is empty. Then, we create an eventlistener for the login username field
// so when the user inserts the username and clicks on login, the .find method looks for the account with that username and stores it on the currentAccount.
// Then, at the if statement, we check with the ? if the current account is true, and if true, then check for the value of inserted pin against the user pin.
// Inside the conditional, we set the welcome message to the name and changes the opacity of the body, which makes the page visible.
// Also, restes the input values to zero and call the rest of the functions to show the movements.

let currentAccount, timer;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

  // Setting the current date

    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

  if(currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    inputLoginPin.blur();

    if(timer) clearInterval(timer);
    timer = startLogOutTimer();

    updateUI(currentAccount);
  }
});


// Functionality to transfer money from one account to another one. It stores the amount and receiver values, then checks if the amount is greater than 0,
// the receiver exists, and there is enough money in the account and it the receiver is not the same person.
// Finally, it pushes a negative movement to the current account and a positive movement for the receiver account.

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  if(amount > 0 && receiver && currentAccount.balance >= amount && receiver.username !== currentAccount.username) {
  currentAccount.movements.push(-amount);
  receiver.movements.push(amount);

  // Add transfer date
    currentAccount.movementsDates.push(new Date());
    receiver.movementsDates.push(new Date());

    updateUI(currentAccount);

    // reset timer

    clearInterval(timer);
    timer = startLogOutTimer();
  }
})

// checks if the inputs are the same as the account values, then looks for the index of the current account in the accounts arrays and
// splice it.

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
})

// store the amount of the loan in the amount variable, checks if the amount is greater than 0 and if there is at least one movement in the account 
// that is equal to the 10% of the requested loan. If thats true, then the amount is pushed to the movements property.
// Added timeout to simulate the delay on a real transaction

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if(amount > 0 && currentAccount.movements.some(mov => mov > amount * 0.1)) {
    
    setTimeout(function() {
      
      currentAccount.movements.push(amount);
      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      console.log(currentAccount.movementsDates);
      updateUI(currentAccount)}, 2500);
      clearInterval(timer);
      timer = startLogOutTimer();
      inputLoanAmount.value = '';
  }
})


