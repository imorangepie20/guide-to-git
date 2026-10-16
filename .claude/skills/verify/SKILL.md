---
name: verify
description: 변경사항을 이 프로젝트 기준으로 검증한다(타입체크→린트→포맷→E2E→빌드, ko/en 쌍 확인). 커밋 전, 작업 완료를 말하기 전, "검증/확인/테스트 돌려줘" 요청 시 사용.
allowed-tools: Bash(git status *) Bash(git diff *) Bash(npm run typecheck *) Bash(npm run lint *) Bash(npm run format:check *) Bash(npm test *) Bash(npm run build *) Bash(npm run check *)
---

## 현재 변경

!`git status --short 2>/dev/null || true`

## 절차 (실패 시 원인 수정 후 해당 단계부터 재실행. 억제·skip 금지)

1. 타입체크: `npm run typecheck` (콘텐츠 frontmatter 스키마 포함)
2. 린트: `npm run lint`
3. 포맷: `npm run format:check` (실패하면 `npm run format` 후 diff 확인)
4. ko/en 쌍: 변경된 `src/content/docs/**` 파일마다 반대 언어 파일이 있는지 확인
   (`src/content/docs/<p>` ↔ `src/content/docs/en/<p>`). 없으면 보고.
5. E2E: 관련 spec만 먼저 `npm test -- tests/e2e/<file>.spec.ts` → 레이아웃·설정·공통 컴포넌트를 건드렸으면 `npm test` 전체.
   (`npm test`는 내부에서 빌드도 하므로 링크 검증까지 포함된다)
6. 실행 확인(UI 변경 시): `npx astro dev --background` 후 변경 페이지를 ko/en으로 확인, 끝나면 `npx astro dev stop`.
7. 빌드(E2E를 건너뛴 경우만): `npm run build` — 깨진 내부 링크 검출.

docs·테스트만 바뀐 경우에도 1–4는 실행한다(콘텐츠도 타입체크 대상).

## 보고

| 단계 | 명령 | 결과(exit) | 비고 |
| ---- | ---- | ---------- | ---- |

마지막에 "검증하지 못한 것"을 명시.
