// PreToolUse(Bash|PowerShell): 되돌릴 수 없거나 범위를 벗어나는 셸 명령 차단/확인.
// permissions deny와 이중 방어. 문자열 매칭이므로 우회 가능 — 진짜 경계는 샌드박스와 원격 브랜치 보호.
import { execFileSync } from 'node:child_process';
import { decide, policy, projectRoot, readInput } from './lib.mjs';

policy(() => {
	const cmd = readInput().tool_input?.command ?? '';
	if (!cmd) return;
	const has = (re) => re.test(cmd);
	const S = String.raw`(?:^|[;&|\s(])`; // 명령 시작 경계

	// 1) 복구 불가 삭제
	const rmRf = String.raw`rm\s+-[a-z]*(?:r[a-z]*f|f[a-z]*r)[a-z]*`;
	if (has(new RegExp(`${S}(?:sudo\\s+)?${rmRf}\\s+(?:/|~|\\$HOME|\\.|\\*)(?:\\s|$)`, 'i')))
		decide('deny', '루트·홈·프로젝트 전체 재귀 삭제는 금지');
	if (has(new RegExp(`${S}${rmRf}`, 'i')))
		decide('ask', '재귀 강제 삭제: 대상 경로를 사람이 확인해야 함');
	// PowerShell 등가
	const psRm = /(?:remove-item|\bri\b|\brm\b|\bdel\b|\brmdir\b)[^;|&]*-recurse/i;
	if (
		has(psRm) &&
		has(
			/-recurse[^;|&]*\s(?:[a-z]:[\\/]?|~|\$home|\$env:userprofile|\.|\*)(?:\s|$)|\s(?:[a-z]:[\\/]?|~|\$home|\.|\*)\s[^;|&]*-recurse/i,
		)
	)
		decide('deny', '드라이브·홈·프로젝트 전체 재귀 삭제는 금지');
	if (has(psRm)) decide('ask', '재귀 삭제: 대상 경로를 사람이 확인해야 함');

	// 2) Git 이력·원격 보호
	if (has(/\bgit\s+(?:-c\s+\S+\s+)*push\b/i)) {
		if (has(/(?:--force(?:\s|=|$)|\s-[a-z]*f[a-z]*(?:\s|$))/i) && !has(/force-with-lease/i))
			decide('deny', 'force push 금지 (필요 시 사람이 --force-with-lease로 직접 수행)');
		if (has(/\s(?:HEAD:)?(?:main|master|release\/\S*)(?:\s|$)/))
			decide('deny', '보호 브랜치로 직접 push 금지 — PR을 사용');
		let cur = '';
		try {
			cur = execFileSync('git', ['-C', projectRoot(), 'branch', '--show-current'], {
				encoding: 'utf8',
				stdio: ['ignore', 'pipe', 'ignore'],
			}).trim();
		} catch {
			/* git 저장소가 아니면 브랜치 검사 생략 */
		}
		if (/^(?:main|master|release\/.*)$/.test(cur))
			decide('deny', `보호 브랜치(${cur})에서 push 금지 — 기능 브랜치 사용`);
		decide('ask', '원격 push는 사람 확인 필요');
	}
	if (has(/--no-verify/)) decide('deny', 'git hook 우회(--no-verify) 금지');
	if (
		has(
			/\bgit\s+(?:reset\s+--hard|clean\s+-[a-z]*f|checkout\s+--\s+\.|restore\s+(?:--staged\s+)?\.)/i,
		)
	)
		decide('ask', '작업 내용 유실 가능 명령');
	if (has(/\bgit\s+(?:rebase|filter-branch|filter-repo|update-ref)\b/i))
		decide('ask', '이력 재작성 명령');

	// 3) 원격 스크립트 실행·권한
	if (has(/\b(?:curl|wget)\b[^|]*\|\s*(?:sudo\s+)?(?:ba|z)?sh\b/i))
		decide('deny', '원격 스크립트 파이프 실행 금지');
	if (
		has(
			/\b(?:iwr|irm|invoke-webrequest|invoke-restmethod)\b[^|]*\|\s*(?:iex|invoke-expression)\b/i,
		) ||
		has(/\biex\s*\(\s*(?:iwr|irm|new-object\s+net\.webclient)/i)
	)
		decide('deny', '원격 스크립트 파이프 실행 금지');
	if (has(/\bchmod\s+(?:-R\s+)?0?777\b/)) decide('deny', '777 권한 부여 금지');
	if (has(new RegExp(`${S}sudo\\s`))) decide('ask', 'sudo 사용');

	// 4) 비밀 파일 접근 (.env.example 제외)
	const envRefs = cmd.match(/(?:^|[\s/\\="'])\.env(?:\.[\w.-]+)?(?=[\s"';|&)]|$)/g) ?? [];
	if (envRefs.some((r) => !/\.env\.example/.test(r)))
		decide('ask', '.env 계열 파일 접근 — 비밀 노출 위험');
	if (
		has(/(?:^|[;&|]\s*)(?:printenv|env)\s*(?:$|\|)/) ||
		has(/\b(?:get-childitem|gci|ls|dir)\s+env:\s*(?:$|\|)/i)
	)
		decide('ask', '전체 환경변수 출력 — 비밀 노출 위험');

	// 5) 배포·발행
	if (has(/\b(?:npm|pnpm|yarn|bun)\s+publish\b/i)) decide('deny', '패키지 발행은 사람이 수행');
	if (
		has(
			/\b(?:gh-pages|vercel[^;&|]*--prod|netlify\s+deploy|firebase\s+deploy|wrangler\s+(?:deploy|publish))\b/i,
		)
	)
		decide('ask', '배포 명령 — 배포는 GitHub Actions(main push)로만 수행');
});
