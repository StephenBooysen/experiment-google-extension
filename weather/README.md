# Weather Extension

A beautiful Chrome extension that displays current weather and 7-day forecast with a glassmorphism design.

## Features

- Store and remember your favorite city
- Current weather display with temperature, description, and details
- 7-day weather forecast
- Beautiful glassmorphism UI design
- Responsive and user-friendly interface

## Setup Instructions

1. **Get OpenWeatherMap API Key**
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your free API key
   - Replace `your_openweather_api_key_here` in `popup.js` with your actual API key

2. **Install the Extension**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `weather` folder

3. **Use the Extension**
   - Click the extension icon in your browser toolbar
   - Enter a city name and click "Save"
   - View current weather and 7-day forecast

## Files Structure

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup interface
- `popup.css` - Glassmorphism styling
- `popup.js` - Weather API integration and functionality
- `README.md` - This file

## API Usage

This extension uses the OpenWeatherMap API to fetch weather data. You'll need to:

1. Create a free account at openweathermap.org
2. Generate an API key
3. Replace the placeholder in popup.js with your actual API key

## Permissions

The extension requires:
- `storage` - To save your preferred city
- `activeTab` - For basic extension functionality
- `https://api.openweathermap.org/*` - To fetch weather data