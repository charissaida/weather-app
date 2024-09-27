import { DateTime } from "luxon";
import data from "../data/kodeWilayah.json";

const BASE_URL = "https://api.bmkg.go.id/publik/prakiraan-cuaca";

// Fungsi untuk memproses data wilayah dari JSON yang diimpor
const fetchRegionCodes = () => {
  const jsonData = data.Root.data;
  let regionCodes = {};

  jsonData.forEach((row) => {
    const { kode, wilayah } = row;
    regionCodes[wilayah.toLowerCase()] = kode;
  });
  return regionCodes;
};

// Fungsi untuk mendapatkan ID desa dari input wilayah
const getDesaIdFromRegion = (region, regionCodes) => {
  const wilayah = region
    .split(", ")
    .map((str) => str.trim())
    .shift()
    .toLowerCase();

  const desaCode = regionCodes[wilayah];

  if (desaCode) {
    return desaCode;
  } else {
    console.error(`Region not found: ${wilayah}`);
    return null;
  }
};

// Fungsi untuk mendapatkan data cuaca berdasarkan desaId
const getWeatherData = async (desaId) => {
  const url = `${BASE_URL}?adm4=${desaId}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return { error: error.message };
  }
};

// Fungsi untuk mendapatkan data sunrise dan sunset
const getSunriseSunset = async (latitude, longitude) => {
  try {
    const response = await fetch(`https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&timezone=Asia/Jakarta`);
    const {
      results: { sunrise, sunset },
    } = await response.json();
    const formatTime = (time) => time.split(":").slice(0, 2).join(":");

    return {
      sunrise: formatTime(sunrise),
      sunset: formatTime(sunset),
    };
  } catch (error) {
    console.error("Failed to fetch sunrise/sunset data:", error);
    return { sunrise: "Unknown", sunset: "Unknown" };
  }
};

// Fungsi untuk memformat data cuaca saat ini
const formatCurrent = async (data) => {
  const { lokasi, data: cuacaData } = data;
  const cuaca = cuacaData[0].cuaca.flat();

  const now = DateTime.now().setZone("Asia/Jakarta");

  const currentWeatherIndex = cuaca.findIndex((weather) => {
    const weatherTime = DateTime.fromISO(weather.datetime).setZone("Asia/Jakarta");
    return weatherTime >= now;
  });

  const weatherEntries = cuaca.slice(currentWeatherIndex, currentWeatherIndex + 5);
  const { sunrise, sunset } = await getSunriseSunset(lokasi.lat, lokasi.lon);

  const formattedWeatherEntries = weatherEntries.map((currentWeather) => {
    return {
      coordinate: `${lokasi.lon}, ${lokasi.lat}`,
      latitude: lokasi.lat,
      longitude: lokasi.lon,
      desa: lokasi.desa,
      kecamatan: lokasi.kecamatan,
      kotkab: lokasi.kota,
      provinsi: lokasi.provinsi,
      humidity: currentWeather.hu,
      temperature: currentWeather.t,
      wind_speed: currentWeather.ws,
      visibilitas: currentWeather.vs_text,
      weather: currentWeather.weather_desc,
      weatherIconUrl: currentWeather.image,
      sunrise,
      sunset,
      localTime: DateTime.fromISO(currentWeather.datetime).setZone("Asia/Jakarta").setLocale("id").toFormat("cccc, dd LLLL yyyy' | Pukul 'HH:mm"),
      currentTime: DateTime.now().setZone("Asia/Jakarta").setLocale("id").toFormat("cccc, dd LLLL yyyy' | Pukul 'HH:mm"),
      time: DateTime.fromISO(currentWeather.datetime).setZone("Asia/Jakarta").setLocale("id").toFormat("HH:mm"),
    };
  });

  return formattedWeatherEntries;
};

// Fungsi untuk mendapatkan data cuaca dari nama wilayah
const getCityWeatherData = async (region) => {
  const regionCodes = fetchRegionCodes();
  const desaId = getDesaIdFromRegion(region, regionCodes);
  if (desaId) {
    const data = await getWeatherData(desaId);

    // Format data cuaca saat ini
    const currentWeather = await formatCurrent(data);

    // Fungsi untuk format daily forecast
    const formatDailyForecast = (data) => {
      const { lokasi, data: cuacaData } = data;
      const dailyForecasts = cuacaData[0].cuaca.flat();

      // Ambil array pertama dari setiap hari
      const uniqueDays = Array.from(new Set(dailyForecasts.map((forecast) => DateTime.fromISO(forecast.datetime).setZone("Asia/Jakarta").toFormat("cccc"))));

      return uniqueDays.map((time) => {
        const forecast = dailyForecasts.find((f) => DateTime.fromISO(f.datetime).setZone("Asia/Jakarta").toFormat("cccc") === time);
        return {
          time,
          temperature: forecast.t,
          weather: forecast.weather_desc,
          weatherIconUrl: forecast.image,
        };
      });
    };

    const dailyForecast = formatDailyForecast(data);

    return { currentWeather, dailyForecast };
  } else {
    return { error: "Region tidak ditemukan" };
  }
};

export default getCityWeatherData;
