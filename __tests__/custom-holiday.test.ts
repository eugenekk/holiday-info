import { setCustomHoliday, _clearAllCustomHolidays } from '../src/custom';
import { isHoliday } from '../src/utils';

describe('커스텀 공휴일 기본 기능', () => {
  beforeEach(() => {
    _clearAllCustomHolidays();
  });

  describe('기본 커스텀 공휴일 설정 및 확인', () => {
    test('한국에서 6월 12일을 커스텀 공휴일로 설정하고 isHoliday로 확인', () => {
      // 6월 12일을 커스텀 공휴일로 설정
      setCustomHoliday({
        name: '회사 창립기념일',
        type: 'fixed',
        month: 6,
        day: 12
      });

      // 2025년 6월 12일이 공휴일인지 확인
      expect(isHoliday('kr', '2025-06-12')).toBe(true);
      
      // 2026년 6월 12일도 공휴일인지 확인 (매년 반복)
      expect(isHoliday('kr', '2026-06-12')).toBe(true);
      
      // 다른 날짜는 영향받지 않음
      expect(isHoliday('kr', '2025-06-11')).toBe(false);
      expect(isHoliday('kr', '2025-06-13')).toBe(false);
    });

    test('여러 해에 걸쳐 커스텀 공휴일이 적용되는지 확인', () => {
      setCustomHoliday({
        name: '회사 창립기념일',
        type: 'fixed',
        month: 6,
        day: 12
      });

      // 여러 연도에서 동일하게 작동
      const years = [2024, 2025, 2026, 2027, 2028];
      years.forEach(year => {
        expect(isHoliday('kr', `${year}-06-12`)).toBe(true);
      });
    });

    test('다른 날짜에는 영향을 주지 않음', () => {
      setCustomHoliday({
        name: '회사 창립기념일',
        type: 'fixed',
        month: 6,
        day: 12
      });

      // 6월 12일 전후 날짜들은 공휴일이 아님
      expect(isHoliday('kr', '2025-06-11')).toBe(false);
      expect(isHoliday('kr', '2025-06-13')).toBe(false);
      expect(isHoliday('kr', '2025-05-12')).toBe(false);
      expect(isHoliday('kr', '2025-07-12')).toBe(false);
    });

    test('기존 정부 공휴일과 함께 작동', () => {
      setCustomHoliday({
        name: '회사 창립기념일',
        type: 'fixed',
        month: 6,
        day: 12
      });

      // 기존 정부 공휴일도 여전히 작동
      expect(isHoliday('kr', '2025-01-01')).toBe(true); // 신정
      expect(isHoliday('kr', '2025-03-01')).toBe(true); // 삼일절
      expect(isHoliday('kr', '2025-05-05')).toBe(true); // 어린이날
      
      // 커스텀 공휴일도 작동
      expect(isHoliday('kr', '2025-06-12')).toBe(true);
    });
  });

  describe('다양한 커스텀 공휴일 설정', () => {
    test('여러 개의 커스텀 공휴일 설정', () => {
      // 첫 번째 커스텀 공휴일
      setCustomHoliday({
        name: '회사 창립기념일',
        type: 'fixed',
        month: 6,
        day: 12
      });

      // 두 번째 커스텀 공휴일
      setCustomHoliday({
        name: '회사 워크샵데이',
        type: 'fixed',
        month: 9,
        day: 15
      });

      // 세 번째 커스텀 공휴일
      setCustomHoliday({
        name: '회사 송년회',
        type: 'fixed',
        month: 12,
        day: 20
      });

      // 모든 커스텀 공휴일이 작동하는지 확인
      expect(isHoliday('kr', '2025-06-12')).toBe(true);
      expect(isHoliday('kr', '2025-09-15')).toBe(true);
      expect(isHoliday('kr', '2025-12-20')).toBe(true);

      // 다른 날짜는 영향받지 않음
      expect(isHoliday('kr', '2025-06-13')).toBe(false);
      expect(isHoliday('kr', '2025-09-16')).toBe(false);
      expect(isHoliday('kr', '2025-12-21')).toBe(false);
    });

    test('다른 국가에서도 커스텀 공휴일 설정 가능', () => {
      // 미국에 커스텀 공휴일 설정
      setCustomHoliday({
        name: 'Company Foundation Day',
        type: 'fixed',
        month: 6,
        day: 12
      }, 'us');

      // 일본에 커스텀 공휴일 설정
      setCustomHoliday({
        name: '会社記念日',
        type: 'fixed',
        month: 6,
        day: 12
      }, 'jp');

      // 각 국가에서 커스텀 공휴일 확인
      expect(isHoliday('us', '2025-06-12')).toBe(true);
      expect(isHoliday('jp', '2025-06-12')).toBe(true);
      
      // 한국에는 설정하지 않았으므로 공휴일이 아님
      expect(isHoliday('kr', '2025-06-12')).toBe(false);
    });

    test('같은 날짜에 여러 이름의 공휴일 설정', () => {
      // 같은 날짜에 두 개의 다른 이름 공휴일 설정
      setCustomHoliday({
        name: '회사 창립기념일',
        type: 'fixed',
        month: 6,
        day: 12
      });

      setCustomHoliday({
        name: '대표이사 생일',
        type: 'fixed',
        month: 6,
        day: 12
      });

      // 같은 날짜이지만 두 공휴일 모두 적용됨
      expect(isHoliday('kr', '2025-06-12')).toBe(true);
    });
  });

  describe('사용 예시', () => {
    test('실제 사용 시나리오: 회사 공휴일 관리', () => {
      // 회사 공휴일들 설정
      setCustomHoliday({
        name: '창립기념일',
        type: 'fixed',
        month: 6,
        day: 12
      });

      setCustomHoliday({
        name: '하계휴가',
        type: 'fixed',
        month: 8,
        day: 15
      });

      setCustomHoliday({
        name: '송년회',
        type: 'fixed',
        month: 12,
        day: 30
      });

      // 2025년 각 달별 공휴일 확인
      const companyHolidays2025 = [
        '2025-06-12', // 창립기념일
        '2025-08-15', // 하계휴가 (광복절과 겹침)
        '2025-12-30'  // 송년회
      ];

      companyHolidays2025.forEach(date => {
        expect(isHoliday('kr', date)).toBe(true);
      });

      // 정부 공휴일도 여전히 유효
      expect(isHoliday('kr', '2025-01-01')).toBe(true); // 신정
      expect(isHoliday('kr', '2025-03-01')).toBe(true); // 삼일절
      expect(isHoliday('kr', '2025-05-05')).toBe(true); // 어린이날
      expect(isHoliday('kr', '2025-08-15')).toBe(true); // 광복절 (하계휴가와 겹침)
    });

    test('국가별 커스텀 공휴일 관리', () => {
      // 각 국가별로 다른 커스텀 공휴일 설정
      setCustomHoliday({
        name: '한국지사 창립일',
        type: 'fixed',
        month: 3,
        day: 15
      }, 'kr');

      setCustomHoliday({
        name: 'US Branch Opening',
        type: 'fixed',
        month: 7,
        day: 4
      }, 'us');

      setCustomHoliday({
        name: '日本支社記念日',
        type: 'fixed',
        month: 5,
        day: 1
      }, 'jp');

      // 각 국가에서만 해당 커스텀 공휴일 적용
      expect(isHoliday('kr', '2025-03-15')).toBe(true);
      expect(isHoliday('us', '2025-03-15')).toBe(false);
      expect(isHoliday('jp', '2025-03-15')).toBe(false);

      expect(isHoliday('kr', '2025-07-04')).toBe(false);
      expect(isHoliday('us', '2025-07-04')).toBe(true); // 미국 독립기념일 + 커스텀 공휴일
      expect(isHoliday('jp', '2025-07-04')).toBe(false);

      expect(isHoliday('kr', '2025-05-01')).toBe(true); // 한국 근로자의날
      expect(isHoliday('us', '2025-05-01')).toBe(false);
      expect(isHoliday('jp', '2025-05-01')).toBe(true); // 일본 정부공휴일 + 커스텀 공휴일
    });
  });
}); 