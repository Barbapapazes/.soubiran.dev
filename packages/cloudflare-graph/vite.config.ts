import type { ResolvedConfig } from 'vite'
import type { WorkflowGraphMessage, WorkflowGraphResultInfo, WorkflowVersionGraph } from './src/types/graph'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import Cloudflare from 'cloudflare'
import { defineConfig, loadEnv } from 'vite'

export interface WorkflowVersionGraphResult {
  id: string
  class_name: string
  created_on: string
  graph: WorkflowVersionGraph
  modified_on: string
  workflow_id: string
}

export interface WorkflowVersionGraphResponse {
  errors: WorkflowGraphMessage[]
  messages: WorkflowGraphMessage[]
  result: WorkflowVersionGraphResult
  result_info?: WorkflowGraphResultInfo
  success: true
}

export default defineConfig({
  plugins: [
    vue(),
    (() => {
      let resolvedConfig: ResolvedConfig | null = null
      const moduleId = 'cloudflare:graph'

      return {
        name: 'cloudflare-graph',
        configResolved(config) {
          resolvedConfig = config
        },
        resolveId: {
          filter: {
            id: new RegExp(`^${moduleId}$`),
          },
          handler: async () => {
            return `\0${moduleId}`
          },
        },
        load: {
          filter: {
            id: new RegExp(`^\\0${moduleId}$`),
          },
          handler: async () => {
            const env = loadEnv(resolvedConfig!.mode, process.cwd())

            const client = new Cloudflare({
              apiToken: env.VITE_CLOUDFLARE_API_TOKEN,
            })

            const versions = await client.workflows.versions.list(env.VITE_CLOUDFLARE_WORKFLOW_NAME, {
              account_id: env.VITE_CLOUDFLARE_ACCOUNT_ID,
            })
            const latestVersion = versions.result.filter(version => version.has_dag)[0]

            const graph = await client.request({
              method: 'get',
              path: `/accounts/${env.VITE_CLOUDFLARE_ACCOUNT_ID}/workflows/${env.VITE_CLOUDFLARE_WORKFLOW_NAME}/versions/${latestVersion.id}/graph`,
            }) as WorkflowVersionGraphResponse

            return `export default ${JSON.stringify(graph.result.graph.workflow)}`
          },
        },
      }
    })(),
  ],
})
