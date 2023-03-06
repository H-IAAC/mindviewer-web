import BarChartActionsModelType from "../@types/BarChartActionsModelType";
import BarChartProps from "./BarChartProps";

type BarChartActionsViewProps = {
  barChartActionsState: BarChartActionsModelType,
  handleEditChartMenu: (value: boolean) => void,
  handleInputTimeModal: (value: boolean) => void,
  handleEnableRefresh: (value: boolean) => void,
  handleSlider: (value: any) => void,
  handleSliderStep: (e: React.KeyboardEvent<HTMLInputElement>) => void,
  handleInputTime: (date: Date) => void,
  handleXAxisChanged: () => void,
  handleScreenshot: (id: string, title: string) => void,
  barChartProps: BarChartProps
}

export default BarChartActionsViewProps;