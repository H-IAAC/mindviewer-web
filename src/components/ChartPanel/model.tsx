import ChartPanelModelType from "../../@types/ChartPanelModelType";

class ChartPanelModel {
  private tab: number;                      // Current tab in chart panel
  private previousChartListLength: number;  // Previous chart list length
  private dispatch: React.Dispatch<any>;    // Dispatch function

  constructor (initialState: ChartPanelModelType, dispatch: React.Dispatch<any>) {
    this.tab = initialState.tab;
    this.previousChartListLength = initialState.previousChartListLength;
    this.dispatch = dispatch;
  }

  // getters

  public getPreviousChartListLength = () => this.previousChartListLength;

  // setters
  
  public setTab = (value: number) => {
    this.tab = value;
    this.dispatch({
      type: "UPDATE_TAB",
      value: this.tab
    })
  }

  public setPreviousChartListLength = (value: number) => {
    this.previousChartListLength = value;
    this.dispatch({
      type: "UPDATE_PREVIOUSCHARTLISTLENGTH",
      value: this.previousChartListLength
    })
  }
}

export default ChartPanelModel;