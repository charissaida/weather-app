import React, { useState } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

const Inputs = ({ setRegion, setUnits, onInputChange, suggestions, setSuggestions }) => {
  const [location, setLocation] = useState("");

  const handleSearchClick = () => {
    if (location !== "") {
      setRegion(location);
      setLocation("");
      setSuggestions([]);
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`);
          const data = await response.json();

          if (data.locality) {
            setRegion(data.locality);
            setSuggestions([]);
          } else {
            alert("Tidak dapat menemukan lokasi berdasarkan koordinat ini.");
          }
        } catch (error) {
          console.error("Error fetching reverse geocoding:", error);
          alert("Gagal mendapatkan lokasi dari koordinat.");
        }
      });
    }
  };

  const handleInputChange = (e) => {
    setLocation(e.currentTarget.value);
    onInputChange(e.currentTarget.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setRegion(suggestion);
    setLocation("");
    setSuggestions([]);
  };

  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
        <input value={location} onChange={handleInputChange} type="text" placeholder="search by city..." className="text-gray-500 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none placeholder:lowercase" />
        <BiSearch size={50} className="cursor-pointer transition ease-out hover:scale-125" onClick={handleSearchClick} />
        <BiCurrentLocation size={50} className="cursor-pointer transition ease-out hover:scale-125" onClick={handleLocationClick} />
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute w-7/12 mt-12 bg-white text-gray-500 shadow-lg rounded-lg z-10">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="p-2 cursor-pointer hover:bg-gray-200 rounded-lg" onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-row w-1/4 items-center justify-center">
        <button className="text-2xl font-medium transition ease-out hover:scale-125" onClick={() => setUnits("metric")}>
          °C
        </button>
        <p className="text-2xl font-medium mx-1">|</p>
        <button className="text-2xl font-medium transition ease-out hover:scale-125" onClick={() => setUnits("imperial")}>
          °F
        </button>
      </div>
    </div>
  );
};

export default Inputs;
