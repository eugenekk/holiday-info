import { format, parseISO } from 'date-fns';

/**
 * 1) US 규칙에 따른 Observed Holiday 날짜 반환 (배열)
 * 토요일이 공휴일이면 -> 전날 금요일
 * 일요일이 공휴일이면 -> 다음날 월요일
 */
export function getUSObservedDates(holidayDate: Date): Date[] {
  const dow = holidayDate.getDay();
  if (dow === 0) {
    // 일요일 → 다음 월요일
    const observed = new Date(holidayDate);
    observed.setDate(observed.getDate() + 1);
    return [observed];
  } else if (dow === 6) {
    // 토요일 → 전날 금요일
    const observed = new Date(holidayDate);
    observed.setDate(observed.getDate() - 1);
    return [observed];
  }
  return [];
}

/**
 * 2) JP 규칙에 따른 대체공휴일 날짜 반환 (배열)
 * 일요일이 공휴일이면 다음날 월요일
 * 다음 월요일이 다른 공휴일과 겹치면 -> 그 다음 평일까지 밀림
 * 토요일 공휴일은 지정 안함
 */
export function getJPSubstituteDates(
  baseHolidays: Record<string, string>, // { '2023-01-01': 'New Year', ... } 형태
  holidayDate: Date
): Date[] {
  const result: Date[] = [];
  const dow = holidayDate.getDay();

  // (1) Sunday case: 다음날 월요일을 대체공휴일로 지정
  if (dow === 0) {
    const observed = new Date(holidayDate);
    observed.setDate(observed.getDate() + 1);
    // 만약 다음날도 이미 다른 공휴일이라면, 계속 다음 평일까지 밀기
    while (true) {
      const key = format(observed, 'yyyy-MM-dd');
      if (!baseHolidays[key]) {
        result.push(new Date(observed));
        break;
      }
      observed.setDate(observed.getDate() + 1);
    }
  }

  return result;
}

/**
 * 3) AU 규칙에 따른 대체공휴일 날짜 반환 (배열)
 * 토요일/일요일이 공휴일이면 다음 평일로 이동
 * 대체일이 또 다른 공휴일과 겹치면 그 다음 평일까지 순차적으로 밀어서 지정
 * 단, 부활절 관련 공휴일은 이미 연속 4일이므로 대체휴일 계산에서 제외
 */
export function getAUSubstituteDates(
  baseHolidays: Record<string, string>, // { '2025-01-01': 'New Year', ... } 형태
  holidayDate: Date
): Date[] {
  const result: Date[] = [];
  const dow = holidayDate.getDay(); // 0=일, 1=월, ..., 6=토
  const key = format(holidayDate, 'yyyy-MM-dd');
  const holidayName = baseHolidays[key] || '';

  // 부활절 관련 공휴일은 대체휴일 계산에서 제외 (이미 연속 4일 공휴일)
  if (holidayName.includes('Easter') || holidayName.includes('Good Friday')) {
    return result;
  }

  // 토요일(6) 또는 일요일(0)인 경우 다음 평일로 이동
  if (dow === 0 || dow === 6) {
    const observed = new Date(holidayDate);
    
    // 다음 평일 찾기
    do {
      observed.setDate(observed.getDate() + 1);
    } while (observed.getDay() === 0 || observed.getDay() === 6); // 주말이면 계속 진행
    
    // 대체일이 다른 공휴일과 겹치는지 확인하고, 겹치면 다음 평일까지 밀기
    while (true) {
      const obsKey = format(observed, 'yyyy-MM-dd');
      const isWeekend = observed.getDay() === 0 || observed.getDay() === 6;
      
      // 평일이고 기존 공휴일과 겹치지 않으면 확정
      if (!baseHolidays[obsKey] && !isWeekend) {
        result.push(new Date(observed));
        break;
      }
      
      // 겹치거나 주말이면 하루 더 밀기
      observed.setDate(observed.getDate() + 1);
    }
  }

  return result;
}

/**
 * 4) SG 규칙에 따른 대체공휴일 날짜 반환 (배열)
 * 일요일이 공휴일이면 다음날 월요일
 * 대체일이 또 다른 공휴일과 겹치면 그 다음 평일까지 밀림
 * 토요일 공휴일은 대체휴일 지정 안함
 */
