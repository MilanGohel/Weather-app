
import CurrentWeather from "./components/currentweather/CurrentWeather"
import { useState } from "react"
import Search from "./components/search/Search"
import Forecast from "./components/forecast/Forecast"

import { WEATHER_API_KEY, WEATHER_API_URL } from "./api"
import "./App.css"

function App() {
  
const [currentWeather, setCurrentWeather] = useState(null);
const [forecast, setForecast] = useState(null);

const handleOnSearchChange = (searchData, check) => {
  console.log(searchData)
  const [lat, lon] = searchData.value.split(" ");

  
  const currentCityFetch = fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=10&appid=4de442b569062270f14b292269d6bb4e`)

  const currentWeatherFetch = fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
  const forecastFetch = fetch(`${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`)
  
  Promise.all([currentWeatherFetch, forecastFetch, currentCityFetch])
  .then(async (response) => {
    const weatherResponse = await response[0].json();
    const forecastResponse = await response[1].json();
    const currentCityResponse = await response[2].json();
    console.log(currentCityResponse);
    if(!check){
      setCurrentWeather({ city: searchData.label, ...weatherResponse });
    }
    else{
      console.log(currentCityResponse[0])
      setCurrentWeather({ city: currentCityResponse[0].name, ...weatherResponse });
    }

    console.log(currentWeather)
    setForecast({ city: searchData.label, ...forecastResponse })
  }).catch(console.log)
}

  const handleLocation = (e) =>{
    e.preventDefault();
     navigator.geolocation.getCurrentPosition((data) => {
      const searchData = {value: data.coords.latitude + " " + data.coords.longitude}
      handleOnSearchChange(searchData, true);
     });
    // console.log(currLocation)
  }
return (
  <>
    <div className="background">
      <div className="container">
        <Search onSearchChange={handleOnSearchChange} />
        {currentWeather && <CurrentWeather data={currentWeather} />}
        {forecast && <Forecast data={forecast} />}
        <span style={{color: "black", margin: "4px",}}>OR</span><br></br>
        <button className="curr-weather" onClick={(e) => handleLocation(e)}>Get Your Current Weather</button>
        
      </div>
    </div>
  </>
)
}

export default App;
