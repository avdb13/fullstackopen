import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const SearchBar = ({ query, handleQuery }) => {
  return (
    <div>
      find countries <input value={query} onChange={handleQuery} />
    </div>
  )
}

const Information = ({ info }) => {
  if (!info) {
    return null
  }

  const { name, capital, area, languages, flag, weather } = info
  const src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`

  return (
    <>
      <div>
        <h1>{name} {flag}</h1>
        <p>capital: {capital}</p>
        <p>area: {area}m2</p>
      </div>
      <div>
        <h2>languages:</h2>
        <ul>
          {languages.map(lang => <li key={lang}>{lang}</li>)}
        </ul>
      </div>
      <div>
        <h2>weather in {name}</h2>
        <p>temperature: {weather.temp}°C</p>
        <p>wind: {weather.wind}m/s</p>
        <img src={src} alt="weather icon" />
      </div>
    </>
  )
}

const List = ({ countries, setCountry }) => {
  if (!countries) {
    return null
  }

  if (countries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else {
    return (
      <ul>
        {countries.map(country => (
          <li key={country}>
            {country}
            <button onClick={() => setCountry(country)}>show</button>
          </li>
        ))}
      </ul>
    )
  }

}

function App() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState(null)
  const [info, setInfo] = useState(null)

  const filteredCountries = countries.filter(name => name.startsWith(query.toLowerCase()))
  const handleQuery = (event) => setQuery(event.target.value)

  useEffect(() => {
    countryService
      .getAll()
      .then(countries => {
        setCountries(countries)
      })
  }, [])

  useEffect(() => {
    if (!country) {
      return
    }

    countryService
      .getCountry(country)
      .then(info => {
        weatherService
          .getWeather(info.capital)
          .then(weather => {
            const ok = {...info, weather}
            console.log(ok)
            setInfo(ok)
          })
      })
  }, [country])

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setCountry(filteredCountries[0])
    }
  }, [filteredCountries])


  return (
    <div>
      <SearchBar query={query} handleQuery={handleQuery} />
      <List countries={filteredCountries} setCountry={setCountry} />
      <Information info={info} />
    </div>
  )
}

export default App
