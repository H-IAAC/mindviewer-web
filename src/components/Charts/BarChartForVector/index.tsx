import BarChartForVectorProps from "../../../@types/BarChartForVectorProps";
import BarChartForVectorActionsController from "./barChartForVectorActionsController";

const BarChartForVector = (props: BarChartForVectorProps) => {
  return(
    <BarChartForVectorActionsController
      {...props}
    />
  )
}

export default BarChartForVector;