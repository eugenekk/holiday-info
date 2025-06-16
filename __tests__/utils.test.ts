import { isHoliday } from "../src/utils";

// ---------------------------
// 미국 공휴일 테스트 (US)
// ---------------------------
describe('미국 공휴일 테스트', () => {
  // 2025년
  test('2025-07-04 (Independence Day) → true', () => {
    expect(isHoliday('us', '2025-07-04')).toBe(true);
  });

  test('2025-11-27 (Thanksgiving Day: 11월 넷째 목요일) → true', () => {
    expect(isHoliday('us', '2025-11-27')).toBe(true);
  });

  test('2025-12-25 (Christmas Day) → true', () => {
    expect(isHoliday('us', '2025-12-25')).toBe(true);
  });

  // 2026년
  test('2026-06-19 (Juneteenth National Independence Day) → true', () => {
    expect(isHoliday('us', '2026-06-19')).toBe(true);
  });

  test('2026-07-03 (Independence Day (Observed)) → true', () => {
    expect(isHoliday('us', '2026-07-03')).toBe(true);
  });

  test('2026-09-07 (Labor Day: 9월 첫째 월요일) → true', () => {
    expect(isHoliday('us', '2026-09-07')).toBe(true);
  });

  // 2027년
  test('2027-01-01 (New Year Day) → true', () => {
    expect(isHoliday('us', '2027-01-01')).toBe(true);
  });

  test('2027-05-31 (Memorial Day: 5월 마지막 월요일) → true', () => {
    expect(isHoliday('us', '2027-05-31')).toBe(true);
  });

  test('2027-11-25 (Thanksgiving Day: 11월 넷째 목요일) → true', () => {
    expect(isHoliday('us', '2027-11-25')).toBe(true);
  });
});

// ---------------------------
// 일본 공휴일 테스트 (JP)
// ---------------------------
describe('일본 공휴일 테스트', () => {
  // 2025년
  test('2025-01-01 (New Year Day) → true', () => {
    expect(isHoliday('jp', '2025-01-01')).toBe(true);
  });

  test('2025-01-13 (Coming of Age Day: 1월 둘째 월요일) → true', () => {
    expect(isHoliday('jp', '2025-01-13')).toBe(true);
  });

  test('2025-05-06 (Constitution Memorial Day 대체공휴일) → true', () => {
    // 2025-05-03이 토요일이므로 대체공휴일은 2025-05-06(화요일)
    expect(isHoliday('jp', '2025-05-06')).toBe(true);
  });

  // 2026년
  test('2026-01-01 (New Year Day) → true', () => {
    expect(isHoliday('jp', '2026-01-01')).toBe(true);
  });

  test('2026-01-12 (Coming of Age Day: 1월 둘째 월요일) → true', () => {
    expect(isHoliday('jp', '2026-01-12')).toBe(true);
  });

  test('2026-05-04 (Greenery Day) → true', () => {
    expect(isHoliday('jp', '2026-05-04')).toBe(true);
  });

  // 2027년
  test('2027-01-01 (New Year Day) → true', () => {
    expect(isHoliday('jp', '2027-01-01')).toBe(true);
  });

  test('2027-01-11 (Coming of Age Day: 1월 둘째 월요일) → true', () => {
    expect(isHoliday('jp', '2027-01-11')).toBe(true);
  });

  test('2027-05-03 (Constitution Memorial Day) → true', () => {
    // 2027-05-03은 월요일, 대체공휴일 없이도 공휴일
    expect(isHoliday('jp', '2027-05-03')).toBe(true);
  });
});

