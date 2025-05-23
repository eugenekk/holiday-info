# holiday-info

한국 공휴일 여부를 확인하고, 해당 공휴일 이름을 반환하는 TypeScript 기반 npm 패키지입니다.
기타 국가 지속 추가 예정

---

## 주요 기능

* `loadHolidays(country: string, year: number): Promise<Holiday[]>`
  설정된 S3 URL에서 공휴일 데이터를 한 번만 로드하고 캐싱합니다.
  country : "kr", "us"
  year: 2024, 2025

* `isHoliday(input: string | Date): Promise<boolean>`
  주어진 날짜가 대한민국 공휴일인지 여부를 비동기로 반환합니다.

* `getHoliday(input: string | Date): Promise<string \| null>`
  주어진 날짜가 공휴일인 경우 공휴일 이름을 비동기로 반환하며, 그렇지 않으면 null을 반환합니다.

---

## 설치

```bash
npm install holiday-info
# 또는
yarn add holiday-info
```

---

## 환경 변수 설정

패키지가 로드할 공휴일 JSON 파일 경로를 다음 환경 변수에 설정해야 합니다.

```ts
NEXT_PUBLIC_HOLIDAYS_URL=https://<your-bucket>.s3.<region>.amazonaws.com
```

Next.js 프로젝트의 경우, .env에 추가하면 자동으로 로드됩니다.

순수 Node.js나 Jest 환경에서는 dotenv를 사용해 .env 파일을 로드하세요.


## 사용 예시

```ts
import { isHoliday, getHoliday , initializeHoliday} from 'holiday-info';

// 한 번만
const { isLoaded } = await initializeHoliday("kr", 2025);

// 문자열 입력
console.log(isHoliday('2025-05-05'));        // true
console.log(getHoliday('2025-05-05'));       // "어린이날"

// Date 객체 입력
const today = new Date(2025, 4, 5);
console.log(isHoliday(today));               // true
console.log(getHoliday(today));              // "어린이날"

// 공휴일이 아닐 때
console.log(isHoliday('2025-05-04'));        // false
console.log(getHoliday('2025-05-04'));       // null

```

---

## API

### `loadHolidays(country: string, year: number): Promise<Holiday[]>`

* **returns**: S3에서 로드한 전체 공휴일 목록 (Holiday[])

### `initializeHoliday(): Promise<{ isLoaded: boolean }>`

* **returns**: 공휴일 로드가 완료되었음을 boolean 으로 리턴

### `isHoliday(input: string \| Date): boolean`

* **input**: YYYY-MM-DD 형식 문자열 또는 `Date` 객체
* **returns**: 공휴일이면 `true`, 그렇지 않으면 `false`

### `getHoliday(input: string \| Date): string \| null`

* **input**: YYYY-MM-DD 형식 문자열 또는 `Date` 객체
* **returns**: 공휴일 이름(`string`) 또는 공휴일이 아닐 경우 `null`

---

## 배포

npm version patch    # 1.0.0 → 1.0.1
npm publish

---

## 기여

버그 리포트, 기능 제안은 Issue로 남겨주세요. Pull Request도 언제든 환영합니다.

---

## 라이선스

MIT

