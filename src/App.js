import { useEffect, useRef, useState } from "react";
import "./App.css";
import logo from "./images/logo.png";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    "2023-07-06T21:31:17.178Z",
    "2023-07-05T07:42:02.383Z",
    "2023-07-01T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
const accounts = [account1, account2, account3, account4];

function App() {
  const [incomes, setIncomes] = useState("0000€");
  const [outcomes, setOutcomes] = useState("0000€");
  const [interest, setInterest] = useState("0000€");
  const [message, setMessage] = useState("Log in to get started");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserAccount, setcurrentUserAccount] = useState({});
  const userNameRef = useRef();
  const userPwdRef = useRef();
  const userName = useRef();
  const userPwd = useRef();
  const loanAmountRef = useRef();
  const transferAmountRef = useRef();
  const transferToRef = useRef();
  const [isSort, setIsSort] = useState(false);
  const [time, setTime] = useState(120);
  const [changeColor, setChangeColor] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      calcDisplaySummary(currentUserAccount);
    }
  }, [currentUserAccount]);

  useEffect(() => {
    const createUserNames = (accs) => {
      accs.forEach(
        (acc) =>
          (acc.userName = acc.owner
            .toLowerCase()
            .split(" ")
            .map((name) => name[0])
            .join(""))
      );
    };
    createUserNames(accounts);
  }, []);

  const formateDate = (date) => {
    const calcDaysPassed = (date1, date2) =>
      Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const dayPassed = calcDaysPassed(new Date(), date);
    if (dayPassed === 0) return "Today";
    if (dayPassed === 1) return "Yesterday";
    if (dayPassed <= 7) return `${dayPassed} days ago`;
    else {
      // const now = new Date(date);
      // const day = `${now.getDay()}`.padStart(2, 0);
      // const month = `${now.getMonth() + 1}`.padStart(2, 0);
      // const year = now.getFullYear();
      // return `${day}/${month}/${year}`;

      return new Intl.DateTimeFormat().format(date);
    }
  };

  const displayMovements = (acc) => {
    const movs = isSort
      ? [...acc.movements].sort((a, b) => a - b)
      : acc.movements;
    return movs.map((mov, i) => {
      const type = mov > 0 ? "deposit" : "withdrawal";

      // Display date
      const displayDate = formateDate(new Date(acc.movementsDates[i]));

      // Formate balance
      const formatBalance = () => {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(mov);
      };

      return (
        <div
          className={
            changeColor && i % 2 === 0
              ? "movements__row backgroundColor"
              : "movements__row"
          }
        >
          <div className={`movements__type movements__type--${type}`}>
            {`${i + 1} ${type}`}
          </div>
          <div className="movements__date">{displayDate}</div>
          <div className="movements__value">{formatBalance()}</div>
        </div>
      );
    });
  };

  const calcBalance = (acc) => {
    const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
    const formatBalance = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(balance);
    acc.balance = balance;
    return (
      <p
        className="balance__value"
        onClick={() => {
          setChangeColor(!changeColor);
        }}
      >
        {formatBalance}
      </p>
    );
  };

  const calcDisplaySummary = (acc) => {
    const calcIncomes = acc.movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    const formateCalcIncomes = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(calcIncomes);
    setIncomes(formateCalcIncomes);

    const calcOutcomes = Math.abs(
      acc.movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0)
    );
    const formateCalcOutcomes = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(calcOutcomes);
    setOutcomes(formateCalcOutcomes);

    const calcInterest = acc.movements
      .filter((mov) => mov > 0)
      .map((dep) => (dep * acc.interestRate) / 100)
      .filter((int, i, arr) => {
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0);
    const formateCalcInterst = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(calcInterest);
    setInterest(formateCalcInterst);
  };

  const formSubmitHandler = (e) => {
    e?.preventDefault();
    const userName = userNameRef.current.value;
    const userPwd = userPwdRef.current.value;
    const validateUser = accounts.find((un) => un.userName === userName);
    setcurrentUserAccount(validateUser);
    if (validateUser?.pin === Number(userPwd)) {
      // Display UI and Message
      setMessage(`Welcome back, ${validateUser.owner}`);
      setIsLoggedIn(true);

      // Timer counter
      countDownTimerHandler();
    }
    userNameRef.current.value = "";
    userPwdRef.current.value = "";
    userPwdRef.current.blur();
  };

  const transferAmountHandler = (e) => {
    e?.preventDefault();
    const receiverName = transferToRef.current.value;
    const amount = Number(transferAmountRef.current.value);
    const receiverAcc = accounts.find((data) => data.userName === receiverName);
    if (
      amount > 0 &&
      receiverAcc &&
      receiverAcc?.userName !== currentUserAccount.userName &&
      currentUserAccount.balance >= amount
    ) {
      currentUserAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      //Add Transfer amount date
      currentUserAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString);
    }
    calcBalance(currentUserAccount);
    calcDisplaySummary(currentUserAccount);
    displayMovements(currentUserAccount);

    transferToRef.current.value = transferAmountRef.current.value = "";
    // transferAmountRef.current.value = "";
    transferAmountRef.current.blur();
  };

  const requestLoanHandler = (e) => {
    e?.preventDefault();
    const loanAmount = Math.floor(loanAmountRef.current.value);
    if (
      loanAmount > 0 &&
      currentUserAccount.movements.some((amount) => amount >= loanAmount * 0.1)
    ) {
      currentUserAccount.movements.push(loanAmount);

      //Add loan date
      currentUserAccount.movementsDates.push(new Date().toISOString());
    }
    console.log(currentUserAccount);
    calcBalance(currentUserAccount);
    calcDisplaySummary(currentUserAccount);
    displayMovements(currentUserAccount);
    loanAmountRef.current.value = "";
  };

  const closeAccountHandler = (e) => {
    e?.preventDefault();
    const uName = userName.current.value;
    const uPwd = Number(userPwd.current.value);
    if (
      uName === currentUserAccount.userName &&
      uPwd === currentUserAccount.pin
    ) {
      const index = accounts.findIndex((acc) => acc.userName === uName);
      accounts.splice(index, 1);
      setMessage("Login in to get started");
      setIsLoggedIn(false);
    }
  };

  const sorting = (e) => {
    e?.preventDefault();
    setIsSort(!isSort);
    displayMovements(currentUserAccount);
  };

  const countDownTimerHandler = () => {
    let timer = time;
    const clearTimer = setInterval(() => {
      if (timer === 0) {
        setTime(120);
        setIsLoggedIn(false);
        setMessage("Log in to get started");
        return clearInterval(clearTimer);
      }
      setTime(timer--);
    }, 100);
  };

  const timer = () => {
    return (
      <p className="logout-timer">
        You will be logged out in{" "}
        <span className="logout-timer">
          <span>{String(Math.trunc(time / 60)).padStart(2, 0)}m:</span>
          <span>{String(time % 60).padStart(2, 0)}s:</span>
        </span>
      </p>
    );
  };

  const dateHandler = () => {
    const now = new Date();
    // const day = `${now.getDay()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = now.getMinutes();
    // const date = `${day}/${month}/${year}, ${hour}:${min}`;
    // return <span className="balance__date">{date}</span>;

    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long",
    };
    return new Intl.DateTimeFormat("en-US", options).format(now);
  };

  return (
    <div className="App">
      <nav>
        <p className="welcome">{message}</p>
        <img src={logo} alt="Logo" className="logo" />
        <form className="login" onSubmit={formSubmitHandler}>
          <input
            type="text"
            placeholder="user"
            className="login__input login__input--user"
            ref={userNameRef}
          />
          <input
            type="text"
            placeholder="PIN"
            maxlength="4"
            className="login__input login__input--pin"
            ref={userPwdRef}
          />
          <button className="login__btn">&rarr;</button>
        </form>
      </nav>

      <div className={isLoggedIn ? "main-app opacity" : "main-app"}>
        <div className="balance">
          <div>
            <p className="balance__label">Current balance</p>
            <p className="balance__date">As of {dateHandler()}</p>
          </div>
          {isLoggedIn && calcBalance(currentUserAccount)}
        </div>
        {isLoggedIn && (
          <div className="movements">
            {displayMovements(currentUserAccount)}
          </div>
        )}
        <div className="summary">
          <p className="summary__label">In</p>
          <p className="summary__value summary__value--in">{`${incomes}`}</p>
          <p className="summary__label">Out</p>
          <p className="summary__value summary__value--out">{`${outcomes}`}</p>
          <p className="summary__label">Interest</p>
          <p className="summary__value summary__value--interest">{`${interest}`}</p>
          <button className="btn--sort" onClick={(e) => sorting(e)}>
            &darr; SORT
          </button>
        </div>
        <div className="operation operation--transfer">
          <h2>Transfer money</h2>
          {isLoggedIn && (
            <form className="form form--transfer">
              <input
                type="text"
                className="form__input form__input--to"
                ref={transferToRef}
              />
              <input
                type="number"
                className="form__input form__input--amount"
                ref={transferAmountRef}
              />
              <button
                className="form__btn form__btn--transfer"
                onClick={(e) => transferAmountHandler(e)}
              >
                &rarr;
              </button>
              <label className="form__label">Transfer to</label>
              <label className="form__label">Amount</label>
            </form>
          )}
        </div>
        <div className="operation operation--loan">
          <h2>Request loan</h2>
          <form className="form form--loan">
            <input
              type="number"
              className="form__input form__input--loan-amount"
              ref={loanAmountRef}
            />
            <button
              className="form__btn form__btn--loan"
              onClick={(e) => requestLoanHandler(e)}
            >
              &rarr;
            </button>
            <label className="form__label form__label--loan">Amount</label>
          </form>
        </div>
        <div className="operation operation--close">
          <h2>Close account</h2>
          <form className="form form--close">
            <input
              type="text"
              className="form__input form__input--user"
              ref={userName}
            />
            <input
              type="password"
              maxlength="6"
              className="form__input form__input--pin"
              ref={userPwd}
            />
            <button
              className="form__btn form__btn--close"
              onClick={(e) => closeAccountHandler(e)}
            >
              &rarr;
            </button>
            <label className="form__label">Confirm user</label>
            <label className="form__label">Confirm PIN</label>
          </form>
        </div>
        {timer()}
      </div>
    </div>
  );
}

export default App;
