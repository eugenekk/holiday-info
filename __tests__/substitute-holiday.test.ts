import { setCustomHoliday, _clearAllCustomHolidays } from '../src/custom';
import { isHoliday } from '../src/utils';

describe('커스텀 공휴일 대체휴일 룰 테스트', () => {
  beforeEach(() => {
    _clearAllCustomHolidays();
  });

  describe('대체휴일 룰 적용하는 경우 (substituteHoliday: true)', () => {
    test('일요일 커스텀 공휴일 + 대체휴일 룰 적용 → 다음 월요일도 공휴일', () => {
      // Given: 2025년 6월 15일(일요일)을 대체휴일 룰 적용하여 커스텀 공휴일로 설정
      setCustomHoliday({
        name: '창립기념일',
        type: 'fixed',
        month: 6,
        day: 15,
        substituteHoliday: true  // 대체휴일 룰 적용
      }, 'kr');

      // When & Then: 일요일과 다음 월요일 모두 공휴일이어야 함
      expect(isHoliday('kr', '2025-06-15')).toBe(true);  // 일요일 (원래 공휴일)
      expect(isHoliday('kr', '2025-06-16')).toBe(true);  // 월요일 (대체휴일)
    });

    test('평일 커스텀 공휴일 + 대체휴일 룰 적용 → 대체휴일 생성되지 않음', () => {
      // Given: 2025년 6월 17일(화요일)을 대체휴일 룰 적용하여 커스텀 공휴일로 설정
      setCustomHoliday({
        name: '평일 기념일',
        type: 'fixed',
        month: 6,
        day: 17,
        substituteHoliday: true  // 대체휴일 룰 적용 (하지만 평일이므로 효과 없음)
      }, 'kr');

      // When & Then: 평일은 대체휴일이 생성되지 않음
      expect(isHoliday('kr', '2025-06-17')).toBe(true);   // 화요일 (원래 공휴일)
      expect(isHoliday('kr', '2025-06-18')).toBe(false);  // 수요일 (대체휴일 없음)
    });

    test('토요일 커스텀 공휴일 + 대체휴일 룰 적용 → 한국은 토요일 대체휴일 없음', () => {
      // Given: 2025년 6월 14일(토요일)을 대체휴일 룰 적용하여 커스텀 공휴일로 설정
      setCustomHoliday({
        name: '토요일 기념일',
        type: 'fixed',
        month: 6,
        day: 14,
        substituteHoliday: true  // 대체휴일 룰 적용
      }, 'kr');

      // When & Then: 한국은 토요일 공휴일에 대한 대체휴일이 없음
      expect(isHoliday('kr', '2025-06-14')).toBe(true);   // 토요일 (원래 공휴일)
      expect(isHoliday('kr', '2025-06-16')).toBe(false);  // 월요일 (대체휴일 없음)
    });
  });

  describe('대체휴일 룰 적용하지 않는 경우 (substituteHoliday: false)', () => {
    test('일요일 커스텀 공휴일 + 대체휴일 룰 미적용 → 다음 월요일은 평일', () => {
      // Given: 2025년 6월 15일(일요일)을 대체휴일 룰 미적용하여 커스텀 공휴일로 설정
      setCustomHoliday({
        name: '창립기념일',
        type: 'fixed',
        month: 6,
        day: 15,
        substituteHoliday: false  // 대체휴일 룰 미적용
      }, 'kr');

      // When & Then: 일요일만 공휴일, 월요일은 평일
      expect(isHoliday('kr', '2025-06-15')).toBe(true);   // 일요일 (원래 공휴일)
      expect(isHoliday('kr', '2025-06-16')).toBe(false);  // 월요일 (대체휴일 없음)
    });

    test('평일 커스텀 공휴일 + 대체휴일 룰 미적용 → 해당 날짜만 공휴일', () => {
      // Given: 2025년 6월 17일(화요일)을 대체휴일 룰 미적용하여 커스텀 공휴일로 설정
      setCustomHoliday({
        name: '평일 기념일',
        type: 'fixed',
        month: 6,
        day: 17,
        substituteHoliday: false  // 대체휴일 룰 미적용
      }, 'kr');

      // When & Then: 해당 날짜만 공휴일
      expect(isHoliday('kr', '2025-06-17')).toBe(true);   // 화요일 (원래 공휴일)
      expect(isHoliday('kr', '2025-06-18')).toBe(false);  // 수요일 (다음날은 평일)
    });
  });

  describe('기본값 테스트 (substituteHoliday 옵션 생략)', () => {
    test('substituteHoliday 옵션을 생략하면 기본값으로 대체휴일 룰이 적용됨', () => {
      // Given: substituteHoliday 옵션 생략 (기본값은 true로 가정)
      setCustomHoliday({
        name: '기본값 테스트',
        type: 'fixed',
        month: 6,
        day: 15  // 일요일
        // substituteHoliday 생략
      }, 'kr');

      // When & Then: 기본값으로 대체휴일 룰이 적용되어야 함
      expect(isHoliday('kr', '2025-06-15')).toBe(true);  // 일요일 (원래 공휴일)
      expect(isHoliday('kr', '2025-06-16')).toBe(true);  // 월요일 (대체휴일)
    });
  });

  describe('일회성 커스텀 공휴일과 대체휴일 룰 조합', () => {
    test('일회성 + 대체휴일 룰 적용', () => {
      // Given: 2025년 6월 15일만 일회성으로 대체휴일 룰 적용
      setCustomHoliday({
        name: '2025년만 창립기념일',
        type: 'fixed',
        month: 6,
        day: 15,
        recurring: false,
        year: 2025,
        substituteHoliday: true
      }, 'kr');

      // When & Then: 2025년만 적용
      expect(isHoliday('kr', '2025-06-15')).toBe(true);  // 2025년 일요일
      expect(isHoliday('kr', '2025-06-16')).toBe(true);  // 2025년 월요일 (대체휴일)
      expect(isHoliday('kr', '2024-06-15')).toBe(false); // 2024년은 설정 안됨
      expect(isHoliday('kr', '2024-06-16')).toBe(false); // 2024년 대체휴일도 없음
    });

    test('일회성 + 대체휴일 룰 미적용', () => {
      // Given: 2025년 6월 15일만 일회성으로 대체휴일 룰 미적용
      setCustomHoliday({
        name: '2025년만 창립기념일',
        type: 'fixed',
        month: 6,
        day: 15,
        recurring: false,
        year: 2025,
        substituteHoliday: false
      }, 'kr');

      // When & Then: 2025년 6월 15일만 공휴일
      expect(isHoliday('kr', '2025-06-15')).toBe(true);  // 2025년 일요일
      expect(isHoliday('kr', '2025-06-16')).toBe(false); // 2025년 월요일 (대체휴일 없음)
    });
  });

  describe('여러 커스텀 공휴일과 대체휴일 룰 혼합', () => {
    test('대체휴일 룰이 다른 여러 커스텀 공휴일을 함께 설정', () => {
      // Given: 서로 다른 대체휴일 룰을 가진 커스텀 공휴일들
      setCustomHoliday({
        name: '대체휴일 적용 기념일',
        type: 'fixed',
        month: 6,
        day: 15,  // 일요일
        substituteHoliday: true
      }, 'kr');

      setCustomHoliday({
        name: '대체휴일 미적용 기념일',
        type: 'fixed',
        month: 6,
        day: 22,  // 일요일
        substituteHoliday: false
      }, 'kr');

      // When & Then: 각각 다른 룰이 적용되어야 함
      expect(isHoliday('kr', '2025-06-15')).toBe(true);  // 첫 번째 일요일
      expect(isHoliday('kr', '2025-06-16')).toBe(true);  // 첫 번째 대체휴일 (적용)
      expect(isHoliday('kr', '2025-06-22')).toBe(true);  // 두 번째 일요일
      expect(isHoliday('kr', '2025-06-23')).toBe(false); // 두 번째 대체휴일 (미적용)
    });
  });

  describe('다국가 대체휴일 제어', () => {
    describe('미국(US) - 커스텀 공휴일 대체휴일', () => {
      test('토요일 커스텀 공휴일: substituteHoliday=true → 금요일 대체휴일', () => {
        setCustomHoliday({
          name: 'Custom Saturday Holiday',
          type: 'fixed',
          month: 6,
          day: 14,
          substituteHoliday: true
        }, 'us');

        expect(isHoliday('us', '2025-06-14')).toBe(true);  // 토요일 공휴일
        expect(isHoliday('us', '2025-06-13')).toBe(true);  // 금요일 대체휴일
      });

      test('토요일 커스텀 공휴일: substituteHoliday=false → 대체휴일 없음', () => {
        setCustomHoliday({
          name: 'Custom Saturday Holiday',
          type: 'fixed',
          month: 6,
          day: 14,
          substituteHoliday: false
        }, 'us');

        expect(isHoliday('us', '2025-06-14')).toBe(true);  // 토요일 공휴일
        expect(isHoliday('us', '2025-06-13')).toBe(false); // 금요일 대체휴일 없음
      });

      test('일요일 커스텀 공휴일: substituteHoliday=true → 월요일 대체휴일', () => {
        setCustomHoliday({
          name: 'Custom Sunday Holiday',
          type: 'fixed',
          month: 6,
          day: 15,
          substituteHoliday: true
        }, 'us');

        expect(isHoliday('us', '2025-06-15')).toBe(true);  // 일요일 공휴일
        expect(isHoliday('us', '2025-06-16')).toBe(true);  // 월요일 대체휴일
      });

      test('일요일 커스텀 공휴일: substituteHoliday=false → 대체휴일 없음', () => {
        setCustomHoliday({
          name: 'Custom Sunday Holiday',
          type: 'fixed',
          month: 6,
          day: 15,
          substituteHoliday: false
        }, 'us');

        expect(isHoliday('us', '2025-06-15')).toBe(true);  // 일요일 공휴일
        expect(isHoliday('us', '2025-06-16')).toBe(false); // 월요일 대체휴일 없음
      });
    });

    describe('일본(JP) - 커스텀 공휴일 대체휴일', () => {
      test('일요일 커스텀 공휴일: substituteHoliday=true → 월요일 대체휴일', () => {
        setCustomHoliday({
          name: 'Custom Sunday Holiday',
          type: 'fixed',
          month: 6,
          day: 15,
          substituteHoliday: true
        }, 'jp');

        expect(isHoliday('jp', '2025-06-15')).toBe(true);  // 일요일 공휴일
        expect(isHoliday('jp', '2025-06-16')).toBe(true);  // 월요일 대체휴일
      });

      test('일요일 커스텀 공휴일: substituteHoliday=false → 대체휴일 없음', () => {
        setCustomHoliday({
          name: 'Custom Sunday Holiday',
          type: 'fixed',
          month: 6,
          day: 15,
          substituteHoliday: false
        }, 'jp');

        expect(isHoliday('jp', '2025-06-15')).toBe(true);  // 일요일 공휴일
        expect(isHoliday('jp', '2025-06-16')).toBe(false); // 월요일 대체휴일 없음
      });
    });

    describe('다중 국가 동시 테스트', () => {
      test('같은 날짜, 다른 국가에서 각각 다른 substituteHoliday 설정', () => {
        // 미국: 대체휴일 적용
        setCustomHoliday({
          name: 'Custom Holiday US',
          type: 'fixed',
          month: 6,
          day: 15,
          substituteHoliday: true
        }, 'us');

        // 일본: 대체휴일 미적용
        setCustomHoliday({
          name: 'Custom Holiday JP',
          type: 'fixed',
          month: 6,
          day: 15,
          substituteHoliday: false
        }, 'jp');

        // 한국: 대체휴일 적용
        setCustomHoliday({
          name: 'Custom Holiday KR',
          type: 'fixed',
          month: 6,
          day: 15,
          substituteHoliday: true
        }, 'kr');

        // 모든 국가에서 일요일은 공휴일
        expect(isHoliday('us', '2025-06-15')).toBe(true);
        expect(isHoliday('jp', '2025-06-15')).toBe(true);
        expect(isHoliday('kr', '2025-06-15')).toBe(true);

        // 월요일 대체휴일: 미국과 한국만 적용
        expect(isHoliday('us', '2025-06-16')).toBe(true); // 대체휴일 적용
        expect(isHoliday('jp', '2025-06-16')).toBe(false); // 대체휴일 미적용
        expect(isHoliday('kr', '2025-06-16')).toBe(true); // 대체휴일 적용
      });

      test('모든 국가에서 기본값은 대체휴일 적용', () => {
        // substituteHoliday 옵션을 생략 (기본값: true)
        setCustomHoliday({
          name: 'Default Holiday US',
          type: 'fixed',
          month: 6,
          day: 15
        }, 'us');

        setCustomHoliday({
          name: 'Default Holiday JP',
          type: 'fixed',
          month: 6,
          day: 15
        }, 'jp');

        setCustomHoliday({
          name: 'Default Holiday KR',
          type: 'fixed',
          month: 6,
          day: 15
        }, 'kr');

        // 모든 국가에서 일요일은 공휴일
        expect(isHoliday('us', '2025-06-15')).toBe(true);
        expect(isHoliday('jp', '2025-06-15')).toBe(true);
        expect(isHoliday('kr', '2025-06-15')).toBe(true);

        // 모든 국가에서 월요일 대체휴일 적용 (기본값)
        expect(isHoliday('us', '2025-06-16')).toBe(true);
        expect(isHoliday('jp', '2025-06-16')).toBe(true);
        expect(isHoliday('kr', '2025-06-16')).toBe(true);
      });
    });
  });
}); 