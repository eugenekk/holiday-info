import { format } from 'date-fns';
import { lunar2solar } from 'solarlunar';
import { easter } from 'date-easter';

/**
 * baseHolidaysMap에 "설날(음력 1/1)" 당일과
 * 그 전·후 이틀(연휴)을 추가하는 헬퍼
 *
 * @param baseMap   YYYY-MM-DD → 공휴일 이름 맵
 * @param date      설날 당일(Date 객체, computeRuleDate로 구해진 값) - 음력 1월 1일에 해당하는 양력 날짜
 * @param name      "설날"과 같이 공휴일 이름
 */
export function addLunarNewYearEntries(baseMap: Record<string, string>, date: Date, name: string) {
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
 * 호주 부활절 관련 공휴일을 baseMap에 추가
 * Good Friday, Easter Saturday, Easter Sunday, Easter Monday
 */
export function addAustralianEasterEntries(baseMap: Record<string, string>, year: number) {
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

/**
 * 싱가포르 부활절 관련 공휴일을 baseMap에 추가
 * Good Friday 하루만 공휴일 (부활절 당일과 전후일은 공휴일 아님)
 */
export function addSingaporeEasterEntries(baseMap: Record<string, string>, year: number) {
  const easterData = easter(year); // { year: 2025, month: 3, day: 20 } (month는 0-based가 아님)
  const easterDate = new Date(easterData.year, easterData.month - 1, easterData.day); // month를 0-based로 변환
  
  // Good Friday: 부활절 2일 전 (금요일)
  const goodFriday = new Date(easterDate);
  goodFriday.setDate(goodFriday.getDate() - 2);
  const goodFridayKey = format(goodFriday, 'yyyy-MM-dd');
  baseMap[goodFridayKey] = 'Good Friday';
} 