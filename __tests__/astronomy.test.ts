import { isHoliday } from '../src/utils';

describe('대만 공휴일 테스트 (TW)', () => {
  it('2025 청명일', () => {
    expect(isHoliday('tw', '2025-04-04')).toBe(true);
  });
}); 