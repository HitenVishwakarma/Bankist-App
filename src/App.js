import { useEffect, useRef, useState } from "react";
import "./App.css";
import logo from "./images/logo.png";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
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
  // const [userNameRef, setUserName] = useState("");
  // const [userPwdRef, setUserPwd] = useState("");
  const [unIsValid, setUnIsValid] = useState(false);
  const [pinIsValid, setPinIsValid] = useState(false);
  const [message, setMessage] = useState("Log in to get started");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserAccount, setcurrentUserAccount] = useState({});

  const userNameRef = useRef();
  const userPwdRef = useRef();

  useEffect(() => {
    if (isLoggedIn) {
      calcDisplaySummary(currentUserAccount.movements);
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

  const displayMovements = (movements) =>
    movements.map((mov, i) => {
      const type = mov > 0 ? "deposit" : "withdrawal";
      return (
        <div className="movements__row">
          <div className={`movements__type movements__type--${type}`}>
            {`${i + 1} ${type}`}
          </div>
          <div className="movements__value">{mov}</div>
        </div>
      );
    });

  const calcBalance = (movements) => {
    const balance = movements.reduce((acc, mov) => acc + mov, 0);
    return <p className="balance__value">{balance}€</p>;
  };

  const calcDisplaySummary = (movements) => {
    const calcIncomes = movements
      .filter((mov) => mov > 0)
      .reduce((acc, mov) => acc + mov, 0);
    setIncomes(calcIncomes);

    const calcOutcomes = Math.abs(
      movements.filter((mov) => mov < 0).reduce((acc, mov) => acc + mov, 0)
    );
    setOutcomes(calcOutcomes);

    const calcInterest = movements
      .filter((mov) => mov > 0)
      .map((dep) => (dep * 1.2) / 100)
      .filter((int, i, arr) => {
        console.log(arr);
        return int >= 1;
      })
      .reduce((acc, int) => acc + int, 0);
    setInterest(calcInterest);
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    const userName = userNameRef.current.value;
    const userPwd = userPwdRef.current.value;
    const validateUser = accounts.find((un) => un.userName === userName);
    console.log("validateUser", validateUser);
    setcurrentUserAccount(validateUser);
    if (validateUser?.pin === Number(userPwd)) {
      // Display UI and Message
      setMessage(`Welcome back, ${validateUser.owner}`);
      setIsLoggedIn(true);
    }
    userNameRef.current.value = "";
    userPwdRef.current.value = "";
    userPwdRef.current.blur();
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

      <div className={isLoggedIn ? "main-app-show" : "main-app"}>
        <div className="balance">
          <div>
            <p className="balance__label">Current balance</p>
            <p className="balance__date">
              As of <span className="date">05/03/2037</span>
            </p>
          </div>
          {isLoggedIn && calcBalance(currentUserAccount.movements)}
        </div>
        {isLoggedIn && (
          <div className="movements">
            {displayMovements(currentUserAccount.movements)}
          </div>
        )}
        <div className="summary">
          <p className="summary__label">In</p>
          <p className="summary__value summary__value--in">{`${incomes}€`}</p>
          <p className="summary__label">Out</p>
          <p className="summary__value summary__value--out">{`${outcomes}€`}</p>
          <p className="summary__label">Interest</p>
          <p className="summary__value summary__value--interest">{`${interest}€`}</p>
          <button className="btn--sort">&downarrow; SORT</button>
        </div>
        <div className="operation operation--transfer">
          <h2>Transfer money</h2>
          <form className="form form--transfer">
            <input type="text" className="form__input form__input--to" />
            <input type="number" className="form__input form__input--amount" />
            <button className="form__btn form__btn--transfer">&rarr;</button>
            <label className="form__label">Transfer to</label>
            <label className="form__label">Amount</label>
          </form>
        </div>
        <div className="operation operation--loan">
          <h2>Request loan</h2>
          <form className="form form--loan">
            <input
              type="number"
              className="form__input form__input--loan-amount"
            />
            <button className="form__btn form__btn--loan">&rarr;</button>
            <label className="form__label form__label--loan">Amount</label>
          </form>
        </div>
        <div className="operation operation--close">
          <h2>Close account</h2>
          <form className="form form--close">
            <input type="text" className="form__input form__input--user" />
            <input
              type="password"
              maxlength="6"
              className="form__input form__input--pin"
            />
            <button className="form__btn form__btn--close">&rarr;</button>
            <label className="form__label">Confirm user</label>
            <label className="form__label">Confirm PIN</label>
          </form>
        </div>
        <p className="logout-timer">
          You will be logged out in <span className="timer">05:00</span>
        </p>
      </div>
    </div>
  );
}

export default App;
