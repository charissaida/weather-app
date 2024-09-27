const weatherCodeIndex = {
  0: "01d", //Cerah
  1: "02d", //Cerah Berawan
  2: "02d", //Cerah Berawan
  3: "03d", //Berawan
  4: "04d", //Berawan Tebal
  5: "50d", //Udara Kabur
  10: "50d", //Asap
  45: "50d", //Kabut
  60: "09d", //Hujan Ringan
  61: "10d", //Hujan Sedang
  63: "10d", //Hujan Lebat
  80: "10d", //Hujan Lokal
  95: "11d", //Hujan Petir
};

const weatherCode = (code) => {
  if (code >= 95) {
    return weatherCodeIndex[95];
  }

  if (code >= 80) {
    return weatherCodeIndex[80];
  }

  if (code >= 63) {
    return weatherCodeIndex[63];
  }

  if (code == 61 || code === 60) {
    return weatherCodeIndex[code];
  }

  if (code >= 45) {
    return weatherCodeIndex[45];
  }

  if (code >= 10) {
    return weatherCodeIndex[10];
  }

  if (code >= 5) {
    return weatherCodeIndex[5];
  }

  if (code >= 0) {
    return weatherCodeIndex[code];
  }

  return "";
};

export default weatherCode;
