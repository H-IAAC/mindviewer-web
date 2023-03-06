import ChartPanelModelType from "../@types/ChartPanelModelType";
import ChartPanelProps from "./ChartPanelProps";

type ChartPanelViewProps = {
  chartPanelState: ChartPanelModelType,
  handleTab: (value: number) => void,
  chartPanelProps: ChartPanelProps
}

export default ChartPanelViewProps;