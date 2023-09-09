import { useState, useEffect } from 'react'
import service from './service/countries'


const Information = ({ country }) => {
  if (!country) {
    return null
  }

  const { name, capital, area, languages, flag } = country

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
    </>
  )
}

const List = ({ query, countries }) => {
  const [country, setCountry] = useState(null)

  if (!countries) {
    return null
  }

  const filteredCountries =
    countries.filter(name => name.startsWith(query.toLowerCase()))

  if (filteredCountries.length === 1) {
    service.getCountry(filteredCountries[0]).then(country => setCountry(country))

    return (
      <Information country={country} />
    )
  } else if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  }

  return (
    <ul>
      {filteredCountries.map(country => <li key={country}>{country}</li>)}
    </ul>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [countries, setCountries] = useState(null)

  useEffect(() => {
    service
      .getAll()
      .then(countries => {
        setCountries(countries)
      })
  }, [])

  const handleQuery = (event) => setQuery(event.target.value)
  console.log(query)

  return (
    <div>
      <div>
        find countries <input value={query} onChange={handleQuery} />
      </div>
      <List query={query} countries={countries} />
    </div>
  )
}

export default App
