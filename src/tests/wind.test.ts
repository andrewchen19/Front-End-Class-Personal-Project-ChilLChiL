import { changeWindName } from "../utils";

test("change wind's name", () => {
  expect(changeWindName("Offshore")).toBe("陸風");
  expect(changeWindName("Onshore")).toBe("海風");
  expect(changeWindName("Cross-shore")).toBe("平行風");
});
