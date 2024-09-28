import React, { useState, useEffect } from "react";
import ButtonTop from "./components/ButtonTop";
import Inputs from "./components/Inputs";
import TimeandLocation from "./components/TimeandLocation";
import TempandDetail from "./components/TempandDetail";
import Forecast from "./components/Forecast";
import getCityWeatherData, { fetchRegionCodes, getCitySuggestions } from "./services/weatherService";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);
  const [region, setRegion] = useState("Kab. Malang");
  const [units, setUnits] = useState("metric");
  const [suggestions, setSuggestions] = useState([]);
  const [regionCodes, setRegionCodes] = useState({ provinces: [], cities: [] });

  const convertToImperial = (data) => {
    return data.map((entry) => {
      return {
        ...entry,
        temperature: ((entry.temperature * 9) / 5 + 32).toFixed(),
      };
    });
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const fetchData = async () => {
    const regionName = region ? region : "lokasi saat ini";
    toast.info(`Mengambil data cuaca untuk ${capitalizeFirstLetter(regionName)}`);

    const data = await getCityWeatherData(region);

    if (units === "imperial") {
      setWeatherData(convertToImperial(data.currentWeather));
      setDailyForecast(convertToImperial(data.dailyForecast));
    } else {
      setWeatherData(data.currentWeather);
      setDailyForecast(data.dailyForecast);
    }
    toast.success(`Mengambil data cuaca untuk ${regionName}`);
  };

  useEffect(() => {
    fetchData();
  }, [region, units]);

  useEffect(() => {
    const regionCodes = fetchRegionCodes();
    setRegionCodes(regionCodes);
  }, []);

  const handleInputChange = (input) => {
    if (input.length > 2) {
      const citySuggestions = getCitySuggestions(input, regionCodes);
      setSuggestions(citySuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const formatBackground = () => {
    if (!weatherData) return "from-cyan-600 to-blue-700";
    const threshold = units === "metric" ? 23 : 73;
    if (weatherData[0].temperature <= threshold) return "from-cyan-600 to-blue-700";
    return "from-yellow-600 to-orange-700";
  };

  return (
    <div className={`mx-auto py-5 px-5 sm:px-10 md:px-20 bg-gradient-to-br shadow-xl shadow-gray-400 ${formatBackground()}`}>
      <ButtonTop setRegion={setRegion} />
      <Inputs setRegion={setRegion} setUnits={setUnits} onInputChange={handleInputChange} suggestions={suggestions} setSuggestions={setSuggestions} />

      {weatherData && (
        <>
          <TimeandLocation weatherData={weatherData} />
          <TempandDetail weatherData={weatherData} units={units} />
          <Forecast title="3 hour step forecast" data={weatherData} />
          <Forecast title="daily forecast" data={dailyForecast} />
        </>
      )}

      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored" />
      <footer className="mt-8 text-center text-white text-sm">
        <hr className="w-1/3 mx-auto my-1" />
        <p>
          Data powered by{" "}
          <a href="https://data.bmkg.go.id/" target="_blank" rel="noopener noreferrer" className=" underline">
            BMKG
          </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
