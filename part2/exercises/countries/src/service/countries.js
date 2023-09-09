import axios from "axios"

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const getAll = () => axios
    .get(`${baseUrl}/all`)
    .then(response => response.data)
    .then(data => data.map(data => data.name.common.toLowerCase()))

const getCountry = (country) => axios
    .get(`${baseUrl}/name/${country}`)
    .then(response => {
        const data = response.data
        
        return {
            name: data.name.common,
            capital: data.capital[0],
            area: data.area,
            languages: Object.values(data.languages),
            flag: data.flag
        } 
    })

export default { getAll, getCountry }