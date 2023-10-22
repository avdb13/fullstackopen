import axios from "axios"

const baseApi = 'http://api.openweathermap.org'
const api_key = import.meta.env.VITE_WEATHER_KEY

const getCoordinates = (capital) => {
  const path = `geo/1.0/direct?q=${capital}&limit=1&appid=${api_key}`

  return axios.get(`${baseApi}/${path}`)
    .then(resp => resp.data)
    .then(data => [data[0].lat, data[0].lon])
}

const getWeather = (capital) => {
  const weather = ([lat, lon]) => {
    const path = `data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`

    return axios.get(`${baseApi}/${path}`)
      .then(resp => resp.data)
      .then(data => {
        return {
          temp: data.main.temp,
          wind: data.wind.speed,
          icon: data.weather[0].icon
        }
      })
  }

  return getCoordinates(capital).then(coordinates => weather(coordinates))
}

export default { getWeather }
