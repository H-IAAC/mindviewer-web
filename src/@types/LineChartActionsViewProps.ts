import LineChartActionsModelType from "../@types/LineChartActionsModelType";
import LineChartProps from "./LineChartProps";

type LineChartActionsViewProps = {
  lineChartActionsState: LineChartActionsModelType,
  handleEditChartMenu: (value: boolean) => void,
  handleInputTimeModal: (value: boolean) => void,
  handleEnableRefresh: (value: boolean) => void,
  handleSlider: (value: any) => void,
  handleSliderXAxis: (value: any) => void,
  handleInputTime: (date: Date) => void,
  handleXAxisChanged: () => void,
  handleScreenshot: (id: string, title: string) => void,
  lineChartProps: LineChartProps
}

export default LineChartActionsViewProps;