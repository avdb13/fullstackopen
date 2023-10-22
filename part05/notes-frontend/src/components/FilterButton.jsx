import PropTypes from 'prop-types'

const FilterButton = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
}

FilterButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
}

export default FilterButton
