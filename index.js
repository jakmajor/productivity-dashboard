const weatherApiBaseUrl = 'http://api.weatherapi.com/v1';
const weatherApiKey = '29dea821b02e4088a1712806211409';
const cityName = 'Boston';

const fitQuotesBaseUrl = 'https://type.fit/api/quotes';

const init = () => {

  // grab all necessary html elements
  const submitTaskFormTag = document.querySelector('#submit-task-form');
  const toDoListTag = document.querySelector('#to-do-list');

  const submitNewTaskHandler = event => {
    // prevent page refreshing
    event.preventDefault();

    // create a div tag with the class of to-do-wrapper // parent tag 
    // create a svg tag with the class of to-do-icon // children/siblings
    // create a p tag with the class of to-do-text // children/siblings 
    const toDoItemDiv = document.createElement('div');
    toDoItemDiv.className = 'to-do-wrapper';
    toDoItemDiv.innerHTML = `<svg class="to-do-icon"></svg>
                             <p class="to-do-text">${event.target.children[0].value}</p>`;
    toDoListTag.appendChild(toDoItemDiv);

    // clear out user inputs
    submitTaskFormTag.reset();
  };

  submitTaskFormTag.addEventListener('submit', submitNewTaskHandler);



  const renderWeather = weatherDataObj => {
    // grab temperature tag and set its innerText
    const tempTag = document.querySelector('#temp');
    tempTag.innerText = Math.round(weatherDataObj.current.temp_f) + '°F';

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
    quoteTextTag.innerText = quoteText;
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



document.addEventListener('DOMContentLoaded', init);