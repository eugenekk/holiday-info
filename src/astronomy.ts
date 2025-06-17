// 24절기 계산이 필요한 케이스

import {  SearchSunLongitude } from 'astronomy-engine';

/**
 * 주어진 연도의 청명(태양 황경 = 15°) 날짜를 반환합니다.
 * @param year 찾고 싶은 연도 (예: 2025)
 * @returns Date 객체 (UTC 기준)
 */
export function getQingming(year: number): Date {
  // ① 검색 시작: 4월 1일 00:00 UTC
  const dateStart = new Date(Date.UTC(year, 3, 1, 0, 0, 0));
  // ② 최대 탐색 기간: 10일 (4/1 → 4/11 사이)
  const limitDays = 10;

  // ③ λ=15° 되는 순간 검색 (반환형 AstroTime | null) :contentReference[oaicite:0]{index=0}
  const event = SearchSunLongitude(15, dateStart, limitDays);

  console.log(event?.date);

  // ④ null 체크
  if (!event) {
    throw new Error(
      `청명(λ=15°)을 ${dateStart.toISOString()}부터 ${limitDays}일 이내에서 찾을 수 없습니다.`
    );
  }

  // ⑤ AstroTime.date 프로퍼티가 JS Date 객체입니다 :contentReference[oaicite:1]{index=1}
  return event.date;
}