import { Viewport } from "@devexpress/dx-react-chart";
import IDataTree from "../interfaces/IDataTree";

type BarChartModelType = {
  dataChart: any[],
  active: boolean,
  autoRange: boolean,
  yInterval: number[],
  showXAxisGrid: boolean,
  showYAxisGrid: boolean,
  colorsFixed: boolean,
  viewport: number,
  title: string,
  tooltipActive: boolean,
  loading: boolean
}

export default BarChartModelType;