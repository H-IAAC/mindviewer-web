import BarChartModel from "../components/Charts/BarChart/barChartModel";
import LineChartModel from "../components/Charts/LineChart/lineChartModel";

type BarChartActionsModelType = {
  enableRefresh: boolean,
  sliderValue: number,
  editChartMenu: boolean,
  chartTime: string,
  inputTimeModal: boolean,
  chart: BarChartModel
}

export default BarChartActionsModelType;