export interface DataflowStep {
  id: string
  label: string
  description?: string
  icon?: string
  color?: string
  children?: DataflowStep[]
}

export type Dataflow = DataflowStep[]
