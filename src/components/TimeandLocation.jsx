import React from "react";

const TimeandLocation = ({ weatherData }) => {
  const firstWeather = weatherData[0];

  return (
    <div>
      <div className="flex items-center justify-center my-6">
        <p className="text-xl font-extralight">{firstWeather.currentTime}</p>
      </div>

      <div className="flex items-center justify-center my-3">
        <p className="text-3xl font-medium">
          {firstWeather.kotkab}, {firstWeather.provinsi}
        </p>
      </div>
    </div>
  );
};

export default TimeandLocation;
