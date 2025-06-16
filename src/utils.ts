// # isHoliday, getHoliday 함수

import { parseISO, format } from "date-fns";
import { lunar2solar } from 'solarlunar'; // npm install solarlunar
import usHolidays from '../holidays/us.json';
import jpHolidays from '../holidays/jp.json';
import krHolidays from '../holidays/kr.json';
import auHolidays from '../holidays/au.json';
import sgHolidays from '../holidays/sg.json';
import { _getCustomHolidaysForUtils, customHolidays } from './custom';
import { hijriToGregorian, gregorianToHijri } from './hijri';
import {  HolidayRule } from './types';
import { 
  getUSObservedDates,
  getJPSubstituteDates,
  getKRSubstituteDates,
  getAUSubstituteDates,
  getSGSubstituteDates
} from './substitutes';
import {
  addAustralianEasterEntries,
  addSingaporeEasterEntries
} from './easter';
import { addKrLunarNewYearEntries, addSgLunarNewYearEntries } from "./lunar-year";

/**
 * 기본 휴일 정보로 초기화하는 함수
 * @param country 국가 코드 (kr, us, jp, au, sg)
 */
export function initHolidays(country: string): void {
  const countryKey = country.toLowerCase();
  const rules = _getBaseRulesForUtils(countryKey);
  customHolidays.set(countryKey, []);
}

/**
 * utils.ts에서 사용할 내부 API
 * @internal
 */
export function _getBaseRulesForUtils(country: string): HolidayRule[] {
  const countryKey = country.toLowerCase();
  let rules: HolidayRule[] = [];
  
  switch (countryKey) {
    case 'us':
      rules = usHolidays as HolidayRule[];
      break;
    case 'jp':
      rules = jpHolidays as HolidayRule[];
      break;
    case 'kr':
      rules = krHolidays as HolidayRule[];
      break;
    case 'au':
      rules = auHolidays as HolidayRule[];
      break;
    case 'sg':
      rules = sgHolidays as HolidayRule[];
      break;
    default:
      throw new Error(`지원하지 않는 country 코드: ${country}`);
  }

  return rules;
}

