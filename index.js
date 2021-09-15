const weatherApiBaseUrl = "http://api.weatherapi.com/v1";
const weatherApiKey = "29dea821b02e4088a1712806211409";
const cityName = "San Francisco";

const fitQuotesBaseUrl = 'https://type.fit/api/quotes';

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const init = () => {
  // grab all necessary html elements
  const submitTaskFormTag = document.querySelector("#task-submit-btn");
  const toDoListTag = document.querySelector("#to-do-list");
  const createToDoInput = document.querySelector('#task-input-box')
  const dayOfMonthTag = document.querySelector('#day-of-month');
  const monthTag = document.querySelector('#month');
  const holidayTag = document.querySelector('#holiday');

  const submitNewTaskHandler = (event) => {
    // prevent page refreshing
    event.preventDefault();

    // create a div tag with the class of to-do-wrapper // parent tag
    // create a svg tag with the class of to-do-icon // children/siblings
    //create a p tag with the class of to-do-text // children/siblings
    const toDoItemDiv = document.createElement("div");
    toDoItemDiv.className = "to-do-wrapper";
    toDoItemDiv.innerHTML = `<img src='./icons/not-checked.svg' class="to-do-icon"/> 
                             <p class="to-do-text">${createToDoInput.value}</p>`;
    toDoListTag.appendChild(toDoItemDiv);

    toDoItemDiv.addEventListener("click", () => {
    toDoItemDiv.childNodes[0].src='./icons/checked.svg'
    toDoItemDiv.childNodes[2].style.textDecoration = "line-through"
    });

    // clear out user inputs
    createToDoInput.value='';
  };

  submitTaskFormTag.addEventListener("click", submitNewTaskHandler);

  // create a date instance using the Date contructor function
  const date = new Date();
  const dayOfMonth = date.getDate();
  const month = months[date.getMonth()];

  // set innerText to dayOfMonth and month
  dayOfMonthTag.innerText = dayOfMonth; 
  monthTag.innerText = month;

  // function to render weather info
  const renderWeather = (weatherDataObj) => { 
    
    const weatherIconTag = document.querySelector('#weather-icon');
    weatherIconTag.src = `http:${weatherDataObj.current.condition.icon}`;
    // grab temperature tag and set its innerText
    const tempTag = document.querySelector("#temp");
    tempTag.innerText = Math.round(weatherDataObj.current.temp_f) + "°F";
    
    // save temperature condition into variable
    // const tempCondition = weatherDataObj.current.condition.text;
  };

  // fetch weather data when page first loads
  // http://api.weatherapi.com/v1/current.json?key=29dea821b02e4088a1712806211409&q=San Francisco&aqi=no
  fetch(`${weatherApiBaseUrl}/current.json?key=${weatherApiKey}&q=${cityName}&aqi=no`)
  .then(response => response.json())
  .then(json => renderWeather(json));

  // define renderQuote
  const renderQuote = randomQuoteObj => {
    // save quote text and author into variables
    const quoteText = randomQuoteObj.text;
    const quoteAuthor = randomQuoteObj.author || 'Unknown';

    // grab quote elements and set innerText
    const quoteTextTag = document.querySelector('#quote-text');
    const quoteAuthorTag = document.querySelector('#quote-author');
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
