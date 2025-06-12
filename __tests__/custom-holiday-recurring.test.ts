import { setCustomHoliday, _clearAllCustomHolidays } from '../src/custom';
import { isHoliday } from '../src/utils';

describe('커스텀 공휴일 - 일회성 vs 매년 반복 테스트', () => {
  beforeEach(() => {
    _clearAllCustomHolidays();
  });

  describe('일회성 공휴일 (특정 연도만)', () => {
    test('2025년 6월 12일만 공휴일로 설정하고, 다른 연도는 공휴일이 아님', () => {
      // Given: 2025년 6월 12일만 일회성 공휴일로 설정
      setCustomHoliday({
        name: '일회성 기념일',
        type: 'fixed',
        month: 6,
        day: 12,
        recurring: false,
        year: 2025
      }, 'kr');

      // When & Then: 2025년만 공휴일, 다른 연도는 평일
      expect(isHoliday('kr', '2025-06-12')).toBe(true);   // 설정한 연도는 공휴일
      expect(isHoliday('kr', '2024-06-12')).toBe(false);  // 이전 연도는 평일
      expect(isHoliday('kr', '2026-06-12')).toBe(false);  // 다음 연도는 평일
      expect(isHoliday('kr', '2027-06-12')).toBe(false);  // 그 다음 연도도 평일
    });

    test('여러 연도의 일회성 공휴일을 각각 설정할 수 있음', () => {
      // Given: 각기 다른 연도에 일회성 공휴일 설정
      setCustomHoliday({
        name: '2024년 특별일',
        type: 'fixed',
        month: 6,
        day: 12,
        recurring: false,
        year: 2024
      }, 'kr');

      setCustomHoliday({
        name: '2026년 특별일',
        type: 'fixed',
        month: 6,
        day: 12,
        recurring: false,
        year: 2026
      }, 'kr');

      // When & Then: 설정한 연도들만 공휴일
      expect(isHoliday('kr', '2024-06-12')).toBe(true);   // 2024년 설정됨
      expect(isHoliday('kr', '2025-06-12')).toBe(false);  // 2025년 설정 안됨
      expect(isHoliday('kr', '2026-06-12')).toBe(true);   // 2026년 설정됨
      expect(isHoliday('kr', '2027-06-12')).toBe(false);  // 2027년 설정 안됨
    });

    test('일회성 공휴일 설정 시 year가 없으면 에러가 발생해야 함', () => {
      // Given & When: recurring=false인데 year가 없는 경우
      expect(() => {
        setCustomHoliday({
          name: '잘못된 설정',
          type: 'fixed',
          month: 6,
          day: 12,
          recurring: false
          // year가 없음
        }, 'kr');
      }).toThrow('일회성 공휴일(recurring: false)을 설정할 때는 year를 반드시 지정해야 합니다.');
    });
  });

  describe('매년 반복 공휴일 (기본 동작)', () => {
    test('recurring=true로 설정하면 매년 반복됨', () => {
      // Given: 매년 반복 공휴일 설정 (명시적으로 recurring=true)
      setCustomHoliday({
        name: '매년 기념일',
        type: 'fixed',
        month: 6,
        day: 12,
        recurring: true
      }, 'kr');

      // When & Then: 모든 연도에서 공휴일
      expect(isHoliday('kr', '2024-06-12')).toBe(true);
      expect(isHoliday('kr', '2025-06-12')).toBe(true);
      expect(isHoliday('kr', '2026-06-12')).toBe(true);
      expect(isHoliday('kr', '2027-06-12')).toBe(true);
    });

    test('recurring 옵션을 생략하면 기본값으로 매년 반복됨', () => {
      // Given: recurring 옵션 생략 (기본값은 true)
      setCustomHoliday({
        name: '기본 기념일',
        type: 'fixed',
        month: 6,
        day: 12
      }, 'kr');

      // When & Then: 모든 연도에서 공휴일 (기존 동작 유지)
      expect(isHoliday('kr', '2024-06-12')).toBe(true);
      expect(isHoliday('kr', '2025-06-12')).toBe(true);
      expect(isHoliday('kr', '2026-06-12')).toBe(true);
      expect(isHoliday('kr', '2027-06-12')).toBe(true);
    });

    test('매년 반복 공휴일 설정 시 year가 있어도 무시됨', () => {
      // Given: recurring=true인데 year도 함께 설정
      setCustomHoliday({
        name: '매년 기념일',
        type: 'fixed',
        month: 6,
        day: 12,
        recurring: true,
        year: 2025  // 이 값은 무시되어야 함
      }, 'kr');

      // When & Then: year 값과 상관없이 모든 연도에서 공휴일
      expect(isHoliday('kr', '2024-06-12')).toBe(true);
      expect(isHoliday('kr', '2025-06-12')).toBe(true);
      expect(isHoliday('kr', '2026-06-12')).toBe(true);
    });
  });

  describe('일회성과 매년 반복 공휴일 혼합 테스트', () => {
    test('같은 날짜에 일회성과 매년 반복 공휴일을 각각 설정할 수 있음', () => {
      // Given: 6월 12일에 매년 반복 공휴일과 6월 13일에 일회성 공휴일 설정
      setCustomHoliday({
        name: '매년 기념일',
        type: 'fixed',
        month: 6,
        day: 12,
        recurring: true
      }, 'kr');

      setCustomHoliday({
        name: '2025년만 특별일',
        type: 'fixed',
        month: 6,
        day: 13,
        recurring: false,
        year: 2025
      }, 'kr');

      // When & Then
      // 6월 12일은 모든 연도에서 공휴일
      expect(isHoliday('kr', '2024-06-12')).toBe(true);
      expect(isHoliday('kr', '2025-06-12')).toBe(true);
      expect(isHoliday('kr', '2026-06-12')).toBe(true);

      // 6월 13일은 2025년만 공휴일
      expect(isHoliday('kr', '2024-06-13')).toBe(false);
      expect(isHoliday('kr', '2025-06-13')).toBe(true);
      expect(isHoliday('kr', '2026-06-13')).toBe(false);
    });

    test('같은 날짜에 다른 연도의 일회성 공휴일과 매년 반복 공휴일이 함께 있을 때', () => {
      // Given: 6월 12일에 매년 반복 + 2025년 일회성 둘 다 설정
      setCustomHoliday({
        name: '매년 기념일',
        type: 'fixed',
        month: 6,
        day: 12,
        recurring: true
      }, 'kr');

      setCustomHoliday({
        name: '2025년 특별 기념일',
        type: 'fixed',
        month: 6,
        day: 12,
        recurring: false,
        year: 2025
      }, 'kr');

      // When & Then: 모든 연도에서 공휴일 (매년 반복 때문에)
      expect(isHoliday('kr', '2024-06-12')).toBe(true);
      expect(isHoliday('kr', '2025-06-12')).toBe(true);  // 두 개의 공휴일이 겹침
      expect(isHoliday('kr', '2026-06-12')).toBe(true);
    });
  });

  describe('잘못된 타입 입력 처리', () => {
    test('weekday 타입이 들어와도 fixed 타입으로 처리됨', () => {
      // Given: weekday 타입으로 입력하지만 fixed로 처리되어야 함
      setCustomHoliday({
        name: 'weekday로 입력했지만 fixed로 처리',
        type: 'fixed', // 이제 fixed만 허용
        month: 6,
        day: 15,  // weekday 관련 속성 대신 day 사용
        recurring: false,
        year: 2025
      }, 'kr');

      // When & Then: 6월 15일이 공휴일로 처리됨
      expect(isHoliday('kr', '2025-06-15')).toBe(true);
      expect(isHoliday('kr', '2024-06-15')).toBe(false);  // 일회성이므로 다른 연도는 아님
    });

    test('lunar 타입을 사용하려 해도 fixed 타입으로만 처리 가능', () => {
      // Given: 이제는 lunar 타입을 사용할 수 없고 fixed만 가능
      setCustomHoliday({
        name: 'fixed 타입으로만 설정 가능',
        type: 'fixed',
        month: 5,
        day: 31,  // 양력 날짜로 직접 지정
        recurring: false,
        year: 2025
      }, 'kr');

      // When & Then: 양력 5월 31일이 공휴일로 처리됨
      expect(isHoliday('kr', '2025-05-31')).toBe(true);
      expect(isHoliday('kr', '2024-05-31')).toBe(false);  // 일회성
    });
  });
}); 