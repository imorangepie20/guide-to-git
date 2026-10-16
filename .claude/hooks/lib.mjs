// 공통 유틸. 각 hook에서: import { ... } from './lib.mjs'
import { readFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import path from 'node:path';

// stdin JSON 한 번 읽기. 파싱 실패는 예외 → policy() 래퍼가 fail-closed 처리
export function readInput() {
	const raw = readFileSync(0, 'utf8');
	return raw.trim() ? JSON.parse(raw) : {};
}

// PreToolUse 결정 출력 후 종료. d = 'deny' | 'ask'  (이 하네스는 'allow'를 쓰지 않는다)
export function decide(d, reason) {
	process.stdout.write(
		JSON.stringify({
			hookSpecificOutput: {
				hookEventName: 'PreToolUse',
				permissionDecision: d,
				permissionDecisionReason: `[harness] ${reason}`,
			},
		}),
	);
	process.exit(0);
}

// 정책 hook 래퍼: 예외가 나면 차단(exit 2)
export function policy(main) {
	try {
		main();
		process.exit(0);
	} catch (e) {
		process.stderr.write(`[harness] hook 오류로 차단: ${e?.message ?? e}\n`);
		process.exit(2);
	}
}

// Windows/Git Bash/POSIX 경로를 비교 가능한 형태로: 슬래시 통일, /c/ → c:/, 소문자
export function norm(p) {
	let s = String(p).replace(/\\/g, '/');
	const m = s.match(/^\/([a-zA-Z])\//);
	if (m) s = `${m[1]}:/${s.slice(3)}`;
	return s.replace(/\/+$/, '').toLowerCase();
}

export function projectRoot() {
	return process.env.CLAUDE_PROJECT_DIR || process.cwd();
}

// 프로젝트 기준 상대 경로(소문자, '/' 구분). 프로젝트 밖이면 null
export function relToProject(fp) {
	const root = norm(projectRoot());
	const abs = norm(path.isAbsolute(fp) ? fp : path.join(projectRoot(), fp));
	if (abs === root) return '';
	return abs.startsWith(root + '/') ? abs.slice(root.length + 1) : null;
}

// 프로젝트 밖이지만 Claude Code가 정상적으로 쓰는 위치(플랜·메모리·임시 스크래치패드)
export function isClaudeOwnedPath(fp) {
	const abs = norm(fp);
	return [path.join(homedir(), '.claude'), tmpdir()].some((d) => abs.startsWith(norm(d) + '/'));
}
