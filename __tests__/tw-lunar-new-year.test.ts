import { isHoliday } from '../src';
import { addTwLunarNewYearEntries } from '../src/lunar-year';

describe('대만 설날 연휴 테스트', () => {
  const baseHolidaysMap: Record<string, string> = {};

  beforeAll(() => {
    addTwLunarNewYearEntries(baseHolidaysMap, 2025);
  });

  test('2025년 설날 연휴 기간', () => {
    // 2025년 설날은 1월 29일 (음력 1월 1일)
    // 연휴 기간: 1월 27일 ~ 1월 31일
    expect(isHoliday('tw', '2025-01-27')).toBe(true); // 설날 전 2일
    expect(isHoliday('tw', '2025-01-28')).toBe(true); // 설날 전 1일
    expect(isHoliday('tw', '2025-01-29')).toBe(true); // 설날 당일
    expect(isHoliday('tw', '2025-01-30')).toBe(true); // 설날 후 1일
    expect(isHoliday('tw', '2025-01-31')).toBe(true); // 설날 후 2일
  });

  test('2025년 설날 연휴가 아닌 날짜', () => {
    expect(isHoliday('tw', '2025-01-26')).toBe(false); // 설날 전 3일
    expect(isHoliday('tw', '2025-02-01')).toBe(false); // 설날 후 3일
  });

  test('2026년 설날 연휴 기간', () => {
    // 2026년 설날은 2월 17일 (음력 1월 1일)
    // 연휴 기간: 2월 15일 ~ 2월 19일
    expect(isHoliday('tw', '2026-02-15')).toBe(true); // 설날 전 2일
    expect(isHoliday('tw', '2026-02-16')).toBe(true); // 설날 전 1일
    expect(isHoliday('tw', '2026-02-17')).toBe(true); // 설날 당일
    expect(isHoliday('tw', '2026-02-18')).toBe(true); // 설날 후 1일
    expect(isHoliday('tw', '2026-02-19')).toBe(true); // 설날 후 2일
  });

  test('2026년 설날 연휴가 아닌 날짜', () => {
    expect(isHoliday('tw', '2026-02-14')).toBe(false); // 설날 전 3일
    expect(isHoliday('tw', '2026-02-20')).toBe(false); // 설날 후 3일
  });
}); 