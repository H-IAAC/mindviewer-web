import { Viewport } from "@devexpress/dx-react-chart";
import IDataTree from "../interfaces/IDataTree";

type LineChartModelType = {
  data: IDataTree[],
  dataChart: any[],
  active: boolean,
  autoRange: boolean,
  xInterval: number[],
  yInterval: number[],
  showXAxisGrid: boolean,
  showYAxisGrid: boolean,
  colors: string[],
  viewport: Viewport,
  title: string,
  tooltipActive: boolean,
  loading: boolean
}

export default LineChartModelType;