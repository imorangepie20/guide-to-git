---
paths:
  - 'src/**/*.astro'
  - 'src/components/**'
  - 'src/styles/**'
  - 'astro.config.*'
---

# Astro / Starlight 규칙

- 커스터마이즈는 Starlight 설정 → CSS 변수(`customCss`) → 컴포넌트 오버라이드(`components`) 순으로 최소 수단을 쓴다.
- 컴포넌트 오버라이드는 `src/components/overrides/<Name>.astro`에 두고, 원본을 `@astrojs/starlight/components/<Name>.astro`에서 감싸 확장한다(전체 복사 금지).
- 색·간격은 Starlight CSS 변수(`--sl-color-*`, `--sl-text-*`)를 사용. 하드코딩 색 금지(다크 모드 깨짐).
- UI 문자열은 하드코딩하지 않고 Starlight i18n(`Astro.locals.t`)을 쓴다. 커스텀 키가 필요하면 `src/content.config.ts`에 `i18n` 컬렉션(`i18nLoader`)을 추가하고 `src/content/i18n/{ko,en}.json` 둘 다 작성한다.
- 클라이언트 JS는 꼭 필요할 때만, `<script>`로. UI 프레임워크(React 등) 추가는 사람 승인.
- 접근성: 인터랙티브 요소는 키보드로 조작 가능, 아이콘 버튼은 `aria-label`, 이미지 `alt`.
- `astro.config.mjs`의 `site`, `base`, `locales` 변경은 Risky — 모든 링크와 배포 경로가 바뀐다.
- UI 변경 후에는 `npm run dev`로 ko/en, 라이트/다크 모드를 모두 확인한다.
