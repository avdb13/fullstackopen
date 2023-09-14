const reverse = require("../utils/for_testing").reverse;

test("reverse of react", () => expect(reverse("react")).toBe("tcaer"));
test("reverse of releveler", () =>
  expect(reverse("releveler")).toBe("releveler"));
