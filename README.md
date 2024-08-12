# SqlZen

A web-based SQL editor that lets you run databases right in your browser.

## Development

### Project Setup

#### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/).

#### 2. Install Dependencies
```sh
npm install
```

#### 3. Setup Rust and Tauri (Optional)
We use [Tauri](https://tauri.studio/) to build the desktop app. Follow the [installation guide](https://tauri.app/v1/guides/getting-started/prerequisites) to setup Rust and Tauri.

#### 4. Troubleshooting
You may need to restart your terminal or IDE after installing Rust for the first time.

### Compile and Hot-Reload for Development

#### Web only
```sh
npm run dev
```
#### Desktop app
```sh
npm run tauri dev
```

Initial launch may take a while as Vite needs to optimize some dependencies.

### Type-Check, Compile and Minify for Production

#### Web only
```sh
npm run build
```
#### Desktop app
```sh
npm run tauri build
```

### Check Types
It's recommended to check types before pushing changes 
to make sure the app can be built successfully.
```sh
npm run type-check
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```