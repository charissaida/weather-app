import React from "react";

const ButtonTop = ({ setRegion }) => {
  const cities = [
    {
      id: 1,
      name: "Kab. Malang",
    },
    {
      id: 2,
      name: "Kota Malang",
    },
    {
      id: 3,
      name: "Kota Surabaya",
    },
    {
      id: 4,
      name: "Kota Batu",
    },
    {
      id: 5,
      name: "Kota Bandung",
    },
  ];

  return (
    <div className="flex items-center justify-around my-6">
      {cities.map((city, index) => (
        <div key={city.id} className="flex items-center">
          <button className="text-lg font-medium hover:bg-gray-700/20 px-3 py-2 rounded-md transition ease-in" onClick={() => setRegion(city.name)}>
            {city.name}
          </button>
          {index < cities.length - 1 && <span className="mx-2">|</span>}
        </div>
      ))}
    </div>
  );
};

export default ButtonTop;
