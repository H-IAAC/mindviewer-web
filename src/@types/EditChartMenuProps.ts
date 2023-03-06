import IChart from "../interfaces/IChart";

type EditChartMenuProps = {
  chart: IChart,
  chartId: number,
  handleEditChartMenu: (value: boolean) => void,
  removeDataFromChart: (chartId: number, elementId: number[]) => void,
  handleXAxisChanged: () => void
}

export default EditChartMenuProps;