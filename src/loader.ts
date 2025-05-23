// src/loader.ts
import 'dotenv/config';   // .env 파일을 process.env에 주입
import type { Holiday } from "./types";

let cache: Holiday[] | null = null;

export async function loadHolidays(country:string, year: number | number[]): Promise<Holiday[]> {
  if(!country || !year) {
    throw new Error('country와 year를 반드시 입력해야 합니다.');
  }

  if (cache) return cache;

  const url = `${process.env.NEXT_PUBLIC_HOLIDAYS_URL}/${country}/${year}/holidays.json`; ;
   
  if (!url) {
    throw new Error(
      '환경 변수 NEXT_PUBLIC_HOLIDAYS_URL 이 설정되지 않았습니다.'
    );
  }
    // 서버 환경(Node.js) 에서는 fetch 가 내장되어 있으므로 이걸 사용하거나,
  // AWS SDK S3Client 로 대체 구현해도 됨.
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load ${country}/${year}/holidays.json from S3 (${res.status})`);
  }

  // JSON 결과를 로컬 변수에 담아서 Holiday[] 타입임을 보장
  const holidays = (await res.json()) as Holiday[];
  
  cache = holidays;
  
  return holidays;
}