// ---------------------------
// 호주 공휴일 테스트 (AU)
// ---------------------------
describe('호주 공휴일 테스트', () => {
  // 2025년 기본 공휴일
  test('2025-01-01 (New Year Day) → true', () => {
    expect(isHoliday('au', '2025-01-01')).toBe(true);
  });

  test('2025-01-26 (Australia Day) → true', () => {
    expect(isHoliday('au', '2025-01-26')).toBe(true);
  });

  test('2025-01-27 (Australia Day Observed) → true', () => {
    // 2025-01-26은 일요일이므로 2025-01-27(월요일)이 대체공휴일
    expect(isHoliday('au', '2025-01-27')).toBe(true);
  });

  // 2025년 부활절 관련 공휴일 (부활절: 2025-04-20)
  test('2025-04-18 (Good Friday) → true', () => {
    // 부활절 2일 전 금요일
    expect(isHoliday('au', '2025-04-18')).toBe(true);
  });

  test('2025-04-19 (Easter Saturday) → true', () => {
    // 부활절 1일 전 토요일
    expect(isHoliday('au', '2025-04-19')).toBe(true);
  });

  test('2025-04-20 (Easter Sunday) → true', () => {
    // 부활절 당일 일요일
    expect(isHoliday('au', '2025-04-20')).toBe(true);
  });

  test('2025-04-21 (Easter Monday) → true', () => {
    // 부활절 1일 후 월요일
    expect(isHoliday('au', '2025-04-21')).toBe(true);
  });

  test('2025-04-25 (Anzac Day) → true', () => {
    expect(isHoliday('au', '2025-04-25')).toBe(true);
  });

  test('2025-12-25 (Christmas Day) → true', () => {
    expect(isHoliday('au', '2025-12-25')).toBe(true);
  });

  test('2025-12-26 (Boxing Day) → true', () => {
    expect(isHoliday('au', '2025-12-26')).toBe(true);
  });

  // 2026년 기본 공휴일
  test('2026-01-01 (New Year Day) → true', () => {
    expect(isHoliday('au', '2026-01-01')).toBe(true);
  });

  test('2026-01-26 (Australia Day) → true', () => {
    expect(isHoliday('au', '2026-01-26')).toBe(true);
  });

  // 2026년 부활절 관련 공휴일 (부활절: 2026-04-05)
  test('2026-04-03 (Good Friday) → true', () => {
    // 부활절 2일 전 금요일
    expect(isHoliday('au', '2026-04-03')).toBe(true);
  });

  test('2026-04-04 (Easter Saturday) → true', () => {
    // 부활절 1일 전 토요일
    expect(isHoliday('au', '2026-04-04')).toBe(true);
  });

  test('2026-04-05 (Easter Sunday) → true', () => {
    // 부활절 당일 일요일
    expect(isHoliday('au', '2026-04-05')).toBe(true);
  });

  test('2026-04-06 (Easter Monday) → true', () => {
    // 부활절 1일 후 월요일
    expect(isHoliday('au', '2026-04-06')).toBe(true);
  });

  test('2026-04-25 (Anzac Day) → true', () => {
    expect(isHoliday('au', '2026-04-25')).toBe(true);
  });

  test('2026-12-25 (Christmas Day) → true', () => {
    expect(isHoliday('au', '2026-12-25')).toBe(true);
  });

  test('2026-12-28 (Boxing Day Observed) → true', () => {
    // 2026-12-26은 토요일이므로 2026-12-28(월요일)이 대체공휴일
    expect(isHoliday('au', '2026-12-28')).toBe(true);
  });

  // 2027년 기본 공휴일
  test('2027-01-01 (New Year Day) → true', () => {
    expect(isHoliday('au', '2027-01-01')).toBe(true);
  });

  test('2027-01-26 (Australia Day) → true', () => {
    expect(isHoliday('au', '2027-01-26')).toBe(true);
  });

  // 2027년 부활절 관련 공휴일 (부활절: 2027-03-28)
  test('2027-03-26 (Good Friday) → true', () => {
    // 부활절 2일 전 금요일
    expect(isHoliday('au', '2027-03-26')).toBe(true);
  });

  test('2027-03-27 (Easter Saturday) → true', () => {
    // 부활절 1일 전 토요일
    expect(isHoliday('au', '2027-03-27')).toBe(true);
  });

  test('2027-03-28 (Easter Sunday) → true', () => {
    // 부활절 당일 일요일
    expect(isHoliday('au', '2027-03-28')).toBe(true);
  });

  test('2027-03-29 (Easter Monday) → true', () => {
    // 부활절 1일 후 월요일
    expect(isHoliday('au', '2027-03-29')).toBe(true);
  });

  test('2027-04-25 (Anzac Day) → true', () => {
    expect(isHoliday('au', '2027-04-25')).toBe(true);
  });

  test('2027-04-26 (Anzac Day Observed) → true', () => {
    // 2027-04-25는 일요일이므로 2027-04-26(월요일)이 대체공휴일
    expect(isHoliday('au', '2027-04-26')).toBe(true);
  });

  // 평일 테스트 (공휴일이 아닌 날들)
  test('2025-01-28 (평일) → false', () => {
    expect(isHoliday('au', '2025-01-28')).toBe(false);
  });

  test('2025-04-17 (부활절 전 목요일) → false', () => {
    // Good Friday 하루 전은 공휴일이 아님
    expect(isHoliday('au', '2025-04-17')).toBe(false);
  });

  test('2025-04-22 (Easter Monday 다음날) → false', () => {
    // Easter Monday 다음날은 공휴일이 아님
    expect(isHoliday('au', '2025-04-22')).toBe(false);
  });

  test('2025-04-24 (Anzac Day 전날) → false', () => {
    expect(isHoliday('au', '2025-04-24')).toBe(false);
  });

  test('2025-07-15 (여름 평일) → false', () => {
    expect(isHoliday('au', '2025-07-15')).toBe(false);
  });
});

