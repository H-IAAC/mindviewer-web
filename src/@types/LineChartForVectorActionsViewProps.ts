import LineChartForVectorActionsModelType from "./LineChartForVectorActionsModelType";
import LineChartForVectorProps from "./LineChartForVectorProps";


type LineChartForVectorActionsViewProps = {
  lineChartForVectorActionsState: LineChartForVectorActionsModelType,
  handleEditChartMenu: (value: boolean) => void,
  handleInputTimeModal: (value: boolean) => void,
  handleEnableRefresh: (value: boolean) => void,
  handleSlider: (value: any) => void,
  handleSliderStep: (e: React.KeyboardEvent<HTMLInputElement>) => void,
  handleInputTime: (date: Date) => void,
  handleXAxisChanged: () => void,
  handleScreenshot: (id: string, title: string) => void,
  lineChartForVectorProps: LineChartForVectorProps
}

export default LineChartForVectorActionsViewProps;