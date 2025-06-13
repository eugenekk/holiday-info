declare module 'hijri-date' {
  class HijriDate {
    constructor(year: number, month: number, day: number);
    constructor(date: Date);
    toGregorian(): Date;
    getFullYear(): number;
    getMonth(): number;
    getDate(): number;
  }
  export = HijriDate;
} 