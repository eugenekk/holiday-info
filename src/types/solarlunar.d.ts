// src/types/solarlunar.d.ts

declare module 'solarlunar' {
  interface SolarLunarResult {
    cYear: number;
    cMonth: number;
    cDay: number;
    // 추가로 필요하다면 다음 필드도 선언할 수 있습니다.
    // gzYear?: string;
    // gzMonth?: string;
    // gzDay?: string;
    // AnimalsYear?: string;
    // isLeap?: number;
    // 等등…
  }

  /**
   * 음력(lunarDate)을 양력(solarDate)으로 변환합니다.
   * @param lunarYear  음력 연도 (예: 2025)
   * @param lunarMonth 음력 월   (1~12)
   * @param lunarDay   음력 일   (1~30)
   * @returns 양력 { cYear, cMonth, cDay } 객체
   */
  export function lunar2solar(
    lunarYear: number,
    lunarMonth: number,
    lunarDay: number
  ): SolarLunarResult;

  /**
   * 양력(solarDate)을 음력(lunarDate)으로 변환합니다.
   * @param solarYear  양력 연도 (예: 2025)
   * @param solarMonth 양력 월   (1~12)
   * @param solarDay   양력 일   (1~31)
   * @returns 음력 { lYear, lMonth, lDay, isleap } 객체 등
   */
  export function solar2lunar(
    solarYear: number,
    solarMonth: number,
    solarDay: number
  ): {
    lYear: number;
    lMonth: number;
    lDay: number;
    isleap: number;
    // 필요하다면 추가 필드도 선언 …
  };
}
