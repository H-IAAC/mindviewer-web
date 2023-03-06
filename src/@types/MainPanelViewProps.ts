import MainPanelModelType from "../@types/MainPanelModelType";

type MainPanelViewProps = {
  mainPanelState: MainPanelModelType,
  layout: string,
  handleAddChart: (tabActive: number, options: any) => void,
  handleAddNewDataInChart: (tabActive: number, idTree: string[], key: number) => void,
  handleRemoveChart: (id: number) => void,
  handleRemoveDataFromChart: (chartId: number, elementId: number[]) => void,
  updateChartsWithNoConnection: () => void,
  handleUpdateChartLocation: (chartId: number, newLocation: string) => void
}

export default MainPanelViewProps;