export function getSGSubstituteDates(
  baseHolidays: Record<string, string>, // { '2025-01-01': 'New Year', ... } 형태
  holidayDate: Date
): Date[] {
  const result: Date[] = [];
  const dow = holidayDate.getDay();

  // 일요일(0)인 경우만 대체공휴일 지정
  if (dow === 0) {
    const observed = new Date(holidayDate);
    observed.setDate(observed.getDate() + 1);
    
    // 만약 다음날도 이미 다른 공휴일이라면, 계속 다음 평일까지 밀기
    while (true) {
      const key = format(observed, 'yyyy-MM-dd');
      const isWeekend = observed.getDay() === 0 || observed.getDay() === 6;
      
      // 평일이고 기존 공휴일과 겹치지 않으면 확정
      if (!baseHolidays[key] && !isWeekend) {
        result.push(new Date(observed));
        break;
      }
      
      // 겹치거나 주말이면 하루 더 밀기
      observed.setDate(observed.getDate() + 1);
    }
  }

  return result;
}

/**
 * KR 대체공휴일 계산 로직
 * 일요일→다음 월요일 (연속 대체공휴일 고려: 예: 월요일도 공휴일이면 다음날까지 계속
 * 공휴일 겹치면 "이름1 + 이름2" 형태로 저장됨
 * KR 은 음력때문에 공휴일이 겹치는 케이스가 있음
 *
 * @param baseHolidaysMap  "YYYY-MM-DD" → "공휴일 이름" 또는 "이름1 + 이름2" 형태 맵
 * @param holidayDate      실제 기념일(Date 객체)
 * @returns Date[]         대체공휴일 날짜 목록
 */
export function getKRSubstituteDates(
  baseHolidaysMap: Record<string, string>,
  holidayDate: Date
): Date[] {
  const result: Date[] = [];
  const key0 = format(holidayDate, 'yyyy-MM-dd');
  const dow = holidayDate.getDay(); // 0=일, 1=월, …, 6=토

  // ① 일요일이거나, ② 겹치는 공휴일("이름1 + 이름2")일 때 대체 대상으로 지정
  const names = baseHolidaysMap[key0] ?? '';
  const overlapping = names.includes(' + ');

  // 설날 연휴 특별 처리: 설날 관련 날짜들은 연휴 전체를 고려해야 함
  const isSeollal = names.includes('설날');
  
  if (isSeollal) {
    // 설날 연휴의 경우, 전체 연휴에서 일요일이 있는지 확인
    const seollalDates = [];
    for (const [dateKey, name] of Object.entries(baseHolidaysMap)) {
      if (name.includes('설날')) {
        seollalDates.push(parseISO(dateKey));
      }
    }
    
    // 설날 연휴 중 일요일이 있는지 확인
    const hasSunday = seollalDates.some(date => date.getDay() === 0);
    
    if (hasSunday) {
      // 연휴 중 가장 늦은 날짜 찾기
      const lastSeollalDate = seollalDates.sort((a, b) => a.getTime() - b.getTime()).pop();
      
      // 연휴 마지막 날 다음날부터 평일 찾기 (단, 현재 처리중인 날짜가 연휴 마지막 날인 경우에만)
      if (holidayDate.getTime() === lastSeollalDate.getTime()) {
        let obs = new Date(lastSeollalDate);
        do {
          obs.setDate(obs.getDate() + 1);
          const obsKey = format(obs, 'yyyy-MM-dd');
          const isWeekend = obs.getDay() === 0 || obs.getDay() === 6;

          if (!baseHolidaysMap[obsKey] && !isWeekend) {
            result.push(new Date(obs));
            break;
          }
        } while (true);
      }
    }
  } else {
    // 일반 공휴일 대체휴일 처리 (기존 로직)
    if (dow === 0 || overlapping) {
      // 다음 날부터 검사
      let obs = new Date(holidayDate);
      do {
        obs.setDate(obs.getDate() + 1);
        const obsKey = format(obs, 'yyyy-MM-dd');
        const isWeekend = obs.getDay() === 0 || obs.getDay() === 6;

        // 1) obsKey가 또 다른 실제 공휴일이면(=baseHolidaysMap에 존재) 밀어야 함  
        // 2) obs가 주말(토·일)이라면 평일이 될 때까지 밀어야 함
        if (!baseHolidaysMap[obsKey] && !isWeekend) {
          // 대체공휴일 확정
          result.push(new Date(obs));
          break;
        }
        // 조건에 걸리면 다시 하루씩 밀기
      } while (true);
    }
  }

  return result;
} 