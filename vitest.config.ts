import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      alias: [
        // https://github.com/vitest-dev/vitest/discussions/1806
        {
          find: /^monaco-editor$/,
          replacement:
            __dirname + '/node_modules/monaco-editor/esm/vs/editor/editor.api',
        },
      ],
    },
  }),
)
