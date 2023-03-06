import BarChartProps from "../../../@types/BarChartProps";
import BarChartActionsController from "./barChartActionsController"

const BarChart = (props: BarChartProps) => {
  return(
    <BarChartActionsController
      {...props}
    />
  )
}

export default BarChart;