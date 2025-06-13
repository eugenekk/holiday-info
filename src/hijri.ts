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
  return hd.toGregorian();
}

/**
 * 그레고리력(Date)을 히즈리력(Hijri)으로 변환
 * @param date 그레고리력 Date 객체
 * @returns    히즈리력 연도·월·일 객체
 */
export function gregorianToHijri(date: Date): { year: number; month: number; day: number } {
  return toHijri(date);
}
