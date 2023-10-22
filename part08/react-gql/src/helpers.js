export const updateCache = (cache, query, addedPerson) => {
  const uniqByName = (a) => {
    // const seen = new Set()
    // return a.filter((item) => seen.has(item.name) ? false : seen.add(item.name))
    return [...new Set(a.map(item => item.name))]
  }

  cache.updateQuery(query, ({ allPersons }) => {
    // making sure this actually does something
    console.log(allPersons.length, uniqByName(allPersons).length)
    return {
      allPersons: uniqByName([...allPersons, addedPerson])
    }
  })
}
