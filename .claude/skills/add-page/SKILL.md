---
name: add-page
description: 새 문서 페이지를 한국어/영어 쌍으로 추가한다. "페이지 추가", "새 가이드 작성", "문서 만들어줘" 요청 시 사용. $ARGUMENTS = 주제 또는 경로(예: guides/branching).
---

## 레퍼런스

기존 페이지 쌍을 패턴으로 따른다: `src/content/docs/guides/getting-started.md` ↔ `src/content/docs/en/guides/getting-started.md`.
`.claude/rules/content.md` 규칙이 적용된다.

## 절차

1. 위치 결정: `$ARGUMENTS`에서 섹션 디렉터리와 slug(영어 kebab-case)를 정한다. 모호하면 기존 디렉터리 목록을 보여주고 묻는다.
   새 섹션 디렉터리라면 `astro.config.mjs` 사이드바에 그룹 추가가 필요하다 → Risky가 아니지만 계획에 명시.
2. 같은 섹션의 기존 페이지 `sidebar.order`를 확인하고 다음 번호를 정한다.
3. 한국어 페이지를 먼저 작성: `src/content/docs/<section>/<slug>.md`
   - frontmatter: `title`, `description`, `sidebar.order`
   - 구조: 이 페이지에서 배울 것(1–2줄) → 개념 → 실습 명령(` ```sh `) → 결과 확인(` ```text `) → 다음 단계 링크
   - 문서 속 git 명령은 임시 디렉터리에서 실제로 실행해 출력이 맞는지 확인한다.
4. 영어 페이지 작성: `src/content/docs/en/<section>/<slug>.md` — 같은 구조·같은 order·같은 코드 블록, 링크는 `/guide-to-git/en/...`.
5. 다른 페이지에서 링크할 곳이 있으면 ko/en 모두에 링크 추가(사용자 확인 후).
6. /verify 실행. 새 섹션이면 사이드바 노출을 확인하는 E2E 케이스 추가를 제안.
