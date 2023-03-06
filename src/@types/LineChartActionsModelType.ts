import LineChartModel from "../components/Charts/LineChart/lineChartModel";

type LineChartActionsModelType = {
  enableRefresh: boolean,
  sliderValue: number,
  sliderXAxisValue: number,
  editChartMenu: boolean,
  chartTime: string,
  inputTimeModal: boolean,
  chart: LineChartModel
}

export default LineChartActionsModelType;