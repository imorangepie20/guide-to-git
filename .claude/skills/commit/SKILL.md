---
name: commit
description: 현재 변경을 논리 단위로 묶어 Conventional Commits 메시지로 커밋한다. "/commit", "커밋해줘" 요청 시 사용.
disable-model-invocation: true
allowed-tools: Bash(git add *) Bash(git commit *) Bash(git status *) Bash(git diff *) Bash(git log *) Bash(git branch *)
---

## 현재 상태

!`git branch --show-current 2>/dev/null || true`
!`git status --short 2>/dev/null || true`

## 절차

1. 브랜치가 `main`이면 멈추고 기능 브랜치를 제안한다(`docs/…`, `feat/…`, `fix/…`, `chore/…`).
2. /verify 를 아직 통과하지 않았으면 먼저 실행한다(이번 세션에서 이미 통과했고 이후 변경이 없으면 생략).
3. `git diff`, `git diff --staged`를 읽고 점검: 비밀값·토큰, 디버그 코드(`console.log`), 주석 처리된 코드, 임시 파일. 발견하면 멈추고 보고.
4. 변경을 논리 단위로 그룹핑한다. 한 커밋 = 한 의도. ko/en 같은 페이지 쌍은 같은 커밋에.
5. 파일을 명시해서 stage 한다(`git add <files>`; `git add -A`/`.` 금지 — 의도치 않은 파일 포함 방지).
6. 메시지:
   - 제목: `<type>(<scope>)?: <요약>` — type ∈ feat, fix, docs, chore, refactor, test, ci, style. 50자 내외, 마침표 없음.
   - 콘텐츠 변경은 `docs:`, scope는 섹션명(`docs(branching): …`).
   - 본문(선택): 무엇을·왜. 빈 줄 후 `Co-Authored-By: Claude <noreply@anthropic.com>` 허용.
7. `git commit` 후 `git log --oneline -3`으로 결과를 보여준다. push 는 하지 않는다.
