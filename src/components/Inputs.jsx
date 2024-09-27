import React, { useState, useEffect } from "react";
import { BiSearch, BiCurrentLocation } from "react-icons/bi";

const Inputs = ({ setRegion, setUnits }) => {
  const [location, setLocation] = useState("");

  const handleSearchClick = () => {
    if (location !== "") {
      setRegion(location);
      setLocation("");
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

  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
        <input
          value={location}
          onChange={(e) => setLocation(e.currentTarget.value)}
          type="text"
          placeholder="search by village..."
          className="text-gray-500 text-xl font-light p-2 w-full shadow-xl capitalize focus:outline-none placeholder:lowercase"
        />
        <BiSearch size={50} className="cursor-pointer transition ease-out hover:scale-125" onClick={handleSearchClick} />
        <BiCurrentLocation size={50} className="cursor-pointer transition ease-out hover:scale-125" onClick={handleLocationClick} />
      </div>

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
