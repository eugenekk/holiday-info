import { isHoliday } from '../src/utils';

// hijri-date 패키지 mock
jest.mock('hijri-date', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation((yearOrDate: any, month?: number, day?: number) => {
      // Date 객체로 들어오는 경우(그레고리력 → 히즈리력 변환)
      if (yearOrDate instanceof Date) {
        // approxDate가 2023, 2024, 2025년 6월 29/17/7일이면 각각 2023, 2024, 2025년을 반환
        const y = yearOrDate.getFullYear();
        if (y === 2023) {
          return {
            getFullYear: () => 2023,
            getMonth: () => 11, // 12월 (0-based)
            getDate: () => 10
          };
        } else if (y === 2024) {
          return {
            getFullYear: () => 2024,
            getMonth: () => 11,
            getDate: () => 10
          };
        } else if (y === 2025) {
          return {
            getFullYear: () => 2025,
            getMonth: () => 11,
            getDate: () => 10
          };
        }
        // 기본값
        return {
          getFullYear: () => 1445,
          getMonth: () => 11, // 0-based
          getDate: () => 10
        };
      }
      // 2023-2025년 Hari Raya Haji 날짜 매핑 (히즈리력 → 그레고리력 변환)
      const hijriToGregorianMap: Record<string, Date> = {
        '2023-12-10': new Date(2023, 5, 29), // 2023-06-29
        '2024-12-10': new Date(2024, 5, 17), // 2024-06-17
        '2025-12-10': new Date(2025, 5, 7)   // 2025-06-07
      };
      const key = `${yearOrDate}-${month}-${day}`;
      if (hijriToGregorianMap[key]) {
        return {
          toGregorian: () => hijriToGregorianMap[key],
          getFullYear: () => Number(yearOrDate),
          getMonth: () => (month ?? 1) - 1,
          getDate: () => day ?? 1
        };
      }
      return {
        toGregorian: () => new Date(yearOrDate, (month ?? 1) - 1, day ?? 1),
        getFullYear: () => Number(yearOrDate),
        getMonth: () => (month ?? 1) - 1,
        getDate: () => day ?? 1
      };
    })
  };
});

describe('Hari Raya Haji 테스트', () => {
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