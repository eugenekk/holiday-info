import { format } from 'date-fns';
import { easter } from 'date-easter';


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