// # isHoliday, getHoliday 함수

import { parseISO, format } from "date-fns";
import { lunar2solar } from 'solarlunar'; // npm install solarlunar
import { easter } from 'date-easter'; // npm install date-easter
import usHolidays from '../holidays/us.json';
import jpHolidays from '../holidays/jp.json';
import krHolidays from '../holidays/kr.json';
import auHolidays from '../holidays/au.json';
import { _getCustomHolidaysForUtils } from './custom';


interface HolidayRule {
  name: string;
  type: 'fixed' | 'weekday' | 'lunar'; // type: "fixed" (양력 고정), "weekday" (요일제), "lunar" (음력)
  month: number;
  day?: number;       // type="fixed" 일 때만 존재
  week?: number;      // type="weekday" 일 때만 존재
  weekday?: number;   // type="weekday": 1=월요일, …, 7=일요일
}



/** country 코드에 따라 알맞은 룰셋을 반환 */
function getRulesForCountry(country: string, year?: number): HolidayRule[] {
  let baseRules: HolidayRule[] = [];
  
  switch (country.toLowerCase()) {
    case 'us':
      baseRules = usHolidays as HolidayRule[];
      break;
    case 'jp':
      baseRules = jpHolidays as HolidayRule[];
      break;
    case 'kr':
      baseRules = krHolidays as HolidayRule[];
      break;
    case 'au':
      baseRules = auHolidays as HolidayRule[];
      break;
    default:
      throw new Error(`지원하지 않는 country 코드: ${country}`);
  }
  
  // 커스텀 공휴일 추가 (year를 고려하여 필터링)
  // 참고: 커스텀 공휴일은 fixed 타입만 지원
  const customRules = _getCustomHolidaysForUtils(country);
  const filteredCustomRules = customRules.filter(rule => {
    // recurring이 명시적으로 false가 아니면 매년 반복 (기본값 true)
    if (rule.recurring !== false) {
      return true; // 매년 반복 공휴일
    }
    
    // recurring이 false인 경우, year가 일치하는지 확인
    return year !== undefined && rule.year === year;
  });
  
  return [...baseRules, ...filteredCustomRules];
}


/** 
 * 주어진 연도(year)와 룰(rule)을 바탕으로, 실제 "기념일 날짜"를 계산해 반환 
 * - type: "fixed"   → 양력 고정
 * - type: "weekday" → 요일제 (US/JP 용)
 * - type: "lunar"   → 음력 → 양력 변환 (KR 용)
 */
function computeRuleDate(rule: HolidayRule, year: number): Date {
  if (rule.type === 'fixed') {
    // 고정 날짜 → 바로 Date 생성 (month-1, day)
    return new Date(year, rule.month - 1, rule.day!);
  } else if( rule.type === 'weekday') {
    // 요일제 날짜
    // rule.weekday: 1=월, …, 7=일 (JS Date.getDay(): 0=일, 1=월, …, 6=토)
    const targetJsWeekday = rule.weekday! % 7; // 7→0(일요일)

    // 해당 달의 1일
    const firstOfMonth = new Date(year, rule.month - 1, 1);
    const firstDayOfWeek = firstOfMonth.getDay(); // 0=일,1=월,…,6=토

    let dateNum: number;
    if (rule.week! > 0) {
      // 예: 3번째 월요일 → lag = (desiredJsWeekday - firstDayOfWeek + 7)%7
      const lag = (targetJsWeekday - firstDayOfWeek + 7) % 7;
      dateNum = 1 + lag + (rule.week! - 1) * 7;
    } else {
      // rule.week === -1 (마지막 주)
      // 우선 그 달 마지막 날짜 구하기
      const lastOfMonth = new Date(year, rule.month, 0); // 0 = 이전 달 마지막 날
      const lastDayOfWeek = lastOfMonth.getDay(); // 0=일,1=월,…,6=토
      // lag = (lastDayOfWeek - targetJsWeekday + 7)%7 
      const lag = (lastDayOfWeek - targetJsWeekday + 7) % 7;
      dateNum = lastOfMonth.getDate() - lag;
    }
    return new Date(year, rule.month - 1, dateNum);
  } else {
    // type === 'lunar' (KR)
    // lunar2solar(year, 월, 일) → { cYear, cMonth, cDay }
    const { cYear, cMonth, cDay } = lunar2solar(year, rule.month, rule.day!);
    return new Date(cYear, cMonth - 1, cDay);
  }
}

