# First Interaction

[![Version](https://img.shields.io/github/v/release/tomdewildt/first-interaction?label=version)](https://github.com/tomdewildt/first-interaction/releases)
[![Build](https://img.shields.io/github/actions/workflow/status/tomdewildt/first-interaction/ci.yml?branch=master)](https://github.com/tomdewildt/first-interaction/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/actions/workflow/status/tomdewildt/first-interaction/cd.yml?label=release)](https://github.com/tomdewildt/first-interaction/actions/workflows/cd.yml)
[![License](https://img.shields.io/github/license/tomdewildt/first-interaction)](https://github.com/tomdewildt/first-interaction/blob/master/LICENSE)

A GitHub Action that welcomes new contributors when they open their first issue or pull request on a repository.

# How To Run

Prerequisites:

- mise version `2025.1.0` or later
- node version `24.0.0` or later

### Development

1. Run `mise run init` to initialize the environment.
2. Run `mise run build` to bundle the action into `dist/index.js`.

# How To Use

```yaml
name: triage
on:
  issues:
    types: [opened]
  pull_request_target:
    types: [opened]

permissions:
  issues: write
  pull-requests: write

jobs:
  first-interaction:
    if: github.event.action == 'opened' && github.event.sender.type != 'Bot'
    runs-on: ubuntu-latest
    steps:
      - uses: tomdewildt/first-interaction@v1
```

# Inputs

| Input           | Required | Default               | Description                                              |
| --------------- | -------- | --------------------- | -------------------------------------------------------- |
| `repo-token`    | no       | `${{ github.token }}` | Token with `issues: write` and `pull-requests: write`.   |
| `issue-message` | no       | see `action.yml`      | Comment to post on an individual's first issue.          |
| `pr-message`    | no       | see `action.yml`      | Comment to post on an individual's first pull request.   |

# References

[GitHub Actions Toolkit Docs](https://github.com/actions/toolkit)

[Creating a JavaScript Action Docs](https://docs.github.com/en/actions/sharing-automations/creating-actions/creating-a-javascript-action)

[Vite Docs](https://vite.dev/)

[Vitest Docs](https://vitest.dev/)
