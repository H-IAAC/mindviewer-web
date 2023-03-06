import MainPanelViewProps from "./MainPanelViewProps";

type ChartPanelProps = {
  charts: {
    chartList: any[],
    chartComponentList: ((index: number) => JSX.Element)[],
    chartIds: number[]
  },
  dragFunctions: {
    dragStart: (chart: any) => void;
    dragEnd: () => void;
  }
};

export default ChartPanelProps;