# OpenCore Tauriots

A desktop application for running AI workloads at the edge — locally on your machine, without routing sensitive data through the cloud.

Built with [Tauri](https://tauri.app/) and [React](https://react.dev/), OpenCore Tauriots combines a lightweight native shell with a modern web UI so you can integrate on-device inference, model orchestration, and edge AI pipelines from a single desktop app.

## Why desktop + edge AI

- **Privacy** — Keep prompts, documents, and model inputs on your machine.
- **Low latency** — No round-trip to a remote API for every inference call.
- **Offline-capable** — Run models when connectivity is limited or unavailable.
- **Hardware access** — Leverage local CPU, GPU, and NPU resources through the native Rust backend.

## Tech stack

| Layer | Technology |
|-------|------------|
| Shell | Tauri 2 (Rust) |
| UI | React 19 + TypeScript |
| Build | Vite 7 |

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [Rust](https://www.rust-lang.org/tools/install) (stable)
- Platform tooling for your OS:
  - **macOS** — Xcode Command Line Tools
  - **Windows** — [Microsoft C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
  - **Linux** — See [Tauri prerequisites](https://tauri.app/start/prerequisites/)

## Getting started

```bash
# Install frontend dependencies
npm install

# Run in development mode
npm run tauri dev
```

## Building

```bash
# Production build for your current desktop platform
npm run tauri build
```

Installers and bundles are written to `src-tauri/target/release/bundle/`.

## Project structure

```
opencore-tauriots/
├── src/              # React frontend
├── src-tauri/        # Rust backend (Tauri commands, plugins, bundling)
├── public/           # Static assets
└── package.json
```

Rust commands exposed to the frontend live in `src-tauri/src/`. Invoke them from TypeScript via `@tauri-apps/api`.

## Contributing

Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
