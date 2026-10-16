# Security

- 정적 사이트다. 서버·인증·DB가 없다. 비밀값이 필요한 기능을 추가하려면 먼저 사람과 상의한다.
- `.env*`(예시 제외), `*.pem`, `*.key`, `secrets/**`는 읽지도 쓰지도 않는다(hook·permission이 강제).
- 문서 예시에 실제 토큰·이메일·저장소 URL을 쓰지 않는다. `example.com`, `<your-token>`, `Jane Doe` 같은 자리표시자를 쓴다.
- 문서 예시 중 데이터를 잃을 수 있는 명령(`reset --hard`, `push --force`, `clean -fd`)에는 위험 안내(`:::caution`)를 함께 둔다.
- 외부 링크는 공식 문서(git-scm.com, docs.github.com 등)를 우선한다.
- `<script>` 삽입이나 외부 스크립트 로드는 사람 승인 후에만 추가한다.
