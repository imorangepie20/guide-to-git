# Guide to Git

Astro Starlight로 만든 Git 학습 가이드 문서 사이트입니다. 한국어(기본)와 영어를 지원합니다.

## 명령어

| 명령                | 설명                                                       |
| ------------------- | ---------------------------------------------------------- |
| `npm install`       | 의존성 설치 (+ 최초 1회 `npx playwright install chromium`) |
| `npm run dev`       | 개발 서버 `http://localhost:4321/guide-to-git/`            |
| `npm run build`     | `dist/`로 정적 빌드 (깨진 내부 링크가 있으면 실패)         |
| `npm run typecheck` | `astro check`                                              |
| `npm run lint`      | ESLint                                                     |
| `npm run format`    | Prettier                                                   |
| `npm test`          | Playwright E2E (빌드 후 preview 서버에서 실행)             |
| `npm run check`     | typecheck → lint → format:check → test                     |

## 콘텐츠 구조

- 한국어: `src/content/docs/**`
- 영어: `src/content/docs/en/**` (한국어와 같은 상대 경로)
