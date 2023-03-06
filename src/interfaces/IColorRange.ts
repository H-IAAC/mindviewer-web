interface IColorRange {
  init: (values: number[]) => void,
  saveEdit: () => void,
  add: () => void,
  remove: (index: number) => void,
  update: (index: number, info: any) => void,
  getRule: () => (e: any) => string,
  getLegendBar: () => JSX.Element
}

export default IColorRange