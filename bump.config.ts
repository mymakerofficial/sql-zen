import { defineConfig } from 'bumpp'

export default defineConfig({
  files: [
    'package.json',
    'package-lock.json',
    './src-tauri/Cargo.toml',
    './src-tauri/tauri.conf.json',
  ],
})
