export interface WeatherData {
  current_units: {
    time: string,
    interval: string,
    is_day: string,
    rain: string,
    temperature_2m: string,
    apparent_temperature: string,
    weather_code: string,
    wind_speed_10m: string,
    wind_direction_10m: string,
  },
  current: {
    time: string,
    interval: number,
    is_day: number,
    rain: number,
    temperature_2m: number,
    apparent_temperature: number,
    weather_code: number,
    wind_speed_10m: number,
    wind_direction_10m: number
  },
  daily: {
    time: string[],
    sunset: string[],
    sunrise: string[],
    temperature_2m_max: number[],
    temperature_2m_min: number[],
    weather_code: number[],
    wind_gusts_10m_max: number[],
    uv_index_max: number[]
  },
  hourly: {
    time: string[],
    temperature_2m: number[],
    relative_humidity_2m: number[],
    precipitation_probability: number[],
    showers: number[];
    rain: number[];
    dew_point_2m: number[];
    pressure_msl: number[];
    surface_pressure: number[];
    visibility: number[];
  }
  hourly_units: {
    time: string,
    temperature_2m: string,
    relative_humidity_2m: string,
    precipitation_probability: string,
    showers: string,
    rain: string,
    dew_point_2m: string
  },
}