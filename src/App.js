import "./App.css";
import { readWeatherData } from "./utils/api";
import { useEffect, useState } from "react";

function App() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    readWeatherData().then(setWeather);
    return () => abortController.abort();
  }, []);

  // Can be tweaked to return either Celsius or Fahrenheit but currently returns Fahrenheit
  function convertTemperature(kelvin) {
    const celsius = Math.round(kelvin - 273);
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}\u00b0F`;
  }

  let day0 = null,
    day0High = null,
    day0Low = null,
    day0Image = null,
    followingDays = null;
  if (weather) {
    const dailies = [...weather.daily];
    dailies.shift();
    dailies.splice(4);
    day0 = new Date(weather.daily[0].dt * 1000).toDateString().substr(0, 3);
    day0High = convertTemperature(weather.daily[0].temp.max);
    day0Low = convertTemperature(weather.daily[0].temp.min);
    day0Image = `http://openweathermap.org/img/wn/${weather.daily[0].weather[0].icon}@2x.png`;
    followingDays = dailies.map((daily, index) => {
      const day = new Date(daily.dt * 1000).toDateString().substr(0, 3);
      const dayHigh = convertTemperature(daily.temp.max);
      const dayLow = convertTemperature(daily.temp.min);
      const dayImage = `http://openweathermap.org/img/wn/${daily.weather[0].icon}@2x.png`;
      return (
        <div key={index} className="card card-fixedWidth cardGroup_card">
          <div className="card_description cardGroup_cardDescription">
            <div className="card_descriptionText grayText">
              <p>{day}</p>
            </div>
            <div className="card_descriptionIcon">
              <img src={dayImage} alt="weather" />
            </div>
          </div>
          <div className="card_temperatures">
            <p>{dayHigh}</p>
            <p className="grayText">{dayLow}</p>
          </div>
        </div>
      );
    });
  }

  return (
    <main className="cardGroup">
      <div className="card card-fixedWidth cardGroup_card">
        <div className="card_description">
          <div className="card_descriptionText grayText">
            <p>{day0}</p>
          </div>
          <div className="card_descriptionIcon">
            <img src={day0Image} alt="weather" />
          </div>
        </div>
        <div className="card_temperatures">
          <p>{day0High}</p>
          <p className="grayText">{day0Low}</p>
        </div>
      </div>
      {followingDays}
    </main>
  );
}

export default App;
