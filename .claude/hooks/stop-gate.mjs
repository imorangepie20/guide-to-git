// Stop: 작업 트리가 마지막 통과 상태와 다를 때만 typecheck + lint. 실패 시 block → Claude가 고친다.
// 탈출구: CLAUDE_STOP_GATE=off
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { stripVTControlCharacters } from 'node:util';
import { projectRoot, readInput } from './lib.mjs';

if (process.env.CLAUDE_STOP_GATE === 'off') process.exit(0);
let input;
try {
	input = readInput();
} catch {
	process.exit(0);
}
if (input.stop_hook_active) process.exit(0); // 무한 루프 방지

const root = projectRoot();
const git = (...args) => {
	try {
		return execFileSync('git', ['-C', root, ...args], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
			maxBuffer: 64 * 1024 * 1024,
		});
	} catch {
		return null;
	}
};
const EX = ':(exclude).claude/state'; // 게이트 자신의 상태 파일은 지문에서 제외
const status = git('status', '--porcelain', '--', '.', EX);
if (status === null || status.trim() === '') process.exit(0); // git 아님 또는 변경 없음

// 지문 = 추적 파일 diff + 미추적 파일의 "내용" 해시
const h = createHash('sha256').update(git('diff', 'HEAD', '--', '.', EX) ?? '');
for (const f of (git('ls-files', '--others', '--exclude-standard', '--', '.', EX) ?? '')
	.split('\n')
	.filter(Boolean)) {
	try {
		h.update(f).update(readFileSync(path.join(root, f)));
	} catch {
		h.update(f);
	}
}
const fp = h.digest('hex');
const stateDir = path.join(root, '.claude', 'state');
const green = path.join(stateDir, 'last-green');
try {
	if (readFileSync(green, 'utf8') === fp) process.exit(0);
} catch {
	/* 첫 실행 */
}

// SSOT 명령 호출 (npm은 Windows에서 .cmd → shell 필요)
const r = spawnSync('npm run typecheck && npm run lint', {
	cwd: root,
	shell: true,
	encoding: 'utf8',
	maxBuffer: 64 * 1024 * 1024,
	env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' }, // block 사유에 ANSI 코드가 섞이지 않게
});
if (r.status === 0) {
	mkdirSync(stateDir, { recursive: true });
	writeFileSync(green, fp);
	process.exit(0);
}
// astro check는 NO_COLOR를 무시하므로 ANSI 코드를 직접 제거
const tail = stripVTControlCharacters(`${r.stdout ?? ''}${r.stderr ?? ''}`)
	.split('\n')
	.slice(-60)
	.join('\n');
process.stdout.write(
	JSON.stringify({
		decision: 'block',
		reason: `자동 품질 게이트 실패(exit ${r.status}). 근본 원인을 수정하고 다시 확인할 것. 억제(ignore/disable) 금지.\n--- 출력 마지막 60줄 ---\n${tail}`,
	}),
);
process.exit(0);
