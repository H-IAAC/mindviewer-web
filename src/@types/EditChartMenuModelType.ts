type EditChartMenuModelType = {
  type: string,
  tab: number,
  title: string,
  minXInterval: string,
  timeUnit: string,
  minY: string,
  maxY: string,
  autoRange: boolean,
  elements: {
    label: string | undefined;
    color: string;
  }[],
  elementsColors: string[],
  selectedElements: number[],
  palette: string[] | undefined,
  showYAxisGrid: boolean
}

export default EditChartMenuModelType;