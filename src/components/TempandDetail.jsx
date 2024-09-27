import React from "react";
import { FaThermometerEmpty } from "react-icons/fa";
import { BiSolidDropletHalf } from "react-icons/bi";
import { FiWind } from "react-icons/fi";
import { GiSunrise, GiSunset } from "react-icons/gi";
import { MdOutlineVisibility } from "react-icons/md";

const TempandDetail = ({ weatherData, units }) => {
  const firstWeather = weatherData[0];
  const verticalDetails = [
    {
      id: 1,
      Icon: FaThermometerEmpty,
      title: "Real Feel",
      value: `${firstWeather.temperature}°`,
    },
    {
      id: 2,
      Icon: BiSolidDropletHalf,
      title: "Humidity",
      value: `${firstWeather.humidity}%`,
    },
    {
      id: 3,
      Icon: FiWind,
      title: "Wind",
      value: `${firstWeather.wind_speed.toFixed()} km/h`,
    },
  ];
  const horizonalDetails = [
    {
      id: 1,
      Icon: GiSunrise,
      title: "Sunrise",
      value: `${firstWeather.sunrise} AM`,
    },
    {
      id: 2,
      Icon: GiSunset,
      title: "Sunset",
      value: `${firstWeather.sunset} PM`,
    },
    {
      id: 3,
      Icon: MdOutlineVisibility,
      title: "Visibilitas",
      value: `${firstWeather.visibilitas}`,
    },
  ];

  const formatBackground = () => {
    if (!firstWeather) return "text-cyan-300";
    const threshold = units === "metric" ? 23 : 73;
    return firstWeather.temperature <= threshold ? "text-cyan-300" : "text-yellow-300";
  };

  return (
    <div>
      <div className={`flex items-center justify-center py-6 text-xl ${formatBackground()}`}>
        <p>{firstWeather.weather}</p>
      </div>

      <div className="flex flex-row items-center justify-between py-3">
        <img src={firstWeather.weatherIconUrl} alt="weather icon" className="w-20" />
        <p className="text-5xl">{firstWeather.temperature}°</p>

        <div className="flex flex-col space-y-3 items-start">
          {verticalDetails.map(({ id, Icon, title, value }) => (
            <div key={id} className="flex font-light text-sm items-center justify-center">
              <Icon size={18} className="mr-1" />
              {title}: <span className="font-medium ml-1">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row items-center justify-center space-x-10 texsm py-3">
        {horizonalDetails.map(({ id, Icon, title, value }) => (
          <div key={id} className="flex flex-row items-center">
            <Icon size={30} />
            <p className="font-light ml-1">
              {title}: <span className="font-medium ml-1">{value}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TempandDetail;
