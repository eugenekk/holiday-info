import { isHoliday, getHoliday, initializeHoliday } from "../src/utils";

test("5월 5일은 어린이날", async () => {
  // 한 번만
  await initializeHoliday("kr", 2025);
  const flag = isHoliday("2025-05-05");
  expect(flag).toBe(true);

  const name = getHoliday("2025-05-05");
  expect(name).toBe("어린이날");
});

test("5월 4일은 공휴일 아님", async () => {
  await initializeHoliday("kr", 2025);
  const flag = isHoliday("2025-05-04");
  expect(flag).toBe(false);

  const name = getHoliday("2025-05-04");
  expect(name).toBeNull();
});