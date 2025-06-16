import { isHoliday } from '../src/utils';

describe('Deepavali 테스트', () => {
  it('2024년 Deepavali는 10월 31일이다', () => {
    expect(isHoliday('sg', '2024-10-31')).toBe(true);
  });

  it('2025년 Deepavali는 10월 20일이다', () => {
    expect(isHoliday('sg', '2025-10-20')).toBe(true);
  });

  it('2026년 Deepavali는 11월 8일이다', () => {
    expect(isHoliday('sg', '2026-11-08')).toBe(true);
  });

  it('2026년 Deepavali는 11월 9일(대체)이다', () => {
    expect(isHoliday('sg', '2026-11-09')).toBe(true);
  });

  it('2027년 Deepavali는 10월 28일이다', () => {
    expect(isHoliday('sg', '2027-10-28')).toBe(true);
  });

  it('2028년 Deepavali는 10월 16일이다', () => {
    expect(isHoliday('sg', '2028-10-16')).toBe(true);
  });

  it('2029년 Deepavali는 11월 5일이다', () => {
    expect(isHoliday('sg', '2029-11-05')).toBe(true);
  });

  it('2030년 Deepavali는 10월 26일이다', () => {
    expect(isHoliday('sg', '2030-10-26')).toBe(true);
  });

  // 공휴일이 아닌 날짜 테스트
  it('Deepavali 전날은 공휴일이 아니다', () => {
    expect(isHoliday('sg', '2024-10-30')).toBe(false);
  });

  it('Deepavali 다음날은 공휴일이 아니다', () => {
    expect(isHoliday('sg', '2024-11-01')).toBe(false);
  });
}); 