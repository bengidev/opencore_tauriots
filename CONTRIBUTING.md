# Contributing to OpenCore Tauriots

Thank you for your interest in contributing. This project is a desktop app focused on edge AI — local inference and on-device intelligence through a Tauri + React stack.

## Development setup

1. Fork and clone the repository.
2. Install [Node.js](https://nodejs.org/) 20+ and [Rust](https://www.rust-lang.org/tools/install).
3. Install [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your desktop OS.
4. Run `npm install` in the project root.
5. Start the dev app with `npm run tauri dev`.

## Making changes

- Keep changes scoped to desktop targets (macOS, Windows, Linux). This repo does not support mobile or web deployment.
- Frontend code lives in `src/`; native logic and Tauri commands live in `src-tauri/src/`.
- Match existing code style: TypeScript for the UI, Rust 2021 edition for the backend.
- Run `npm run build` and `npm run tauri build` before opening a pull request when your change touches build or bundling.

## Pull requests

1. Create a feature branch from `main`.
2. Write clear commit messages describing the *why* behind each change.
3. Open a pull request with a short summary and any testing notes.
4. Link related issues when applicable.

## Reporting issues

When filing a bug report, include:

- Your OS and version
- Steps to reproduce
- Expected vs. actual behavior
- Relevant logs from the terminal or devtools console

## Code of conduct

Be respectful and constructive. Harassment, discrimination, and bad-faith behavior are not tolerated.

## Questions

Open a [GitHub Discussion](https://github.com/bengidev/opencore_tauriots/discussions) or issue if you are unsure whether a change fits the project's scope.
