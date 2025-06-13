// src/utils/hijri.ts

// 1) hijri-date 패키지 임포트
let HijriDate: any = require('hijri-date');
if (HijriDate.default) HijriDate = HijriDate.default;
if (HijriDate.HijriDate) HijriDate = HijriDate.HijriDate;

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
  // HijriDate 생성자에 그대로 년, 월, 일(1-based)을 넘깁니다
  const hd = new HijriDate(hijriYear, hijriMonth, hijriDay);
  // toGregorian()이 Date 객체를 반환
  return hd.toGregorian() as Date;
}

/**
 * 그레고리력(Date)을 히즈리력(Hijri)으로 변환
 * @param date 그레고리력 Date 객체
 * @returns    히즈리력 연도·월·일 객체
 */
export function gregorianToHijri(date: Date): { year: number; month: number; day: number } {
  // HijriDate 생성자에 그레고리력 Date 객체를 넘깁니다
  const hd = new HijriDate(date);
  // 히즈리력 연도·월·일을 반환
  return {
    year: hd.getFullYear(),
    month: hd.getMonth() + 1, // 0-based → 1-based
    day: hd.getDate()
  };
}
