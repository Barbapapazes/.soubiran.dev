import { defineConfig } from 'tsdown'
import icons from 'unplugin-icons/rolldown'
import vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: [
    './src/index.ts',
    './src/ui.ts',
    // TODO: rename to prose
    './src/wrapper-classes.ts',
  ],
  copy: [
    {
      from: './src/components/',
      to: './dist/',
    },
  ],
  unbundle: true,
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
