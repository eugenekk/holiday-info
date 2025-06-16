import { isHoliday } from '../src/utils';

describe('Hari Raya Puasa 테스트', () => {
  it('2022년 Hari Raya Puasa는 5월 3일이다', () => {
    expect(isHoliday('sg', '2022-05-03')).toBe(true);
  });

  it('2023년 Hari Raya Puasa는 4월 22일이다', () => {
    expect(isHoliday('sg', '2023-04-22')).toBe(true);
  });

  it('2024년 Hari Raya Puasa는 4월 10일이다', () => {
    expect(isHoliday('sg', '2024-04-10')).toBe(true);
  });

  it('2025년 Hari Raya Puasa는 3월 31일이다', () => {
    expect(isHoliday('sg', '2025-03-31')).toBe(true);
  });

  it('2026년 Hari Raya Puasa는 3월 20일이다', () => {
    expect(isHoliday('sg', '2025-03-20')).toBe(true);
  });
}); 