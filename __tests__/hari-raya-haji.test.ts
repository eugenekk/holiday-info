import { isHoliday } from '../src/utils';

describe('Hari Raya Haji 테스트', () => {
  it('2022년 Hari Raya Haji는 7월 10일이다', () => {
    expect(isHoliday('sg', '2022-07-10')).toBe(true);
  });

  it('2022년 Hari Raya Haji는 7월 11(대체)일이다', () => {
    expect(isHoliday('sg', '2022-07-11')).toBe(true);
  });

  it('2023년 Hari Raya Haji는 6월 29일이다', () => {
    expect(isHoliday('sg', '2023-06-29')).toBe(true);
  });

  it('2024년 Hari Raya Haji는 6월 17일이다', () => {
    expect(isHoliday('sg', '2024-06-17')).toBe(true);
  });

  it('2025년 Hari Raya Haji는 6월 7일이다', () => {
    expect(isHoliday('sg', '2025-06-07')).toBe(true);
  });
}); 