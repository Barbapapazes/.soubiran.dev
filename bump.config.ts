import { defineConfig } from 'bumpp'

export default defineConfig({
  recursive: true,
  sign: true,
  files: [
    'packages/**/package.json',
  ],
})
