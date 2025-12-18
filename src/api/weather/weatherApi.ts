import axios from "axios";

export async function getWeatherByCoords(lat?: number, lon?: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=sunset,sunrise,temperature_2m_max,temperature_2m_min,weather_code,wind_gusts_10m_max,uv_index_max&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,showers,rain,dew_point_2m&current=is_day,rain,temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto&hourly=pressure_msl,surface_pressure&hourly=visibility`;

    const response = await axios.get(url);
    return response.data;
}