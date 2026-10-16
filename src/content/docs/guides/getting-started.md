---
title: 시작하기
description: Git을 설치하고 첫 저장소를 만듭니다.
---

## 사용자 정보 설정

커밋에 기록될 이름과 이메일을 한 번 설정합니다.

```sh
git config --global user.name "홍길동"
git config --global user.email "gildong@example.com"
```

## 첫 저장소 만들기

```sh
mkdir my-project
cd my-project
git init -b main
```

## 첫 커밋

```sh
echo "# my-project" > README.md
git add README.md
git commit -m "docs: add README"
```

`git log --oneline`으로 커밋이 기록되었는지 확인합니다.
