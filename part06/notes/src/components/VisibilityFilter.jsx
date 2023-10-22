import { useDispatch } from 'react-redux'

const VisibilityFilter = () => {
  const dispatch = useDispatch()
  const filterSelected = (payload) =>
    dispatch({ type: 'filter/filterChange', payload })

  return (
    <div>
      <div>
        all{' '}
        <input
          type="radio"
          name="filter"
          onChange={() => filterSelected('ALL')}
        />
      </div>
      <div>
        important{' '}
        <input
          type="radio"
          name="filter"
          onChange={() => filterSelected('IMPORTANT')}
        />
      </div>
      <div>
        unimportant{' '}
        <input
          type="radio"
          name="filter"
          onChange={() => filterSelected('UNIMPORTANT')}
        />
      </div>
    </div>
  )
}

export default VisibilityFilter
