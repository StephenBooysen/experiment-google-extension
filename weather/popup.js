// Weather Extension JavaScript
const API_KEY = '0005ded66b1cfd25048790667031a8b2'; // Replace with your actual API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM elements
const cityInput = document.getElementById('cityInput');
const saveButton = document.getElementById('saveCity');
const weatherContainer = document.getElementById('weatherContainer');
const forecastContainer = document.getElementById('forecastContainer');
const errorMessage = document.getElementById('errorMessage');

// Weather display elements
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const weatherIcon = document.getElementById('weatherIcon');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const forecastList = document.getElementById('forecastList');

// Initialize extension
document.addEventListener('DOMContentLoaded', function() {
    loadSavedCity();
    setupEventListeners();
});

function setupEventListeners() {
    saveButton.addEventListener('click', saveCity);
    cityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveCity();
        }
    });
}

// Load saved city from storage
function loadSavedCity() {
    chrome.storage.sync.get(['savedCity'], function(result) {
        if (result.savedCity) {
            cityInput.value = result.savedCity;
            getWeather(result.savedCity);
        }
    });
}

// Save city to storage
function saveCity() {
    const city = cityInput.value.trim();
    if (!city) {
        showError('Please enter a city name');
        return;
    }

    chrome.storage.sync.set({ savedCity: city }, function() {
        getWeather(city);
        hideError();
    });
}

// Get weather data
async function getWeather(city) {
    if (!city) return;

    try {
        // Get current weather
        const currentWeatherUrl = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const currentResponse = await fetch(currentWeatherUrl);
        
        if (!currentResponse.ok) {
            throw new Error('City not found');
        }
        
        const currentData = await currentResponse.json();
        displayCurrentWeather(currentData);

        // Get 7-day forecast
        const forecastUrl = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        
        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);
        }

        hideError();
    } catch (error) {
        showError('Unable to fetch weather data. Please check the city name and try again.');
        alert('Weather API Error:', error);
    }
}

// Display current weather
function displayCurrentWeather(data) {
    cityName.textContent = data.name;
    temperature.textContent = `${Math.round(data.main.temp)}°`;
    description.textContent = data.weather[0].description;
    
    // Weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    
    // Additional details
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
}

// Display 7-day forecast
function displayForecast(data) {
    forecastList.innerHTML = '';
    
    // Group forecast data by day (every 8th item for daily forecast)
    const dailyForecasts = [];
    for (let i = 0; i < data.list.length; i += 8) {
        dailyForecasts.push(data.list[i]);
    }
    
    // Limit to 7 days
    dailyForecasts.slice(0, 7).forEach(forecast => {
        const forecastItem = createForecastItem(forecast);
        forecastList.appendChild(forecastItem);
    });
}

// Create forecast item
function createForecastItem(forecast) {
    const date = new Date(forecast.dt * 1000);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    const item = document.createElement('div');
    item.className = 'forecast-item';
    
    item.innerHTML = `
        <span class="forecast-day">${dayName}</span>
        <img class="forecast-icon" src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
        <div class="forecast-temps">
            <span class="forecast-high">${Math.round(forecast.main.temp_max)}°</span>
            <span class="forecast-low">${Math.round(forecast.main.temp_min)}°</span>
        </div>
    `;
    
    return item;
}

// Show error message
function showError(message) {
    errorMessage.querySelector('p').textContent = message;
    errorMessage.style.display = 'block';
    weatherContainer.style.display = 'none';
    forecastContainer.style.display = 'none';
}

// Hide error message
function hideError() {
    errorMessage.style.display = 'none';
    weatherContainer.style.display = 'block';
    forecastContainer.style.display = 'block';
}