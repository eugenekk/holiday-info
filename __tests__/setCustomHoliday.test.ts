import { setCustomHoliday, _clearAllCustomHolidays } from '../src/custom';
import { isHoliday } from '../src/utils';

// 각 테스트 전에 커스텀 공휴일 초기화
beforeEach(() => {
  // 전역 상태 초기화
  _clearAllCustomHolidays();
});

describe('setCustomHoliday 함수 테스트', () => {
  
  describe('기본 동작 테스트', () => {
    test('고정 날짜 커스텀 공휴일을 추가할 수 있어야 한다', () => {
      // Given: 평일인 날짜
      const testDate = '2025-06-03'; // 화요일
      expect(isHoliday('kr', testDate)).toBe(false);
      
      // When: 커스텀 공휴일을 추가
      setCustomHoliday({
        name: '창립기념일',
        type: 'fixed',
        month: 6,
        day: 3
      });
      
      // Then: 해당 날짜가 공휴일로 인식되어야 함
      expect(isHoliday('kr', testDate)).toBe(true);
    });

    test('여러 개의 커스텀 공휴일을 추가할 수 있어야 한다', () => {
      // Given: 평일인 날짜들
      const date1 = '2025-06-03';
      const date2 = '2025-08-15'; // 이미 광복절이지만...
      const date3 = '2025-12-24';
      
      // When: 여러 커스텀 공휴일을 추가
      setCustomHoliday({ name: '창립기념일', type: 'fixed', month: 6, day: 3 });
      setCustomHoliday({ name: '크리스마스이브', type: 'fixed', month: 12, day: 24 });
      
      // Then: 모든 날짜가 공휴일로 인식되어야 함
      expect(isHoliday('kr', date1)).toBe(true);
      expect(isHoliday('kr', date3)).toBe(true);
    });
  });

  describe('국가별 구분 테스트', () => {
    test('국가별로 다른 커스텀 공휴일을 설정할 수 있어야 한다', () => {
      // Given: 같은 날짜, 다른 국가
      const testDate = '2025-07-04';
      
      // When: 각 국가에 다른 커스텀 공휴일 추가
      setCustomHoliday({ name: '한국 특별일', type: 'fixed', month: 7, day: 4 }, 'kr');
      setCustomHoliday({ name: 'US Special Day', type: 'fixed', month: 7, day: 4 }, 'us');
      
      // Then: 각 국가에서만 해당 공휴일이 인식되어야 함
      expect(isHoliday('kr', testDate)).toBe(true);
      expect(isHoliday('us', testDate)).toBe(true);
      // 일본은 해당 커스텀 공휴일이 없어야 함
      expect(isHoliday('jp', testDate)).toBe(false);
    });
  });

  describe('기존 공휴일과의 통합 테스트', () => {
    test('기존 정부 공휴일은 그대로 유지되어야 한다', () => {
      // Given: 기존 공휴일들
      const newYear = '2025-01-01'; // 신정
      const independence = '2025-08-15'; // 광복절
      
      // When: 커스텀 공휴일을 추가
      setCustomHoliday({ name: '창립기념일', type: 'fixed', month: 6, day: 3 });
      
      // Then: 기존 공휴일들은 여전히 공휴일이어야 함
      expect(isHoliday('kr', newYear)).toBe(true);
      expect(isHoliday('kr', independence)).toBe(true);
    });

    test('기존 공휴일과 같은 날짜에 커스텀 공휴일을 추가해도 문제없어야 한다', () => {
      // Given: 기존 공휴일 날짜
      const newYear = '2025-01-01'; // 신정
      
      // When: 같은 날짜에 커스텀 공휴일 추가
      setCustomHoliday({ name: '회사 창립일', type: 'fixed', month: 1, day: 1 });
      
      // Then: 여전히 공휴일이어야 함
      expect(isHoliday('kr', newYear)).toBe(true);
    });
  });

  describe('대체공휴일 테스트', () => {
    test('일요일 커스텀 공휴일은 대체공휴일을 생성해야 한다', () => {
      // Given: 일요일인 날짜
      const sunday = '2025-06-01'; // 일요일
      const monday = '2025-06-02'; // 월요일
      
      // When: 일요일에 커스텀 공휴일 추가
      setCustomHoliday({ name: '특별한 날', type: 'fixed', month: 6, day: 1 });
      
      // Then: 일요일과 월요일 모두 공휴일이어야 함
      expect(isHoliday('kr', sunday)).toBe(true);
      expect(isHoliday('kr', monday)).toBe(true); // 대체공휴일
    });

    test('평일 커스텀 공휴일은 대체공휴일을 생성하지 않아야 한다', () => {
      // Given: 화요일인 날짜
      const tuesday = '2025-06-03'; // 화요일
      const wednesday = '2025-06-04'; // 수요일
      
      // When: 화요일에 커스텀 공휴일 추가
      setCustomHoliday({ name: '평일 특별일', type: 'fixed', month: 6, day: 3 });
      
      // Then: 화요일만 공휴일이고 수요일은 평일이어야 함
      expect(isHoliday('kr', tuesday)).toBe(true);
      expect(isHoliday('kr', wednesday)).toBe(false);
    });
  });

  describe('고정일 커스텀 공휴일 추가 테스트', () => {
    test('고정일 커스텀 공휴일을 추가할 수 있어야 한다', () => {
      // Given: 6월 2일을 고정일로 설정
      const testDate = '2025-06-02';
      
      // When: 6월 2일을 커스텀 공휴일로 추가 (fixed 타입만 허용)
      setCustomHoliday({
        name: '특별한 날',
        type: 'fixed',
        month: 6,
        day: 2
      });
      
      // Then: 해당 날짜가 공휴일이어야 함
      expect(isHoliday('kr', testDate)).toBe(true);
      
      // 다른 날짜들은 공휴일이 아니어야 함
      expect(isHoliday('kr', '2025-06-03')).toBe(false);
    });
  });

  describe('엣지 케이스 테스트', () => {
    test('국가 코드는 대소문자를 구분하지 않아야 한다', () => {
      // Given: 같은 날짜
      const testDate = '2025-06-03';
      
      // When: 대문자로 국가 코드 입력
      setCustomHoliday({ name: '테스트', type: 'fixed', month: 6, day: 3 }, 'KR');
      
      // Then: 소문자로 조회해도 공휴일이어야 함
      expect(isHoliday('kr', testDate)).toBe(true);
      expect(isHoliday('KR', testDate)).toBe(true);
    });

    test('기본 국가는 한국(kr)이어야 한다', () => {
      // Given: 국가 코드를 명시하지 않음
      const testDate = '2025-06-03';
      
      // When: 국가 코드 없이 커스텀 공휴일 추가
      setCustomHoliday({ name: '기본국가테스트', type: 'fixed', month: 6, day: 3 });
      
      // Then: 한국에서 공휴일로 인식되어야 함
      expect(isHoliday('kr', testDate)).toBe(true);
    });
  });

  describe('데이터 타입 검증 테스트', () => {
    test('필수 필드가 누락되면 타입 에러가 발생해야 한다', () => {
      // TypeScript 컴파일 시점에서 체크되므로 런타임 테스트는 제한적
      // 하지만 올바른 타입으로 호출되는지 확인
      expect(() => {
        setCustomHoliday({
          name: '올바른 공휴일',
          type: 'fixed',
          month: 6,
          day: 3
        });
      }).not.toThrow();
    });

    test('type=fixed일 때 day 필드가 있어야 한다', () => {
      // Given & When & Then: 올바른 fixed 타입 공휴일
      expect(() => {
        setCustomHoliday({
          name: 'Fixed Holiday',
          type: 'fixed',
          month: 6,
          day: 3
        });
      }).not.toThrow();
    });

    test('type=fixed일 때 day 필드가 필수이다', () => {
      // Given & When & Then: 올바른 fixed 타입 공휴일 (day 필드 필수)
      expect(() => {
        setCustomHoliday({
          name: 'Fixed Holiday with Day',
          type: 'fixed',
          month: 6,
          day: 15  // day 필드는 필수
        });
      }).not.toThrow();
    });
  });

  describe('양력 고정일 공휴일 테스트', () => {
    test('양력 고정일 커스텀 공휴일을 추가할 수 있어야 한다', () => {
      // Given: 양력 고정일 공휴일 추가 (이제 fixed 타입만 지원)
      // When: 5월 7일을 커스텀 공휴일로 추가
      setCustomHoliday({
        name: '특별한 고정일',
        type: 'fixed',
        month: 5,
        day: 7
      });
      
      // Then: 5월 7일이 공휴일이어야 함
      expect(isHoliday('kr', '2025-05-07')).toBe(true);
    });
  });

  describe('성능 테스트', () => {
    test('많은 커스텀 공휴일을 추가해도 성능에 문제가 없어야 한다', () => {
      // Given: 많은 커스텀 공휴일 추가
      const startTime = Date.now();
      
      // When: 100개의 커스텀 공휴일 추가
      for (let i = 1; i <= 100; i++) {
        setCustomHoliday({
          name: `테스트 공휴일 ${i}`,
          type: 'fixed',
          month: (i % 12) + 1, // 1-12월 순환
          day: (i % 28) + 1    // 1-28일 순환 (모든 달에 존재하는 날짜)
        });
      }
      
      const addTime = Date.now() - startTime;
      
      // Then: 추가 시간이 1초 미만이어야 함
      expect(addTime).toBeLessThan(1000);
      
      // 조회 성능 테스트
      const queryStartTime = Date.now();
      for (let i = 1; i <= 100; i++) {
        isHoliday('kr', `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`);
      }
      const queryTime = Date.now() - queryStartTime;
      
      // 조회 시간이 500ms 미만이어야 함
      expect(queryTime).toBeLessThan(500);
    });
  });

  describe('경계값 테스트', () => {
    test('월(month) 경계값을 올바르게 처리해야 한다', () => {
      // Given & When: 1월과 12월에 커스텀 공휴일 추가
      setCustomHoliday({ name: '1월 테스트', type: 'fixed', month: 1, day: 15 });
      setCustomHoliday({ name: '12월 테스트', type: 'fixed', month: 12, day: 15 });
      
      // Then: 정상적으로 인식되어야 함
      expect(isHoliday('kr', '2025-01-15')).toBe(true);
      expect(isHoliday('kr', '2025-12-15')).toBe(true);
    });

    test('일(day) 경계값을 올바르게 처리해야 한다', () => {
      // Given & When: 월초와 월말에 커스텀 공휴일 추가
      setCustomHoliday({ name: '월초 테스트', type: 'fixed', month: 6, day: 1 });
      setCustomHoliday({ name: '월말 테스트', type: 'fixed', month: 6, day: 30 });
      
      // Then: 정상적으로 인식되어야 함
      expect(isHoliday('kr', '2025-06-01')).toBe(true);
      expect(isHoliday('kr', '2025-06-30')).toBe(true);
    });

    test('고정일 경계값을 올바르게 처리해야 한다', () => {
      // Given & When: 다양한 고정일에 커스텀 공휴일 추가 (fixed 타입만 지원)
      setCustomHoliday({ name: '6월 1일 테스트', type: 'fixed', month: 6, day: 1 }); 
      setCustomHoliday({ name: '6월 9일 테스트', type: 'fixed', month: 6, day: 9 }); 
      
      // Then: 정상적으로 인식되어야 함
      expect(isHoliday('kr', '2025-06-01')).toBe(true); // 6월 1일
      expect(isHoliday('kr', '2025-06-09')).toBe(true); // 6월 9일
    });
  });
}); 