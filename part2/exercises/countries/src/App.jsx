import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'

const Information = ({ info }) => {
  if (!info) {
    return null
  }

  const { name, capital, area, languages, flag, coordinates } = info

  return (
    <>
      <div>
        <h1>{name} {flag}</h1>
        <p>capital: {capital} {coordinates}</p>
        <p>area: {area}m2</p>
      </div>
      <div>
        <h2>languages:</h2>
        <ul>
          {languages.map(lang => <li key={lang}>{lang}</li>)}
        </ul>
      </div>
    </>
  )
}

const List = ({ query, countries, setCountry }) => {
  if (!countries) {
    return null
  }

  const filteredCountries = countries.filter(name => name.startsWith(query.toLowerCase()))

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setCountry(filteredCountries[0])
    }
  }, [filteredCountries])

  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else {
    return (
      <ul>
        {filteredCountries.map(country => (
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
  const [countries, setCountries] = useState(null)
  const [country, setCountry] = useState(null)
  const [info, setInfo] = useState(null)

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
          .getCoordinates(info.capital).then(coordinates => {
            setInfo({...info, coordinates})
        })
      })
  }, [])

  const handleQuery = (event) => setQuery(event.target.value)

  return (
    <div>
      <div>
        find countries <input value={query} onChange={handleQuery} />
      </div>
      <List query={query} countries={countries} setCountry={setCountry} />
      <Information info={info} />
    </div>
  )
}

export default App
