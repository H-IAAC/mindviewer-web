import LineChartProps from "../../../@types/LineChartProps";
import LineChartActionsController from "./lineChartActionsController"

const LineChart = (props: LineChartProps) => {
  return(
    <LineChartActionsController
      {...props}
    />
  )
}

export default LineChart;