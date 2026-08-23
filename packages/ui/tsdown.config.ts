import { defineConfig } from 'tsdown'
import icons from 'unplugin-icons/rolldown'
import vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/ui.ts',
    './src/wrapper-classes.ts',
  ],
  copy: [
    {
      from: './src/style.css',
      to: './dist',
    },
    {
      from: './src/styles',
      to: './dist',
    },
  ],
  platform: 'neutral',
  tsconfig: './tsconfig.build.json',
  plugins: [
    vue({ isProduction: true }),
    icons(),
  ],
  dts: {
    vue: true,
  },
})
