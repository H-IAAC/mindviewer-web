import IDataTree from "../interfaces/IDataTree";

type BarChartForVectorModelType = {
  data: IDataTree[],
  dataChart: any[],
  active: boolean,
  autoRange: boolean,
  yInterval: number[],
  showXAxisGrid: boolean,
  showYAxisGrid: boolean,
  colors: string[],
  viewport: number,
  title: string,
  tooltipActive: boolean,
  loading: boolean
}

export default BarChartForVectorModelType;