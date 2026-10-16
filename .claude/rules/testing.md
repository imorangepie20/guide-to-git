---
paths:
  - 'tests/**'
  - 'playwright.config.*'
---

# 테스트 규칙 (Playwright)

- 단위 테스트 러너는 없다. 테스트는 모두 `tests/e2e/*.spec.ts`의 Playwright E2E.
- `webServer`가 빌드 후 preview(`:4321/guide-to-git/`)를 띄운다. `page.goto`는 baseURL 기준 상대 경로(`'./'`, `'./en/guides/x/'`)를 쓴다 — 앞에 `/`를 붙이면 base가 빠진다.
- 로케이터는 접근성 기반(`getByRole`, `getByLabel`, `getByText`) 우선. CSS 클래스 셀렉터 금지(Starlight 업데이트 시 깨짐).
- 테스트 이름은 한국어로, 사용자 관점 동작을 서술("영어 홈에서 시작하기로 이동한다").
- 언어별 동작은 ko/en 각각 확인한다.
- `waitForTimeout` 금지. 웹 퍼스트 assertion(`expect(...).toBeVisible()`)으로 기다린다.
- 스냅샷/스크린샷 비교는 도입하지 않는다(폰트 렌더링 차이로 flaky).
- flaky 테스트는 skip하지 말고 원인을 찾는다. 해결 불가면 사람에게 보고.