// ---------------------------
// 싱가포르 공휴일 테스트 (SG)
// ---------------------------
describe('싱가포르 공휴일 테스트', () => {
  // 2025년 고정 공휴일
  test('2025-01-01 (New Year Day) → true', () => {
    expect(isHoliday('sg', '2025-01-01')).toBe(true);
  });

  test('2025-05-01 (Labour Day) → true', () => {
    expect(isHoliday('sg', '2025-05-01')).toBe(true);
  });

  test('2025-08-09 (National Day) → true', () => {
    expect(isHoliday('sg', '2025-08-09')).toBe(true);
  });

  test('2025-12-25 (Christmas Day) → true', () => {
    expect(isHoliday('sg', '2025-12-25')).toBe(true);
  });

  // 2025년 음력 공휴일
  test('2025-01-29 (Chinese New Year Day) → true', () => {
    // 음력 1월 1일 = 2025년 1월 29일
    expect(isHoliday('sg', '2025-01-29')).toBe(true);
  });

  test('2025-05-12 (Vesak Day) → true', () => {
    // 음력 4월 15일 = 2025년 5월 12일
    expect(isHoliday('sg', '2025-05-12')).toBe(true);
  });

  // 2025년 부활절 관련 공휴일 (부활절: 2025-04-20)
  test('2025-04-18 (Good Friday) → true', () => {
    // 부활절 2일 전 금요일
    expect(isHoliday('sg', '2025-04-18')).toBe(true);
  });

  test('2025-04-19 (Easter Saturday) → false', () => {
    // 싱가포르는 부활절 당일과 전후일은 공휴일이 아님
    expect(isHoliday('sg', '2025-04-19')).toBe(false);
  });

  test('2025-04-20 (Easter Sunday) → false', () => {
    // 싱가포르는 부활절 당일과 전후일은 공휴일이 아님
    expect(isHoliday('sg', '2025-04-20')).toBe(false);
  });

  test('2025-04-21 (Easter Monday) → false', () => {
    // 싱가포르는 부활절 당일과 전후일은 공휴일이 아님
    expect(isHoliday('sg', '2025-04-21')).toBe(false);
  });

  // 대체휴일 테스트 - 2025년에는 일요일 공휴일이 없으므로 대체휴일 없음
  test('2025-08-10 (National Day 다음날) → false', () => {
    // 2025-08-09는 토요일이므로 대체휴일 없음 (토요일은 대체휴일 적용 안됨)
    expect(isHoliday('sg', '2025-08-10')).toBe(false);
  });

  // 평일 테스트
  test('2025-01-02 (평일) → false', () => {
    expect(isHoliday('sg', '2025-01-02')).toBe(false);
  });

  test('2025-07-15 (평일) → false', () => {
    expect(isHoliday('sg', '2025-07-15')).toBe(false);
  });

  test('2025-11-11 (평일) → false', () => {
    expect(isHoliday('sg', '2025-11-11')).toBe(false);
  });

  // 2026년 부활절 관련 공휴일 (부활절: 2026-04-05)
  test('2026-04-03 (Good Friday) → true', () => {
    // 부활절 2일 전 금요일
    expect(isHoliday('sg', '2026-04-03')).toBe(true);
  });

  test('2026-04-04 (Easter Saturday) → false', () => {
    // 싱가포르는 부활절 당일과 전후일은 공휴일이 아님
    expect(isHoliday('sg', '2026-04-04')).toBe(false);
  });

  test('2026-04-05 (Easter Sunday) → false', () => {
    // 싱가포르는 부활절 당일과 전후일은 공휴일이 아님
    expect(isHoliday('sg', '2026-04-05')).toBe(false);
  });

  test('2026-04-06 (Easter Monday) → false', () => {
    // 싱가포르는 부활절 당일과 전후일은 공휴일이 아님
    expect(isHoliday('sg', '2026-04-06')).toBe(false);
  });

  // 2027년 부활절 관련 공휴일 (부활절: 2027-03-28)
  test('2027-03-26 (Good Friday) → true', () => {
    // 부활절 2일 전 금요일
    expect(isHoliday('sg', '2027-03-26')).toBe(true);
  });

  test('2027-03-27 (Easter Saturday) → false', () => {
    // 싱가포르는 부활절 당일과 전후일은 공휴일이 아님
    expect(isHoliday('sg', '2027-03-27')).toBe(false);
  });

  test('2027-03-28 (Easter Sunday) → false', () => {
    // 싱가포르는 부활절 당일과 전후일은 공휴일이 아님
    expect(isHoliday('sg', '2027-03-28')).toBe(false);
  });

  test('2027-03-29 (Easter Monday) → false', () => {
    // 싱가포르는 부활절 당일과 전후일은 공휴일이 아님
    expect(isHoliday('sg', '2027-03-29')).toBe(false);
  });
});

