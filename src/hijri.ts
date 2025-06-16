// src/utils/hijri.ts

import HijriDate, { toHijri } from 'hijri-date/lib/safe';

/**
 * 히즈리력(Hijri) 연도·월·일을 그레고리력(Date)으로 변환
 * @param hijriYear  히즈리력 연도 (e.g. 1446)
 * @param hijriMonth 히즈리력 월   (1=무하람…12=두알히자)
 * @param hijriDay   히즈리력 일   (1~30)
 * @returns           변환된 그레고리력 Date 객체
 */
export function hijriToGregorian(
  hijriYear: number,
  hijriMonth: number,
  hijriDay: number
): Date {
  const hd = new HijriDate(hijriYear, hijriMonth, hijriDay);
  const date = hd.toGregorian();
  // UTC 기준으로 변환된 날짜에 하루를 더함
  const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
  // 현지 시간으로 조정 (UTC+8)
  const localDate = new Date(nextDay.getTime() + 8 * 60 * 60 * 1000);
  // 날짜만 추출 (시간 정보 제거)
  return new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate());
}

/**
 * 그레고리력(Date)을 히즈리력(Hijri)으로 변환
 * @param date 그레고리력 Date 객체
 * @returns    히즈리력 연도·월·일 객체
 */
export function gregorianToHijri(date: Date): { year: number; month: number; day: number } {
  // 현지 시간으로 조정 (UTC+8)
  const localDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  // 날짜만 추출 (시간 정보 제거)
  const dateOnly = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate());
  return toHijri(dateOnly);
}
