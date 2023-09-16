const average = require("../utils/for_testing").average;

describe("average", () => {
  test("of a value itself", () => expect(average([5])).toBe(5));
  test("of many", () => expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5));
  test("of none", () => expect(average([])).toBe(0));
});
