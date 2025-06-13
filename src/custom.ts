// 커스텀 공휴일 관리

export interface CustomHolidayRule {
  name: string;
  type: 'fixed';      // 커스텀 공휴일은 fixed만 허용
  month: number;
  day: number;        // fixed 타입이므로 day는 필수
  recurring?: boolean; // 매년 반복 여부 (기본값: true)
  year?: number;      // recurring=false일 때 특정 연도 지정
  substituteHoliday?: boolean; // 대체휴일 룰 적용 여부 (기본값: true)
}

// 전역 커스텀 공휴일 저장소
const customHolidays = new Map<string, CustomHolidayRule[]>();

/**
 * 커스텀 공휴일 설정 함수
 * 참고: 커스텀 공휴일은 고정일(fixed) 타입만 지원합니다.
 */
export function setCustomHoliday(holiday: CustomHolidayRule | undefined, country: string = 'kr'): void {
  const countryKey = country.toLowerCase();
  
  // holiday가 undefined면 해당 날짜의 커스텀 휴일을 제거
  if (holiday === undefined) {
    if (customHolidays.has(countryKey)) {
      customHolidays.set(countryKey, []);
    }
    return;
  }

  // 유효성 검사: recurring=false일 때는 year가 반드시 있어야 함
  if (holiday.recurring === false && holiday.year === undefined) {
    throw new Error('일회성 공휴일(recurring: false)을 설정할 때는 year를 반드시 지정해야 합니다.');
  }

  // 커스텀 공휴일은 fixed 타입만 지원
  // (인터페이스에서 이미 제한하고 있지만 명시적으로 확인)
  const normalizedHoliday: CustomHolidayRule = {
    ...holiday,
    type: 'fixed' as const  // 항상 fixed 타입으로 처리
  };

  if (!customHolidays.has(countryKey)) {
    customHolidays.set(countryKey, []);
  }

  // 같은 날짜의 기존 커스텀 휴일 제거
  const existingHolidays = customHolidays.get(countryKey)!;
  const filteredHolidays = existingHolidays.filter(h => 
    !(h.month === normalizedHoliday.month && h.day === normalizedHoliday.day)
  );
  
  // 새로운 휴일 추가
  customHolidays.set(countryKey, [...filteredHolidays, normalizedHoliday]);
}

/**
 * utils.ts에서 사용할 내부 API
 * @internal
 */
export function _getCustomHolidaysForUtils(country: string): CustomHolidayRule[] {
  return customHolidays.get(country.toLowerCase()) || [];
}

/**
 * 테스트용 초기화 함수
 * @internal
 */
export function _clearAllCustomHolidays(): void {
  customHolidays.clear();
}
