// Notification: 터미널 알림(OSC 777)
import { readInput } from './lib.mjs';

let msg = 'Claude Code가 입력을 기다립니다';
try {
	msg = readInput().message || msg;
} catch {
	/* 기본 메시지 */
}
process.stdout.write(
	JSON.stringify({ terminalSequence: `\x1b]777;notify;Claude Code;${msg}\x07` }),
);
