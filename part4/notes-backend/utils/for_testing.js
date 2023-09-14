const reverse = (string) => string.split("").reverse().join("");
const average = (array) =>
  array.length === 0
    ? 0
    : array.reduce((acc, next) => (acc += next)) / array.length;

module.exports = {
  reverse,
  average,
};
