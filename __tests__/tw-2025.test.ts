import { isHoliday } from '../src';

describe('2025년 대만 공휴일 테스트', () => {
  // 1월 1일: 원단
  test('1월 1일 원단', () => {
    expect(isHoliday('tw', '2025-01-01')).toBe(true);
  });

  // 1월 25일 - 2월 2일: 춘절 연휴
  describe('춘절 연휴', () => {
    test('춘절 연휴 기간', () => {
      // 연휴 시작일
      expect(isHoliday('tw', '2025-01-27')).toBe(true);
      expect(isHoliday('tw', '2025-01-28')).toBe(true);
      expect(isHoliday('tw', '2025-01-29')).toBe(true);
      expect(isHoliday('tw', '2025-01-30')).toBe(true);
      expect(isHoliday('tw', '2025-01-31')).toBe(true); 
    });

    test('춘절 연휴가 아닌 날짜', () => {
      expect(isHoliday('tw', '2025-01-24')).toBe(false); // 연휴 시작 전
      expect(isHoliday('tw', '2025-02-03')).toBe(false); // 연휴 종료 후
    });
  });

  // 2월 28일: 평화기념일
  test('2월 28일 평화기념일', () => {
    expect(isHoliday('tw', '2025-02-28')).toBe(true);
  });

  // 4월 3일 - 4월 6일: 어린이날 및 청명절 연휴
  describe('어린이날 및 청명절 연휴', () => {
    test('어린이날 및 청명절 연휴 기간', () => {
      expect(isHoliday('tw', '2025-04-03')).toBe(true);
      expect(isHoliday('tw', '2025-04-04')).toBe(true);
    });

    test('어린이날 및 청명절 연휴가 아닌 날짜', () => {
      expect(isHoliday('tw', '2025-04-02')).toBe(false); // 연휴 시작 전
      expect(isHoliday('tw', '2025-04-07')).toBe(false); // 연휴 종료 후
    });
  });

  // 5월 1일: 노동절
  test('5월 1일 노동절', () => {
    expect(isHoliday('tw', '2025-05-01')).toBe(true);
  });

  // 5월 30일 - 6월 1일: 단오절 연휴
  describe('단오절 연휴', () => {
    test('단오절 연휴 기간', () => {
      expect(isHoliday('tw', '2025-05-30')).toBe(true);
      expect(isHoliday('tw', '2025-05-31')).toBe(true);
    });

    test('단오절 연휴가 아닌 날짜', () => {
      expect(isHoliday('tw', '2025-05-29')).toBe(false); // 연휴 시작 전
      expect(isHoliday('tw', '2025-06-02')).toBe(false); // 연휴 종료 후
    });
  });

  // 10월 4일 - 10월 6일: 중추절 연휴
  describe('중추절 연휴', () => {
    test('중추절 연휴 기간', () => {
      expect(isHoliday('tw', '2025-10-06')).toBe(true);
    });

    test('중추절 연휴가 아닌 날짜', () => {
      expect(isHoliday('tw', '2025-10-03')).toBe(false); // 연휴 시작 전
      expect(isHoliday('tw', '2025-10-07')).toBe(false); // 연휴 종료 후
    });
  });

  // 10월 10일 - 10월 12일: 쌍십절 연휴
  describe('쌍십절 연휴', () => {
    test('쌍십절 연휴 기간', () => {
      expect(isHoliday('tw', '2025-10-10')).toBe(true);
    });

    test('쌍십절 연휴가 아닌 날짜', () => {
      expect(isHoliday('tw', '2025-10-09')).toBe(false); // 연휴 시작 전
      expect(isHoliday('tw', '2025-10-13')).toBe(false); // 연휴 종료 후
    });
  });
}); 