---
name: sync-translation
description: 한국어 원본 문서의 변경을 영어 페이지에 반영하고, 번역이 없거나 어긋난 페이지를 보고한다. "번역 동기화", "영어 페이지 맞춰줘", "sync translation" 요청 시 사용.
allowed-tools: Bash(git status *) Bash(git diff *) Bash(git log *)
---

## 현재 변경

!`git status --short -- src/content/docs 2>/dev/null || true`

## 절차

1. 대상 파악
   - 인자가 있으면 그 경로만. 없으면 `git diff main...HEAD --name-only -- src/content/docs` + 미커밋 변경 중 한국어 파일(`en/` 아닌 것).
   - 전체 점검 요청이면 `src/content/docs/**`(en 제외)와 `src/content/docs/en/**`를 Glob으로 비교해 짝 없는 파일 목록을 만든다.
2. 각 한국어 파일에 대해 `git diff`로 바뀐 부분을 확인하고 영어 파일의 대응 위치만 갱신한다(전체 재번역 금지 — 기존 영어 문장 보존).
3. 번역 규칙
   - 코드 블록·명령·옵션은 그대로. 코드 안 주석과 예시 이름만 번역(`홍길동` → `Jane Doe`).
   - frontmatter `sidebar.order` 동일, 링크는 `/guide-to-git/` → `/guide-to-git/en/`.
   - aside 종류(`:::caution` 등)와 헤딩 수·순서를 맞춘다.
4. 영어 페이지만 있고 한국어가 없는 경우는 수정하지 말고 보고한다(원본은 한국어).
5. `npm run typecheck`와 `npm run build`로 frontmatter·링크를 확인한다.

## 보고

| 한국어 파일 | 영어 파일 | 조치(갱신/신규/누락 보고) |
