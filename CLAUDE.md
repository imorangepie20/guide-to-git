# Guide to Git

Git을 처음 배우는 사람을 위한 문서 사이트. Astro Starlight, 한국어(기본) + 영어, GitHub Pages로 배포.

## Commands

| 목적                  | 명령                                                         |
| --------------------- | ------------------------------------------------------------ |
| 개발 서버             | `npm run dev` → `http://localhost:4321/guide-to-git/`        |
| 타입체크              | `npm run typecheck` (`astro check`, 콘텐츠 frontmatter 포함) |
| 린트(+자동수정)       | `npm run lint` / `npm run lint:fix`                          |
| 포맷 / 포맷 검사      | `npm run format` / `npm run format:check`                    |
| E2E 테스트(전체/단일) | `npm test` / `npm test -- tests/e2e/<file>.spec.ts`          |
| 빌드                  | `npm run build` (깨진 내부 링크가 있으면 실패)               |
| 전체 검증             | `npm run check` ← 작업 완료 전 반드시                        |

- 패키지 추가는 `npm install`만 사용. `package-lock.json` 직접 편집 금지.
- `npm test`는 빌드 후 preview 서버를 띄우므로 ~20초 걸린다. 단일 spec 실행을 우선한다.
- 개발 서버는 백그라운드로 띄운다: `npx astro dev --background` (`astro dev stop|status|logs`로 관리).

## Architecture (비자명한 것만)

- 한국어가 root 로케일: `src/content/docs/**`. 영어는 `src/content/docs/en/**`에 **같은 상대 경로**로 둔다.
- 사이드바는 `astro.config.mjs`의 `autogenerate`(디렉터리 기반). 그룹 라벨 영어는 `translations`.
- 사이트는 `base: '/guide-to-git'` 하위에 배포된다. 마크다운·frontmatter의 내부 링크는 base를 포함한 절대 경로로 쓴다(`/guide-to-git/guides/...`). 상대 링크는 `starlight-links-validator`가 빌드를 실패시킨다.
- 배포는 `.github/workflows/deploy.yml`(main push → check → build → Pages). 로컬에서 배포 명령을 실행하지 않는다.

## Conventions

- 포맷은 Prettier가 강제: 코드 탭 들여쓰기, 작은따옴표, 폭 100. md/json/yml은 스페이스 2칸.
- 문서 원본은 한국어. 한국어 페이지를 바꾸면 같은 커밋에서 영어 페이지도 맞춘다(`/sync-translation`).
- 커밋: Conventional Commits (`feat|fix|docs|chore|refactor|test|ci: 요약`). 콘텐츠 변경은 `docs:`.

## Gotchas

- Windows 환경. PATH의 `bash`는 WSL이고 jq가 없다 → hook은 모두 Node(`.claude/hooks/*.mjs`)로 작성한다.
- `.astro/`, `dist/`는 생성물. 타입 오류가 이상하면 `npm run typecheck`가 `.astro/`를 재생성한다.
- Playwright 브라우저가 없으면 `npx playwright install chromium` (1회).

## Workflow

- 작업 계약은 `.claude/rules/00-harness.md`를 따른다.
- 세션 인수인계 메모: `docs/STATE.md`
- 같은 실수를 두 번 하면: 사실이면 이 파일/rules에 한 줄, 절차면 skill, 반드시 지켜야 하면 hook/permission. hook을 고칠 땐 `node .claude/hooks/tests/run.mjs`에 케이스를 먼저 추가.

## Compaction

압축 시 반드시 보존: 수정한 파일 목록, 실행한 검증 명령과 결과, 미해결 이슈, 현재 계획 단계.
