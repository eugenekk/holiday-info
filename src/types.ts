// /Holiday 인터페이스


export interface Holiday {
  date: string;  // YYYY-MM-DD
  name: string;  // 공휴일 이름
}

export interface HolidayRule {
  name: string;
  type: 'fixed' | 'weekday' | 'lunar' | 'easter' | 'hijri' | 'lunar-year' | 'data' | ''; // type: "fixed" (양력 고정), "weekday" (요일제), "lunar" (음력), "easter" (부활절), "hijri" (히즈리력), "lunar-year" (음력 새해연휴), "data" (날짜 데이터 리스트), "" (특별 처리)
  month?: number;     // type="easter"인 경우 없을 수 있음
  day?: number;       // type="fixed" 일 때만 존재
  week?: number;      // type="weekday" 일 때만 존재
  weekday?: number;   // type="weekday": 1=월요일, …, 7=일요일
  hijriMonth?: number; // 히즈리력 월 (1~12)
  hijriDay?: number;   // 히즈리력 일 (1~30)
  expectMonth?: number; // 예상 그레고리력 월 (0-based)
  expectDay?: number;   // 예상 그레고리력 일 (1~31)
  recurring?: boolean; // 매년 반복 여부 (기본값: true)
  year?: number;      // recurring=false일 때 특정 연도 지정
  data?: string[];   // type="data" 일 때만 존재, YYYY-MM-DD 형식의 날짜 리스트
}