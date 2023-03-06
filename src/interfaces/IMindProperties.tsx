interface IMemoryProperties {
  name: string,
  type?: string,
  group?: string,
  timestamp: number,
  evaluation: number,
  I: number,
  memories: IMemoryProperties[]
}

interface ICodeletProperties {
  name: string,
  group?: string,
  activation: number,
  timestamp: number,
  broadcast: IMemoryProperties[],
  inputs: IMemoryProperties[],
  outputs: IMemoryProperties[]
}

interface IMindProperties {
  memories: IMemoryProperties[],
  codelets: ICodeletProperties[]
}

export type {IMemoryProperties, ICodeletProperties, IMindProperties};