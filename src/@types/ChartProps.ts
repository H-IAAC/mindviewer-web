import BarChartActionsModel from "../components/Charts/BarChart/barChartActionsModel";
import BarChartForVectorActionsModel from "../components/Charts/BarChartForVector/barChartForVectorActionsModel";
import LineChartActionsModel from "../components/Charts/LineChart/lineChartActionsModel";
import LineChartForVectorActionsModel from "../components/Charts/LineChartForVector/lineChartForVectorActionsModel";
import IChart from "../interfaces/IChart";

type ChartProps = {
  chart: IChart,
  chartActions: LineChartActionsModel|BarChartActionsModel|LineChartForVectorActionsModel|BarChartForVectorActionsModel,
  chartId: number,
  removeChart: (id: number) => void, 
  removeDataFromChart: (chartId: number, elementId: number[]) => void
}

export default ChartProps;