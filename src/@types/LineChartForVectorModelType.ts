import IDataTree from "../interfaces/IDataTree";

type LineChartForVectorModelType = {
  data: IDataTree[],
  dataChart: any[],
  active: boolean,
  autoRange: boolean,
  xInterval: number[],
  yInterval: number[],
  showXAxisGrid: boolean,
  showYAxisGrid: boolean,
  colors: string[],
  viewport: number,
  title: string,
  tooltipActive: boolean,
  loading: boolean
}

export default LineChartForVectorModelType;