/**
 * 1) US 규칙에 따른 Observed Holiday 날짜 반환 (배열)
 * 토요일이 공휴일이면 -> 전날 금요일
 * 일요일이 공휴일이면 -> 다음날 월요일
 */
function getUSObservedDates(holidayDate: Date): Date[] {
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
function getJPSubstituteDates(
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
function getAUSubstituteDates(
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

/** KR: 일요일→다음 월요일 (연속 대체공휴일 고려: 예: 월요일도 공휴일이면 다음날까지 계속) */
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
function getKRSubstituteDates(
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


/**
 * baseHolidaysMap에 "설날(음력 1/1)" 당일과
 * 그 전·후 이틀(연휴)을 추가하는 헬퍼
 *
 * @param baseMap   YYYY-MM-DD → 공휴일 이름 맵
 * @param date      설날 당일(Date 객체, computeRuleDate로 구해진 값) - 음력 1월 1일에 해당하는 양력 날짜
 * @param name      "설날"과 같이 공휴일 이름
 */
/**
 * 호주 부활절 관련 공휴일을 baseMap에 추가
 * Good Friday, Easter Saturday, Easter Sunday, Easter Monday
 */
function addAustralianEasterEntries(baseMap: Record<string, string>, year: number) {
  const easterData = easter(year); // { year: 2025, month: 3, day: 20 } (month는 0-based가 아님)
  const easterDate = new Date(easterData.year, easterData.month - 1, easterData.day); // month를 0-based로 변환
  
  // Good Friday: 부활절 2일 전 (금요일)
  const goodFriday = new Date(easterDate);
  goodFriday.setDate(goodFriday.getDate() - 2);
  const goodFridayKey = format(goodFriday, 'yyyy-MM-dd');
  baseMap[goodFridayKey] = 'Good Friday';
  
  // Easter Saturday: 부활절 1일 전 (토요일)
  const easterSaturday = new Date(easterDate);
  easterSaturday.setDate(easterSaturday.getDate() - 1);
  const easterSaturdayKey = format(easterSaturday, 'yyyy-MM-dd');
  baseMap[easterSaturdayKey] = 'Easter Saturday';
  
  // Easter Sunday: 부활절 당일 (일요일)
  const easterSundayKey = format(easterDate, 'yyyy-MM-dd');
  baseMap[easterSundayKey] = 'Easter Sunday';
  
  // Easter Monday: 부활절 1일 후 (월요일)
  const easterMonday = new Date(easterDate);
  easterMonday.setDate(easterMonday.getDate() + 1);
  const easterMondayKey = format(easterMonday, 'yyyy-MM-dd');
  baseMap[easterMondayKey] = 'Easter Monday';
}

function addLunarNewYearEntries(baseMap: Record<string, string>, date: Date, name: string) {
  // 한국의 설날 연휴는 음력 1월 1일을 기준으로 전날-당일-다음날 총 3일
  // 하지만 공식적인 "설날"은 가운데 날(당일)이 아니라 일요일이 아닌 날로 조정될 수 있음
  
  // 음력 1월 1일이 토요일인 경우 (2027년), 실제 연휴 구성:
  // - 토요일(음력 1/1): 설날 연휴
  // - 일요일: 설날 (공식)  
  // - 월요일: 설날 연휴
  
  const lunarNewYearDate = new Date(date); // 음력 1월 1일
  const dayOfWeek = lunarNewYearDate.getDay(); // 0=일, 1=월, ..., 6=토
  
  if (dayOfWeek === 6) {
    // 음력 1월 1일이 토요일인 경우 (2027년과 같은 경우)
    // 토요일: 설날 연휴, 일요일: 설날, 월요일: 설날 연휴
    
    // 토요일 (음력 1/1)
    const saturdayKey = format(lunarNewYearDate, 'yyyy-MM-dd');
    baseMap[saturdayKey] = `${name} 연휴`;
    
    // 일요일 (음력 1/2)
    const sunday = new Date(lunarNewYearDate);
    sunday.setDate(sunday.getDate() + 1);
    const sundayKey = format(sunday, 'yyyy-MM-dd');
    baseMap[sundayKey] = name;
    
    // 월요일 (음력 1/3)
    const monday = new Date(lunarNewYearDate);
    monday.setDate(monday.getDate() + 2);
    const mondayKey = format(monday, 'yyyy-MM-dd');
    baseMap[mondayKey] = `${name} 연휴`;
    
  } else {
    // 일반적인 경우: 음력 1월 1일 전날-당일-다음날
    
    // (b) 설날 전날 (date - 1)
    const prev = new Date(date);
    prev.setDate(prev.getDate() - 1);
    const prevKey = format(prev, 'yyyy-MM-dd');
    const prevName = `${name} 연휴`;
    if (baseMap[prevKey]) {
      baseMap[prevKey] += ' + ' + prevName;
    } else {
      baseMap[prevKey] = prevName;
    }

    // (a) 설날 당일 (음력 1월 1일)
    const todayKey = format(date, 'yyyy-MM-dd');
    if (baseMap[todayKey]) {
      baseMap[todayKey] += ' + ' + name;
    } else {
      baseMap[todayKey] = name;
    }

    // (c) 설날 다음날 (date + 1)
    const next = new Date(date);
    next.setDate(next.getDate() + 1);
    const nextKey = format(next, 'yyyy-MM-dd');
    const nextName = `${name} 연휴`;
    if (baseMap[nextKey]) {
      baseMap[nextKey] += ' + ' + nextName;
    } else {
      baseMap[nextKey] = nextName;
    }
  }
}




/**
 * 입력한 날짜(input)가 해당 country의 공휴일(실제 혹은 Observed/Substitute)인지 확인
 */
export function isHoliday(country: string, input: string | Date): boolean {
  const d: Date = typeof input === 'string' ? parseISO(input) : input;
  const year = d.getFullYear();
  const key = format(d, 'yyyy-MM-dd');

  const rules = getRulesForCountry(country, year);

  // (1) baseHolidaysMap: "YYYY-MM-DD" → "이름" 또는 "이름1 + 이름2" 형태로 저장
  // 기본 공휴일 + 커스텀 공휴일을 모두 포함
  const baseHolidaysMap: Record<string, string> = {};
  
  for (const rule of rules) {
    // rule이 음력 1/1인 경우는 헬퍼로 따로 처리
    if (rule.type === 'lunar' && rule.month === 1 && rule.day === 1) {
      continue;
    }

    const hd = computeRuleDate(rule, year);
    const hKey = format(hd, 'yyyy-MM-dd');

    if (baseHolidaysMap[hKey]) {
      // 이미 같은 날짜에 이름이 있으면, "이전 + 현재"로 합치기
      baseHolidaysMap[hKey] = baseHolidaysMap[hKey] + ' + ' + rule.name;
    } else {
      baseHolidaysMap[hKey] = rule.name;
    }
  }

  // (2) KR인 경우, 음력 1/1(설날) + 전후 이틀을 헬퍼로 추가
  if (country.toLowerCase() === 'kr') {
    // 2-1) computeRuleDate로 음력 1/1 날짜 계산
    const { cYear, cMonth, cDay } = lunar2solar(year, 1, 1);
    const newYearDate = new Date(cYear, cMonth - 1, cDay);
    // 2-2) 헬퍼 호출: baseHolidaysMap, 설날 날짜(Date), "설날" 이름
    addLunarNewYearEntries(baseHolidaysMap, newYearDate, '설날');
  }

  // (3) AU인 경우, 부활절 관련 4개 공휴일을 헬퍼로 추가
  if (country.toLowerCase() === 'au') {
    addAustralianEasterEntries(baseHolidaysMap, year);
  }

  // (2) 실제 기념일인지 체크
  if (baseHolidaysMap[key]) {
    return true;
  }

  // (3) country별 대체/Observed 매칭
  // 모든 국가에서 커스텀 공휴일의 substituteHoliday 옵션 적용
  const customRules = _getCustomHolidaysForUtils(country);
  
  switch (country.toLowerCase()) {
    case 'us':
      for (const [hKey] of Object.entries(baseHolidaysMap)) {
        const hd = parseISO(hKey);
        
        // 이 날짜가 substituteHoliday: false인 커스텀 공휴일인지 확인
        const isNoSubstituteCustomHoliday = customRules.some(cr => {
          if (cr.substituteHoliday === false) {
            // recurring 필터링
            if (cr.recurring === false && cr.year !== year) {
              return false;
            }
            const customHolidayDate = new Date(year, cr.month - 1, cr.day);
            return format(customHolidayDate, 'yyyy-MM-dd') === hKey;
          }
          return false;
        });
        
        // substituteHoliday: false인 커스텀 공휴일은 대체휴일 계산에서 제외
        if (!isNoSubstituteCustomHoliday) {
          const obs = getUSObservedDates(hd);
          for (const o of obs) {
            if (format(o, 'yyyy-MM-dd') === key) return true;
          }
        }
      }
      break;

    case 'jp':
      for (const [hKey] of Object.entries(baseHolidaysMap)) {
        const hd = parseISO(hKey);
        
        // 이 날짜가 substituteHoliday: false인 커스텀 공휴일인지 확인
        const isNoSubstituteCustomHoliday = customRules.some(cr => {
          if (cr.substituteHoliday === false) {
            // recurring 필터링
            if (cr.recurring === false && cr.year !== year) {
              return false;
            }
            const customHolidayDate = new Date(year, cr.month - 1, cr.day);
            return format(customHolidayDate, 'yyyy-MM-dd') === hKey;
          }
          return false;
        });
        
        // substituteHoliday: false인 커스텀 공휴일은 대체휴일 계산에서 제외
        if (!isNoSubstituteCustomHoliday) {
          const subs = getJPSubstituteDates(baseHolidaysMap, hd);
          for (const s of subs) {
            if (format(s, 'yyyy-MM-dd') === key) return true;
          }
        }
      }
      break;

    case 'kr':
      for (const [hKey] of Object.entries(baseHolidaysMap)) {
        const hd = parseISO(hKey);
        
        // 이 날짜가 substituteHoliday: false인 커스텀 공휴일인지 확인
        const isNoSubstituteCustomHoliday = customRules.some(cr => {
          if (cr.substituteHoliday === false) {
            // recurring 필터링
            if (cr.recurring === false && cr.year !== year) {
              return false;
            }
            const customHolidayDate = new Date(year, cr.month - 1, cr.day);
            return format(customHolidayDate, 'yyyy-MM-dd') === hKey;
          }
          return false;
        });
        
        // substituteHoliday: false인 커스텀 공휴일은 대체휴일 계산에서 제외
        if (!isNoSubstituteCustomHoliday) {
          const subs = getKRSubstituteDates(baseHolidaysMap, hd);
          for (const s of subs) {
            if (format(s, 'yyyy-MM-dd') === key) return true;
          }
        }
      }
      break;

    case 'au':
      for (const [hKey] of Object.entries(baseHolidaysMap)) {
        const hd = parseISO(hKey);
        
        // 이 날짜가 substituteHoliday: false인 커스텀 공휴일인지 확인
        const isNoSubstituteCustomHoliday = customRules.some(cr => {
          if (cr.substituteHoliday === false) {
            // recurring 필터링
            if (cr.recurring === false && cr.year !== year) {
              return false;
            }
            const customHolidayDate = new Date(year, cr.month - 1, cr.day);
            return format(customHolidayDate, 'yyyy-MM-dd') === hKey;
          }
          return false;
        });
        
        // substituteHoliday: false인 커스텀 공휴일은 대체휴일 계산에서 제외
        // 호주는 토요일/일요일 → 다음 평일로 이동 (겹치면 순차적으로 밀기)
        if (!isNoSubstituteCustomHoliday) {
          const subs = getAUSubstituteDates(baseHolidaysMap, hd);
          for (const s of subs) {
            if (format(s, 'yyyy-MM-dd') === key) return true;
          }
        }
      }
      break;
  }

  return false;
}