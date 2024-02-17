
import CurrentWeather from "./components/currentweather/CurrentWeather"
import { useState } from "react"
import Search from "./components/search/Search"
import Forecast from "./components/forecast/Forecast"

import { WEATHER_API_KEY, WEATHER_API_URL } from "./api"
import "./App.css"

function App() {
  
const [currentWeather, setCurrentWeather] = useState(null);
const [forecast, setForecast] = useState(null);
const handleOnSearchChange = (searchData) => {
  const [lat, lon] = searchData.value.split(" ");
  const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
  const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`)


  Promise.all([currentWeatherFetch, forecastFetch])
    .then(async (response) => {
      const weatherResponse = await response[0].json();
      const forecastResponse = await response[1].json();

      setCurrentWeather({ city: searchData.label, ...weatherResponse });
      console.log(currentWeather)
      setForecast({ city: searchData.label, ...forecastResponse })
    }).catch(console.log)
}

return (
  <>
    <div className="background">
      <div className="container">
        <Search onSearchChange={handleOnSearchChange} />
        {currentWeather && <CurrentWeather data={currentWeather} />}
        {forecast && <Forecast data={forecast} />}
      </div>
    </div>
  </>
)
}

export default App;
