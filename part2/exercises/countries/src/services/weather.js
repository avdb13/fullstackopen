import axios from "axios"

const baseApi = 'http://api.openweathermap.org'

const getCoordinates = (capital) => {
    const api_key = import.meta.env.VITE_WEATHER_KEY
    const path = `geo/1.0/direct?q=${capital}&limit=1&appid=${api_key}`

    return axios.get(`${baseApi}/${path}`)
        .then(resp => resp.data)
        .then(data => [data[0].lat, data[0].lon])
}

export default { getCoordinates }