/** country 코드에 따라 알맞은 룰셋을 반환 */
function getRulesForCountry(country: string, year?: number): HolidayRule[] {
  const countryKey = country.toLowerCase();
  
  // baseRules에서 기본 휴일 규칙 가져오기
  const baseRules = _getBaseRulesForUtils(countryKey);
  
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
    return new Date(year, rule.month! - 1, rule.day!);
  } else if( rule.type === 'weekday') {
    // 요일제 날짜
    // rule.weekday: 1=월, …, 7=일 (JS Date.getDay(): 0=일, 1=월, …, 6=토)
    const targetJsWeekday = rule.weekday! % 7; // 7→0(일요일)

    // 해당 달의 1일
    const firstOfMonth = new Date(year, rule.month! - 1, 1);
    const firstDayOfWeek = firstOfMonth.getDay(); // 0=일,1=월,…,6=토

    let dateNum: number;
    if (rule.week! > 0) {
      // 예: 3번째 월요일 → lag = (desiredJsWeekday - firstDayOfWeek + 7)%7
      const lag = (targetJsWeekday - firstDayOfWeek + 7) % 7;
      dateNum = 1 + lag + (rule.week! - 1) * 7;
    } else {
      // rule.week === -1 (마지막 주)
      // 우선 그 달 마지막 날짜 구하기
      const lastOfMonth = new Date(year, rule.month!, 0); // 0 = 이전 달 마지막 날
      const lastDayOfWeek = lastOfMonth.getDay(); // 0=일,1=월,…,6=토
      // lag = (lastDayOfWeek - targetJsWeekday + 7)%7 
      const lag = (lastDayOfWeek - targetJsWeekday + 7) % 7;
      dateNum = lastOfMonth.getDate() - lag;
    }
    return new Date(year, rule.month! - 1, dateNum);
  } else if (rule.type === 'lunar') {
    // type === 'lunar' (KR, SG)
    // lunar2solar(year, 월, 일) → { cYear, cMonth, cDay }
    const { cYear, cMonth, cDay } = lunar2solar(year, rule.month!, rule.day!);
    return new Date(cYear, cMonth - 1, cDay);
  } else if (rule.type === 'easter') {
    // type === 'easter' - 동적 계산이 필요한 공휴일 (부활절 등)
    // 별도 처리하므로 여기서는 에러 발생
    throw new Error(`Easter holiday "${rule.name}" should be handled separately`);
  } else if (rule.type === 'hijri') {
    // type === 'hijri' - 히즈리력 변환이 필요한 공휴일
    // 별도 처리하므로 여기서는 에러 발생
    throw new Error(`Hijri holiday "${rule.name}" should be handled separately`);
  } else if (rule.type === 'lunar-year') {
    // type === 'lunar-year' - 동적 계산이 필요한 공휴일 (설날 연휴 등)
    // 별도 처리하므로 여기서는 에러 발생
    throw new Error(`lunar-year holiday "${rule.name}" should be handled separately`);
  }
  // type === '' (빈 스트링) - 특별 처리가 필요한 공휴일
  // 현재는 고정 날짜로 처리 (향후 이슬람력, 힌두력 등 추가 가능)
  return new Date(year, rule.month! - 1, rule.day!);
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
    // rule이 lunar-year인 경우는 헬퍼로 따로 처리
    if (rule.type === 'lunar-year') {
      continue;
    }
    // type이 'easter'인 경우는 별도 헬퍼 함수로 처리하므로 건너뛰기
    if (rule.type === 'easter') {
      continue;
    }
    // type이 'hijri'인 경우는 단순화된 구조로 처리
    if (rule.type === 'hijri' && rule.hijriMonth && rule.hijriDay && rule.expectMonth !== undefined && rule.expectDay !== undefined) {
      // 예상일로 히즈리 연도 추정
      const approxDate = new Date(year, rule.expectMonth - 1, rule.expectDay);
      const { year: hijriYear } = gregorianToHijri(approxDate);
      // 히즈리력 → 그레고리력 변환
      const hijriDate = hijriToGregorian(hijriYear, rule.hijriMonth, rule.hijriDay);
      const hijriKey = format(hijriDate, 'yyyy-MM-dd');
      if (baseHolidaysMap[hijriKey]) {
        baseHolidaysMap[hijriKey] = baseHolidaysMap[hijriKey] + ' + ' + rule.name;
      } else {
        baseHolidaysMap[hijriKey] = rule.name;
      }
      continue;
    }
    // type이 'data'인 경우는 날짜 리스트를 그대로 사용
    if (rule.type === 'data' && rule.data) {
      for (const dateStr of rule.data) {
        if (baseHolidaysMap[dateStr]) {
          baseHolidaysMap[dateStr] = baseHolidaysMap[dateStr] + ' + ' + rule.name;
        } else {
          baseHolidaysMap[dateStr] = rule.name;
        }
      }
      continue;
    }
    // 나머지 일반 규칙 처리
    const hd = computeRuleDate(rule, year);
    const hKey = format(hd, 'yyyy-MM-dd');
    if (baseHolidaysMap[hKey]) {
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
    addKrLunarNewYearEntries(baseHolidaysMap, newYearDate, '설날');
  }

  // (3) AU인 경우, 부활절 관련 4개 공휴일을 헬퍼로 추가
  if (country.toLowerCase() === 'au') {
    addAustralianEasterEntries(baseHolidaysMap, year);
  }

  // (4) SG인 경우, 음력 공휴일들과 부활절 관련 공휴일 추가 처리
  if (country.toLowerCase() === 'sg') {
    // Lunar New Year 연휴 추가
    addSgLunarNewYearEntries(baseHolidaysMap, year);
       
    // Good Friday (부활절 기반) 추가
    addSingaporeEasterEntries(baseHolidaysMap, year);
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

    case 'sg':
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
        // 싱가포르는 일요일 → 월요일 (토요일은 대체휴일 없음)
        if (!isNoSubstituteCustomHoliday) {
          const subs = getSGSubstituteDates(baseHolidaysMap, hd);
          for (const s of subs) {
            if (format(s, 'yyyy-MM-dd') === key) return true;
          }
        }
      }
      break;
  }

  return false;
}

