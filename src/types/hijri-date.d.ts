declare module 'hijri-date/lib/safe' {
  export class HijriDate {
    constructor(year: number, month: number, day: number);
    constructor(date: Date);
    toGregorian(): Date;
    getFullYear(): number;
    getMonth(): number;
    getDate(): number;
  }

  export function toHijri(date: Date): { year: number; month: number; day: number };
  
  export default HijriDate;
} 