---
title: Getting started
description: Install Git and create your first repository.
---

## Set your identity

Set the name and email recorded in your commits once.

```sh
git config --global user.name "Jane Doe"
git config --global user.email "jane@example.com"
```

## Create your first repository

```sh
mkdir my-project
cd my-project
git init -b main
```

## Your first commit

```sh
echo "# my-project" > README.md
git add README.md
git commit -m "docs: add README"
```

Run `git log --oneline` to confirm the commit was recorded.
