// PreToolUse(Edit|Write|NotebookEdit): 비밀·lockfile·생성물·하네스 파일 보호
import { decide, isClaudeOwnedPath, policy, readInput, relToProject } from './lib.mjs';

policy(() => {
	const ti = readInput().tool_input ?? {};
	const fp = ti.file_path || ti.notebook_path || '';
	if (!fp) return;
	const rel = relToProject(fp);

	if (rel === null) {
		if (isClaudeOwnedPath(fp)) return; // 플랜·메모리·스크래치패드
		decide('ask', `프로젝트 외부 파일 수정: ${fp}`);
	}
	const base = rel.split('/').pop();

	if (base === '.env.example') return;
	if (
		/^\.env(?:\..+)?$/.test(base) ||
		/\.(?:pem|key|p12|pfx|keystore|jks)$/.test(base) ||
		/(?:^|\/)secrets\//.test(rel)
	)
		decide('deny', '비밀/인증서 파일은 에이전트가 수정하지 않음');
	if (
		[
			'package-lock.json',
			'npm-shrinkwrap.json',
			'pnpm-lock.yaml',
			'yarn.lock',
			'bun.lock',
			'bun.lockb',
		].includes(base)
	)
		decide('deny', 'lockfile 직접 편집 금지 — npm 명령으로만 변경');
	if (
		/^(?:\.git|node_modules|dist|\.astro|test-results|playwright-report|\.claude\/state)(?:\/|$)/.test(
			rel,
		) ||
		/\/node_modules\//.test(rel)
	)
		decide('deny', '생성물/벤더 파일 — 원본을 수정하고 재생성');
	if (
		/^(?:\.claude\/settings\.json|\.claude\/hooks\/|\.github\/workflows\/|\.github\/codeowners$|codeowners$)/.test(
			rel,
		)
	)
		decide('ask', '하네스/CI 설정 변경 — 사람 승인 필요');
});
