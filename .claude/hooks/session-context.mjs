// SessionStart: 사실만 출력(plain stdout → 컨텍스트). 1초 내 종료.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { projectRoot } from './lib.mjs';

const root = projectRoot();
const git = (...args) => {
	try {
		return execFileSync('git', ['-C', root, ...args], {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
			timeout: 3000,
		}).trim();
	} catch {
		return null;
	}
};
const out = [];

if (git('rev-parse', '--is-inside-work-tree') === 'true') {
	const br = git('branch', '--show-current');
	out.push(`현재 브랜치: ${br || 'detached HEAD'}`);
	if (/^(?:main|master|release\/.*)$/.test(br ?? ''))
		out.push('현재 보호 브랜치에 있음. 이 저장소는 기능 브랜치에서 작업한다.');
	const ch = (git('status', '--porcelain') ?? '').split('\n').filter(Boolean);
	if (ch.length) out.push(`미커밋 변경(${ch.length}개, 최대 20개 표시):`, ...ch.slice(0, 20));
	const log = git('log', '--oneline', '-5');
	if (log) out.push('최근 커밋:', log);
}

const nvmrc = path.join(root, '.nvmrc');
if (existsSync(nvmrc)) {
	const want = readFileSync(nvmrc, 'utf8').replace(/[v\s]/g, '');
	const have = process.versions.node;
	if (want.split('.')[0] !== have.split('.')[0])
		out.push(`Node 메이저 버전 불일치: 요구 ${want}, 현재 ${have}`);
}
if (existsSync(path.join(root, 'package.json')) && !existsSync(path.join(root, 'node_modules')))
	out.push('node_modules 없음: 의존성 미설치 상태.');

const state = path.join(root, 'docs', 'STATE.md');
if (existsSync(state))
	out.push(
		'--- docs/STATE.md (앞 30줄) ---',
		...readFileSync(state, 'utf8').split(/\r?\n/).slice(0, 30),
	);

process.stdout.write(out.join('\n') + '\n');
