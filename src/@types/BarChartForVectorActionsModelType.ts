import BarChartForVectorModel from "../components/Charts/BarChartForVector/barChartForVectorModel";

type BarChartForVectorActionsModelType = {
  enableRefresh: boolean,
  sliderValue: number,
  editChartMenu: boolean,
  chartTime: string,
  inputTimeModal: boolean,
  chart: BarChartForVectorModel
}

export default BarChartForVectorActionsModelType;