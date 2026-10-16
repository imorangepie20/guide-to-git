// test-writer 서브에이전트 전용 PreToolUse(Edit|Write): 테스트 경로 외 수정 차단
import { decide, policy, readInput, relToProject } from './lib.mjs';

policy(() => {
	const fp = readInput().tool_input?.file_path ?? '';
	if (!fp) return;
	const rel = relToProject(fp);
	if (rel !== null && (/^tests\//.test(rel) || /\.(?:test|spec)\.[cm]?[jt]sx?$/.test(rel))) return;
	decide('deny', `test-writer는 테스트 파일(tests/**, *.spec.ts)만 수정한다: ${fp}`);
});
