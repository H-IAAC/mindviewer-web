import ChartPanelModelType from "../../@types/ChartPanelModelType";

class ChartPanelModel {
  /*
    chartList -> Lista de gráficos
    tab -> Aba atual
  */
  private tab: number;
  private previousChartListLength: number;
  private dispatch: React.Dispatch<any>;

  constructor (initialState: ChartPanelModelType, dispatch: React.Dispatch<any>) {
    this.tab = initialState.tab;
    this.previousChartListLength = initialState.previousChartListLength;
    this.dispatch = dispatch;
  }

  public setTab = (value: number) => {
    this.tab = value;
    this.dispatch({
      type: "UPDATE_TAB",
      value: this.tab
    })
  }

  public getPreviousChartListLength = () => this.previousChartListLength;
  public setPreviousChartListLength = (value: number) => {
    this.previousChartListLength = value;
    this.dispatch({
      type: "UPDATE_PREVIOUSCHARTLISTLENGTH",
      value: this.previousChartListLength
    })
  }
}

export default ChartPanelModel;