// PostToolUse(Edit|Write): 편집된 그 파일만 Prettier → ESLint.
// 로컬 설치본(node_modules)만 사용, 없으면 조용히 건너뜀. 린트 판정은 종료코드로.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { projectRoot, readInput, relToProject } from './lib.mjs';

let input;
try {
	input = readInput();
} catch {
	process.exit(0); // 편의 기능: fail-open
}
const fp = input.tool_input?.file_path ?? '';
if (!fp || !existsSync(fp) || relToProject(fp) === null) process.exit(0);

const root = projectRoot();
// .cmd shim은 shell 없이 실행 불가 → node로 패키지 bin 스크립트를 직접 실행
const run = (script, args) => {
	const abs = path.join(root, 'node_modules', script);
	if (!existsSync(abs)) return null;
	return spawnSync(process.execPath, [abs, ...args], {
		cwd: root,
		encoding: 'utf8',
		timeout: 50_000,
	});
};

const ext = path.extname(fp).toLowerCase();
const prettierExts = [
	'.ts',
	'.tsx',
	'.js',
	'.mjs',
	'.cjs',
	'.astro',
	'.json',
	'.css',
	'.md',
	'.mdx',
	'.yml',
	'.yaml',
	'.html',
];
const eslintExts = ['.ts', '.tsx', '.js', '.mjs', '.cjs', '.astro'];

if (prettierExts.includes(ext))
	run('prettier/bin/prettier.cjs', ['--write', '--ignore-unknown', '--log-level', 'silent', fp]);

if (eslintExts.includes(ext)) {
	const r = run('eslint/bin/eslint.js', ['--no-warn-ignored', '--max-warnings=0', fp]);
	if (r && r.status !== 0) {
		const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.split('\n').slice(0, 40).join('\n');
		process.stderr.write(`[lint] ${fp}\n${out}\n`);
		process.exit(2); // 이미 기록됨. stderr가 Claude에게 전달되어 즉시 수정 유도
	}
}
process.exit(0);
