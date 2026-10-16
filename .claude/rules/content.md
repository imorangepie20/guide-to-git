---
paths:
  - 'src/content/docs/**'
---

# 문서 콘텐츠 규칙

## 파일 쌍

- 한국어 `src/content/docs/<path>.md` ↔ 영어 `src/content/docs/en/<path>.md`. 파일명·디렉터리는 동일하게.
- 한쪽만 추가/삭제/이동하지 않는다. 번역이 늦어지면 영어 페이지를 만들지 않고 Starlight 폴백(한국어 표시)에 맡기되 `docs/STATE.md`에 기록한다.
- 파일명(slug)은 영어 kebab-case. 한 번 공개된 slug는 바꾸지 않는다.

## Frontmatter

- 필수: `title`, `description`(검색·OG용, 한 문장).
- 사이드바 순서는 `sidebar: { order: N }`로 지정. 같은 페이지의 ko/en은 같은 order.
- 랜딩 페이지 외에 `template: splash`를 쓰지 않는다.

## 본문

- 대상 독자는 Git 입문자. 용어는 처음 등장할 때 한 줄로 정의한다.
- `##`부터 시작(H1은 title이 담당).
- 명령은 ` ```sh ` 코드 블록. 프롬프트 기호(`$`)를 붙이지 않는다(복사-붙여넣기 가능하게).
- 출력 예시는 별도 ` ```text ` 블록으로 분리.
- 내부 링크는 base 포함 절대 경로: 한국어 `/guide-to-git/guides/x/`, 영어 `/guide-to-git/en/guides/x/`.
- 이미지는 `src/assets/`에 두고 상대 경로로 참조, `alt` 필수.
- 경고·팁은 Starlight aside(`:::note`, `:::tip`, `:::caution`, `:::danger`).
- MDX 컴포넌트는 `@astrojs/starlight/components`에서 가져온 것만 사용(`Tabs`, `Steps`, `Card` 등).

## 정확성

- 명령과 옵션은 현재 Git 버전 기준. 버전 의존 기능은 최소 버전을 표기(예: `git switch`는 2.23+).
- `master` 대신 `main`을 기본 브랜치로 쓴다.
