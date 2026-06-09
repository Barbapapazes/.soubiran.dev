export type WorkflowGraphDuration = number | string

export type WorkflowGraphRetryBackoff = 'constant' | 'linear' | 'exponential'

export type WorkflowGraphParallelKind = 'all' | 'any' | 'all_settled' | 'race'

export type WorkflowGraphBreakKind = 'break' | 'return'

export interface WorkflowGraphMessage {
  code: number
  message: string
}

export interface WorkflowGraphResultInfo {
  count: number
  per_page: number
  total_count: number
  cursor?: string
  page?: number
  total_pages?: number
}

export interface WorkflowVersionGraphPathParams {
  account_id: string
  workflow_name: string
  version_id: string
}

export interface WorkflowGraphUnknownShape {
  type: 'unknown'
}

export interface WorkflowGraphObjectShape {
  type: 'object'
  fields: Record<string, WorkflowGraphJsonShape>
}

export type WorkflowGraphJsonShape = WorkflowGraphUnknownShape | WorkflowGraphObjectShape

export interface WorkflowGraphRetryPolicy {
  backoff: WorkflowGraphRetryBackoff
  delay: WorkflowGraphDuration
  limit: number
}

export interface WorkflowGraphStepConfig {
  retries: WorkflowGraphRetryPolicy
  timeout: WorkflowGraphDuration
}

export interface WorkflowGraphEdgeMetadata {
  resolves?: number
  starts?: number
}

export interface WorkflowGraphNamedNodeBase<TType extends string> extends WorkflowGraphEdgeMetadata {
  name: string
  type: TType
}

export interface WorkflowGraphNodeContainer {
  nodes: WorkflowGraphNode[]
}

export interface WorkflowGraphConditionalBranch extends WorkflowGraphNodeContainer {
  condition: string
}

export interface WorkflowGraphFunctionDefinitionNode extends WorkflowGraphNodeContainer {
  name: string
  type: 'function_def'
}

export interface WorkflowGraphStepSleepNode extends WorkflowGraphNamedNodeBase<'step_sleep'> {
  duration: WorkflowGraphDuration
}

export interface WorkflowGraphStepDoNode extends WorkflowGraphNamedNodeBase<'step_do'>, WorkflowGraphNodeContainer {
  config: WorkflowGraphStepConfig
}

export interface WorkflowGraphWaitForEventOptions {
  event_type: string
  timeout: WorkflowGraphDuration
}

export interface WorkflowGraphStepWaitForEventNode extends WorkflowGraphNamedNodeBase<'step_wait_for_event'> {
  options: WorkflowGraphWaitForEventOptions
  payload?: WorkflowGraphJsonShape
}

export interface WorkflowGraphStepSleepUntilNode extends WorkflowGraphNamedNodeBase<'step_sleep_until'> {
  timestamp: string
}

export interface WorkflowGraphLoopNode extends WorkflowGraphNodeContainer {
  type: 'loop'
}

export interface WorkflowGraphParallelNode extends WorkflowGraphNodeContainer {
  kind: WorkflowGraphParallelKind
  type: 'parallel'
}

export interface WorkflowGraphBlockNode extends WorkflowGraphNodeContainer {
  type: 'block'
}

export interface WorkflowGraphTryNode {
  catch_block?: WorkflowGraphBlockNode
  finally_block?: WorkflowGraphBlockNode
  try_block: WorkflowGraphBlockNode
  type: 'try'
}

export interface WorkflowGraphIfNode {
  branches: WorkflowGraphConditionalBranch[]
  type: 'if'
}

export interface WorkflowGraphSwitchNode {
  branches: WorkflowGraphConditionalBranch[]
  discriminant: string
  type: 'switch'
}

export interface WorkflowGraphStartNode extends WorkflowGraphNodeContainer {
  class_name: string
  functions: WorkflowGraphFunctionMap
  payload?: WorkflowGraphJsonShape
  type: 'start'
}

export interface WorkflowGraphFunctionCallNode extends WorkflowGraphNamedNodeBase<'function_call'> {}

export interface WorkflowGraphBreakNode {
  kind: WorkflowGraphBreakKind
  type: 'break'
}

export type WorkflowGraphNode
  = | WorkflowGraphStepSleepNode
    | WorkflowGraphStepDoNode
    | WorkflowGraphStepWaitForEventNode
    | WorkflowGraphStepSleepUntilNode
    | WorkflowGraphLoopNode
    | WorkflowGraphParallelNode
    | WorkflowGraphTryNode
    | WorkflowGraphBlockNode
    | WorkflowGraphIfNode
    | WorkflowGraphSwitchNode
    | WorkflowGraphStartNode
    | WorkflowGraphFunctionCallNode
    | WorkflowGraphFunctionDefinitionNode
    | WorkflowGraphBreakNode

export type WorkflowGraphFunctionMap = Record<string, WorkflowGraphFunctionDefinitionNode>

export interface WorkflowGraphWorkflow extends WorkflowGraphNodeContainer {
  class_name: string
  functions: WorkflowGraphFunctionMap
  payload?: WorkflowGraphJsonShape
}

export interface WorkflowVersionGraph {
  version: number
  workflow: WorkflowGraphWorkflow
}
