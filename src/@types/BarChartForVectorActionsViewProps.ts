import BarChartForVectorActionsModelType from "./BarChartForVectorActionsModelType";
import BarChartForVectorProps from "./BarChartForVectorProps";

type BarChartForVectorActionsViewProps = {
  barChartForVectorActionsState: BarChartForVectorActionsModelType,
  handleEditChartMenu: (value: boolean) => void,
  handleInputTimeModal: (value: boolean) => void,
  handleEnableRefresh: (value: boolean) => void,
  handleSlider: (value: any) => void,
  handleSliderStep: (e: React.KeyboardEvent<HTMLInputElement>) => void,
  handleInputTime: (date: Date) => void,
  handleXAxisChanged: () => void,
  handleScreenshot: (id: string, title: string) => void,
  barChartForVectorProps: BarChartForVectorProps
}

export default BarChartForVectorActionsViewProps;