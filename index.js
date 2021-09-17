const dailyTasksUrl = "http://localhost:3000/tasks";

const weatherApiBaseUrl = "http://api.weatherapi.com/v1";
const weatherApiKey = "29dea821b02e4088a1712806211409";
const cityName = "San Francisco";

const fitQuotesBaseUrl = "https://type.fit/api/quotes";

const holidayApiBaseUrl = "https://holidayapi.com/v1/holidays";
const holidayApiKey = "92d100ea-4e77-4b45-b28a-682473508999";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const init = () => {
  // grab all necessary html elements
  const submitTaskFormTag = document.querySelector("#task-submit-btn");
  const toDoListTag = document.querySelector("#to-do-list");
  const createToDoInput = document.querySelector("#task-input-box");
  const dayOfMonthTag = document.querySelector("#day-of-month");
  const monthTag = document.querySelector("#month");
  const holidayTag = document.querySelector("#holiday");
  const tempFTag = document.querySelector("#f-temp");
  const tempCTag = document.querySelector("#c-temp");

  // function to request server to update the completion status of a task
  const updateTaskCompletionStatusToServer = (taskObj) => {
    const configObj = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(taskObj)
    };

    // PATCH /tasks/:id
    fetch(`${dailyTasksUrl}/${taskObj.id}`, configObj)
      .then(response => response.json())
      .then(json => console.log(json));
  };

  // function to render a single daily task that is persisting in db.json
  const renderSingleTask = singleTaskObj => {
    // create a div tag with the class of to-do-wrapper // parent tag
    // create a img tag with the class of to-do-icon // children/siblings
    // create a p tag with the class of to-do-text // children/siblings
    const toDoItemDiv = document.createElement("div");
    toDoItemDiv.className = "to-do-wrapper";
    toDoItemDiv.innerHTML = `<img src='${singleTaskObj.image}' class="to-do-icon"/>
                             <p class="to-do-text">${singleTaskObj.name}</p>`;
    toDoListTag.appendChild(toDoItemDiv);

    // change textDecoration of to-do-text based on if the task is checked off or not in db.json
    if (singleTaskObj.image === './icons/checked.svg') {
      toDoItemDiv.childNodes[2].style.textDecoration = "line-through";
    }

    toDoItemDiv.addEventListener("click", () => {
      toDoItemDiv.childNodes[0].src = "./icons/checked.svg";
      toDoItemDiv.childNodes[2].style.textDecoration = "line-through";
      singleTaskObj.image = './icons/checked.svg';
      updateTaskCompletionStatusToServer(singleTaskObj);
    });
  };

  // fetch daily tasks that are persisting in db.json
  fetch(dailyTasksUrl)
    .then(response => response.json())
    .then(json => {
      json.forEach(taskObj => renderSingleTask(taskObj));
    });

  // function to submit a new task
  const submitNewTaskHandler = (event) => {
    // prevent page refreshing
    event.preventDefault();

    // create a div tag with the class of to-do-wrapper // parent tag
    // create a img tag with the class of to-do-icon // children/siblings
    // create a p tag with the class of to-do-text // children/siblings
    const toDoItemDiv = document.createElement("div");
    toDoItemDiv.className = "to-do-wrapper";
    toDoItemDiv.innerHTML = `<img src='./icons/not-checked.svg' class="to-do-icon"/> 
                             <p class="to-do-text">${createToDoInput.value}</p>`;
    toDoListTag.appendChild(toDoItemDiv);

    toDoItemDiv.addEventListener("click", () => {
      toDoItemDiv.childNodes[0].src = "./icons/checked.svg";
      toDoItemDiv.childNodes[2].style.textDecoration = "line-through";
    });

    // optimistic rendering: render in DOM first, then request server

    // payload data
    const formData = {
      name: createToDoInput.value,
      image: './icons/not-checked.svg'
    };

    // 2nd argument passing into the fetch method
    const configObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(formData)
    };

    // sending POST request to /tasks
    fetch(dailyTasksUrl, configObj)
      .then(response => response.json())
      .then(json => {
        console.log(json);
        toDoItemDiv.addEventListener('click', () => {
          json.image = './icons/checked.svg';
          updateTaskCompletionStatusToServer(json);
        });
      });

    // clear out user inputs
    createToDoInput.value = "";
  };

  // add event listener on the form element to submit a new task
  submitTaskFormTag.addEventListener("click", event => {
    // submit new task only if submission if NOT empty
    if (event.target.previousElementSibling.value !== '') {
      submitNewTaskHandler(event);
    }
  });

  // add event listener on the text input box, NOT the form tag
  createToDoInput.addEventListener('keydown', event => {
    // submit new task only if 'Enter' key is pressed and submission is NOT empty
    if (event.key === 'Enter' && event.target.value !== '') {
      submitNewTaskHandler(event);
    }
  });

  // create a date instance using the Date contructor function
  const date = new Date();
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];

  // set innerText to dayOfMonth and month
  dayOfMonthTag.innerText = dayOfMonth;
  monthTag.innerText = month;

  const renderCurrentHoliday = (holidaysObj) => {
    if (holidaysObj.holidays.length === 0) {
      holidayTag.innerText = "no holidays today";
    } else {
      holidayTag.innerText = holidaysObj.holidays[0].name;
    }
  };

  // Populate holiday
  // https://holidayapi.com/v1/holidays?pretty&key=92d100ea-4e77-4b45-b28a-682473508999&country=US&year=2020
  fetch(
    `${holidayApiBaseUrl}?pretty&key=${holidayApiKey}&country=US&year=2020&month=${date.getMonth() + 1
    }&day=${dayOfMonth}`
  )
    .then((response) => response.json())
    .then((json) => {
      renderCurrentHoliday(json);
    });

  // function to render weather info
  const renderWeather = (weatherDataObj) => {
    // grab weather icon tag and set its src
    const weatherIconTag = document.querySelector("#weather-icon");
    weatherIconTag.src = `http:${weatherDataObj.current.condition.icon}`;

    // grab temperature tag and set its innerText
    const tempTag = document.querySelector("#temp");
    tempTag.innerText = Math.round(weatherDataObj.current.temp_f);

    // function to convert Celsius to Fahrenheit
    const toggleCelsiusToFahrenheitHandler = () => {
      tempCTag.classList.remove("active");
      tempFTag.classList.add("active");
      tempTag.innerText = Math.round(weatherDataObj.current.temp_f);
    };

    // function to convert Fahrenheit to Celsius
    const toggleFahrenheitToCelsiusHandler = () => {
      tempFTag.classList.remove("active");
      tempCTag.classList.add("active");
      tempTag.innerText = Math.round(weatherDataObj.current.temp_c);
    };

    // add event listeners to °F and °C
    tempFTag.addEventListener("click", toggleCelsiusToFahrenheitHandler);
    tempCTag.addEventListener("click", toggleFahrenheitToCelsiusHandler);
  };

  // fetch weather data when page first loads
  // http://api.weatherapi.com/v1/current.json?key=29dea821b02e4088a1712806211409&q=San Francisco&aqi=no
  fetch(
    `${weatherApiBaseUrl}/current.json?key=${weatherApiKey}&q=${cityName}&aqi=no`
  )
    .then((response) => response.json())
    .then((json) => renderWeather(json));

  // define renderQuote
  const renderQuote = (randomQuoteObj) => {
    // save quote text and author into variables
    const quoteText = randomQuoteObj.text;
    const quoteAuthor = randomQuoteObj.author || "Unknown";

    // grab quote elements and set innerText
    const quoteTextTag = document.querySelector("#quote-text");
    const quoteAuthorTag = document.querySelector("#quote-author");
    quoteTextTag.innerText = `"${quoteText}"`;
    quoteAuthorTag.innerText = quoteAuthor;
  };

  // fetch quotes data
  fetch(fitQuotesBaseUrl)
    .then((response) => response.json())
    .then((json) => {
      // generate a random number between min inclusive and max exclusive
      const randomIndex = Math.round(Math.random() * (1642 - 0));
      renderQuote(json[randomIndex]);
    });
};

document.addEventListener("DOMContentLoaded", init);
