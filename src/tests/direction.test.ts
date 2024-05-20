import { directionAbbreviation } from "../utils";

test("change degree to direction", () => {
  expect(directionAbbreviation(7)).toBe("北");
  expect(directionAbbreviation(13)).toBe("北北東");
  expect(directionAbbreviation(37)).toBe("東北");
  expect(directionAbbreviation(75)).toBe("東北東");
  expect(directionAbbreviation(110)).toBe("東南東");
  expect(directionAbbreviation(138)).toBe("東南");
  expect(directionAbbreviation(162)).toBe("南南東");
  expect(directionAbbreviation(183)).toBe("南");
  expect(directionAbbreviation(201)).toBe("南南西");
  expect(directionAbbreviation(222)).toBe("西南");
  expect(directionAbbreviation(238)).toBe("西南西");
  expect(directionAbbreviation(277)).toBe("西");
  expect(directionAbbreviation(299)).toBe("西北西");
  expect(directionAbbreviation(312)).toBe("西北");
  expect(directionAbbreviation(335)).toBe("北北西");
});
