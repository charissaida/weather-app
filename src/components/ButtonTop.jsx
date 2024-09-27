import React from "react";

const ButtonTop = ({ setRegion }) => {
  const cities = [
    {
      id: 1,
      name: "Sitirejo",
    },
    {
      id: 2,
      name: "Jabung",
    },
    {
      id: 3,
      name: "Sukun",
    },
    {
      id: 4,
      name: "Kasin",
    },
    {
      id: 5,
      name: "Tlogomas",
    },
  ];

  return (
    <div className="flex items-center justify-around my-6">
      {cities.map((city) => (
        <button key={city.id} className="text-lg font-medium hover:bg-gray-700/20 px-3 py-2 rounded-md transition ease-in" onClick={() => setRegion(city.name)}>
          {city.name}
        </button>
      ))}
    </div>
  );
};

export default ButtonTop;