// ---------------------------
// 한국 공휴일 테스트 (KR)
// ---------------------------
describe('한국 공휴일 테스트 (KR)', () => {
  // 2025년 (이전 예시는 그대로 유지)
  test('2025-01-01 (신정) → true', () => {
    expect(isHoliday('kr', '2025-01-01')).toBe(true);
  });
  test('2025-01-28 (추석연휴1) → true', () => {
    expect(isHoliday('kr', '2025-01-28')).toBe(true);
  });
  test('2025-01-29 (추석) → true', () => {
    expect(isHoliday('kr', '2025-01-29')).toBe(true);
  });
  test('2025-01-30 (추석연휴2) → true', () => {
    expect(isHoliday('kr', '2025-01-30')).toBe(true);
  });

  test('2025-03-01 (3·1절) → true', () => {
    expect(isHoliday('kr', '2025-03-01')).toBe(true);
  });
  test('2025-05-06 (석가탄신일 대체휴일) → true', () => {
    // 2025년 음력 4월 8일 = 2025-05-05 (일) → 대체공휴일 2025-05-06 (월)
    expect(isHoliday('kr', '2025-05-06')).toBe(true);
  });
  test('2025-10-02 (평일) → false', () => {
    expect(isHoliday('kr', '2025-10-02')).toBe(false);
  });
  test('2025-10-03 (개천절) → true', () => {
    expect(isHoliday('kr', '2025-10-03')).toBe(true);
  });
  test('2025-10-05 (추석연휴1) → true', () => {
    expect(isHoliday('kr', '2025-10-05')).toBe(true);
  });
  test('2025-10-06 (추석) → true', () => {
    expect(isHoliday('kr', '2025-10-06')).toBe(true);
  });
  test('2025-10-07 (추석연휴2) → true', () => {
    expect(isHoliday('kr', '2025-10-07')).toBe(true);
  });
  test('2025-10-08 (추석연휴2 대체) → true', () => {
    expect(isHoliday('kr', '2025-10-08')).toBe(true);
  });
  test('2025-10-09 (한글날) → true', () => {
    expect(isHoliday('kr', '2025-10-09')).toBe(true);
  });
  test('2025-10-10 (평일) → false', () => {
    expect(isHoliday('kr', '2025-10-10')).toBe(false);
  });

  // 2026년
  test('2026-02-16 (설날 연휴 전날) → true', () => {
    expect(isHoliday('kr', '2026-02-16')).toBe(true);
  });

  test('2026-02-17 (설날) → true', () => {
    expect(isHoliday('kr', '2026-02-17')).toBe(true);
  });

  test('2026-02-18 (설날 연휴 다음날) → true', () => {
    expect(isHoliday('kr', '2026-02-18')).toBe(true);
  });

  test('2026-03-01 (삼일절) → true', () => {
    expect(isHoliday('kr', '2026-03-01')).toBe(true);
  });
  test('2026-03-02 (삼일절 대체휴일) → true', () => {
    expect(isHoliday('kr', '2026-03-02')).toBe(true);
  });

  test('2026-05-24 (석가탄신일) → true', () => {
    // 2026년 음력 4월 8일 = 2026-05-24 (일)
    expect(isHoliday('kr', '2026-05-24')).toBe(true);
  });

  test('2026-05-25 (석가탄신일 대체휴일) → true', () => {
    // 2026-05-24(일) 실제 석가탄신일 → 대체공휴일 2026-05-25(월)
    expect(isHoliday('kr', '2026-05-25')).toBe(true);
  });

  test('2026-08-15 (광복절) → true', () => {
    expect(isHoliday('kr', '2026-08-15')).toBe(true);
  });

  test('2026-09-24 (추석연휴1) → true', () => {
    expect(isHoliday('kr', '2026-09-24')).toBe(true);
  });
  test('2026-09-25 (추석) → true', () => {
    expect(isHoliday('kr', '2026-09-25')).toBe(true);
  });
  test('2026-09-26 (추석연휴2) → true', () => {
    expect(isHoliday('kr', '2026-09-26')).toBe(true);
  });
  test('2026-09-27 (평일) → false', () => {
    expect(isHoliday('kr', '2026-09-27')).toBe(false);
  });
  test('2026-09-28 (평일) → false', () => {
    expect(isHoliday('kr', '2026-09-28')).toBe(false);
  });

  // 2027년
  test('2027-02-06 (설연휴1) → true', () => {
    expect(isHoliday('kr', '2027-02-06')).toBe(true);
  });
  test('2027-02-07 (설날) → true', () => {
    expect(isHoliday('kr', '2027-02-07')).toBe(true);
  });
  test('2027-02-08 (설연휴2) → true', () => {
    expect(isHoliday('kr', '2027-02-08')).toBe(true);
  });
  test('2027-02-09 (설대체휴일) → true', () => {
    expect(isHoliday('kr', '2027-02-09')).toBe(true);
  });

  test('2027-05-13 (석가탄신일) → true', () => {
    // 2027년 음력 4월 8일 = 2027-05-13 (목)
    expect(isHoliday('kr', '2027-05-13')).toBe(true);
  });

  test('2027-05-14 (석가탄신일 주변 평일) → false', () => {
    // 2027-05-13(목)이 석가탄신일이라 5-14(금)는 공휴일이 아님
    expect(isHoliday('kr', '2027-05-14')).toBe(false);
  });

  test('2027-03-01 (3·1절) → true', () => {
    expect(isHoliday('kr', '2027-03-01')).toBe(true);
  });

  //2028
  test('2028-10-01 (평일) → false', () => {
    expect(isHoliday('kr', '2028-10-01')).toBe(false);
  });
  test('2028-10-02 (추석연휴1) → true', () => {
    expect(isHoliday('kr', '2028-10-02')).toBe(true);
  });
  test('2028-10-03 (추석/개천절) → true', () => {
    expect(isHoliday('kr', '2028-10-03')).toBe(true);
  });
  test('2028-10-04 (추석연휴2) → true', () => {
    expect(isHoliday('kr', '2028-10-04')).toBe(true);
  });
  test('2028-10-05 (개천절대체휴일) → true', () => {
    expect(isHoliday('kr', '2028-10-05')).toBe(true);
  });

});