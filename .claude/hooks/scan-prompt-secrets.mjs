// UserPromptSubmit: 실수로 붙여넣은 비밀키/토큰을 모델 전송 전 차단 (편의 기능: 오류 시 fail-open)
import { readInput } from './lib.mjs';

const SECRET =
	/(AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{20,}|xox[abprs]-[A-Za-z0-9-]{10,}|sk-[A-Za-z0-9_-]{20,}|AIza[0-9A-Za-z_-]{35}|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.)/;

try {
	const prompt = readInput().prompt ?? '';
	if (SECRET.test(prompt)) {
		process.stdout.write(
			JSON.stringify({
				decision: 'block',
				reason:
					'프롬프트에 비밀키/토큰으로 보이는 문자열이 있어 전송을 막았습니다. 값을 제거하고 환경변수 이름으로 참조하세요. 로컬 기록에는 남을 수 있으니 해당 키는 폐기·재발급을 권장합니다.',
				hookSpecificOutput: { hookEventName: 'UserPromptSubmit', suppressOriginalPrompt: true },
			}),
		);
	}
} catch {
	/* fail-open */
}
process.exit(0);
