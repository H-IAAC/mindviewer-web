import LineChartForVectorProps from "../../../@types/LineChartForVectorProps";
import LineChartForVectorActionsController from "./lineChartForVectorActionsController";

const LineChartForVector = (props: LineChartForVectorProps) => {
  return(
    <LineChartForVectorActionsController
      {...props}
    />
  )
}

export default LineChartForVector;