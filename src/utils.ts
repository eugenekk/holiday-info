// # isHoliday, getHoliday 함수

import { parseISO, format } from "date-fns";
import { loadHolidays } from "./loader";
import { Holiday } from "./types";

let holidaysCache: Holiday[] = [];
let initialized = false;

/**
 * country와 year(숫자 또는 숫자 배열)를 받아
 * S3에서 해당 년도 데이터를 로드해 한 번만 캐시에 저장합니다.
 * @param country ISO 국가 코드
 * @param year 단일 year 또는 [year, nextYear, …]
 * @returns { isLoaded: boolean }
 */

export async function initializeHoliday(country: string, year: number | number[]): Promise<{ isLoaded: boolean }> {
  const years = Array.isArray(year) ? year : [year];
  try {
    // 병렬로 각 년도 데이터를 로드
    const lists = await Promise.all(
      years.map(async (y) => {
        try {
          return await loadHolidays(country, y);
        } catch (err: any) {
          // 에러 코드 또는 이름
          const code = err.code ?? err.name;
          console.error(
            `[holiday-info] 🚨 공휴일 데이터 로드 실패\n` +
            `  • Country: ${country}\n` +
            `  • Year   : ${y}\n` +
            `  • Error  : ${code} – ${err.message}\n` +
            `  • Action : 해당 년도는 빈 리스트로 대체됩니다.\n` +
            `  • Note   : 문제가 발생하면 GitHub 레포지토리에 이슈를 제보해주세요.`
          );
          return [] as Holiday[];
        }
      })
    );

    // 2차원 배열을 평탄화(flat)해서 캐시에 저장
    holidaysCache = lists.flat();
    initialized = true;

    return { isLoaded: true };
  } catch (e) {
    console.error('initializeHoliday 실패:', e);
    return { isLoaded: false };
  }
}

export function isHoliday(input: string|Date): boolean {
   if (!initialized) {
    throw new Error('initializeHoliday()를 먼저 호출하고, isLoaded를 확인하세요.');
  }

  const d = typeof input === "string" ? parseISO(input) : input;
  const key = format(d, "yyyy-MM-dd");
    
  const answer = holidaysCache.some(h => h.date === key);

  return answer
}

export function getHoliday(input: string|Date): string | null {
  if (!initialized) {
    throw new Error('initializeHoliday()를 먼저 호출하고, isLoaded를 확인하세요.');
  }

  const d = typeof input === "string" ? parseISO(input) : input;
  const key = format(d, "yyyy-MM-dd");
  
  const found = holidaysCache.find(h => h.date === key);
  return found ? found.name : null;
}

