import { format } from 'date-fns';
import { lunar2solar } from 'solarlunar'; // npm install solarlunar


/**
 * baseHolidaysMap에 "설날(음력 1/1)" 당일과
 * 그 전·후 이틀(연휴)을 추가하는 헬퍼
 *
 * @param baseMap   YYYY-MM-DD → 공휴일 이름 맵
 * @param date      설날 당일(Date 객체, computeRuleDate로 구해진 값) - 음력 1월 1일에 해당하는 양력 날짜
 * @param name      "설날"과 같이 공휴일 이름
 */
export function addKrLunarNewYearEntries(baseMap: Record<string, string>, date: Date, name: string) {
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
 * 싱가포르의 설날 연휴를 추가
 * @param year 연도
 * @param baseHolidaysMap 공휴일 맵
 */
export function addSgLunarNewYearEntries( baseHolidaysMap: Record<string, string>, year: number) {
  // 음력 1월 1일
  const { cYear: cnyYear, cMonth: cnyMonth, cDay: cnyDay } = lunar2solar(year, 1, 1);
  const chineseNewYearDate = new Date(cnyYear, cnyMonth - 1, cnyDay);
  const chineseNewYearKey = format(chineseNewYearDate, 'yyyy-MM-dd');
  baseHolidaysMap[chineseNewYearKey] = 'Lunar New Year\'s Day';

  // 음력 1월 2일
  const { cYear: cnyYear2, cMonth: cnyMonth2, cDay: cnyDay2 } = lunar2solar(year, 1, 2);
  const chineseNewYearDate2 = new Date(cnyYear2, cnyMonth2 - 1, cnyDay2);
  const chineseNewYearKey2 = format(chineseNewYearDate2, 'yyyy-MM-dd');
  baseHolidaysMap[chineseNewYearKey2] = 'Lunar New Year\'s Day';
}


// 대만 설날 연휴
export function addTwLunarNewYearEntries(baseHolidaysMap: Record<string, string>, year: number) {
  // 음력 1월 1일
  const { cYear: cnyYear, cMonth: cnyMonth, cDay: cnyDay } = lunar2solar(year, 1, 1);
  const chineseNewYearDate = new Date(cnyYear, cnyMonth - 1, cnyDay);

  // 설날 전 2일
  const twoDaysBefore = new Date(chineseNewYearDate);
  twoDaysBefore.setDate(chineseNewYearDate.getDate() - 2);
  const twoDaysBeforeKey = format(twoDaysBefore, 'yyyy-MM-dd');
  baseHolidaysMap[twoDaysBeforeKey] = '春節';

  // 설날 전 1일
  const oneDayBefore = new Date(chineseNewYearDate);
  oneDayBefore.setDate(chineseNewYearDate.getDate() - 1);
  const oneDayBeforeKey = format(oneDayBefore, 'yyyy-MM-dd');
  baseHolidaysMap[oneDayBeforeKey] = '春節';

  // 설날 당일
  const chineseNewYearKey = format(chineseNewYearDate, 'yyyy-MM-dd');
  baseHolidaysMap[chineseNewYearKey] = '春節';

  // 설날 후 1일
  const oneDayAfter = new Date(chineseNewYearDate);
  oneDayAfter.setDate(chineseNewYearDate.getDate() + 1);
  const oneDayAfterKey = format(oneDayAfter, 'yyyy-MM-dd');
  baseHolidaysMap[oneDayAfterKey] = '春節';

  // 설날 후 2일
  const twoDaysAfter = new Date(chineseNewYearDate);
  twoDaysAfter.setDate(chineseNewYearDate.getDate() + 2);
  const twoDaysAfterKey = format(twoDaysAfter, 'yyyy-MM-dd');
  baseHolidaysMap[twoDaysAfterKey] = '春節';
}