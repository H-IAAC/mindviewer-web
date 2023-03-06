import AddChartMenuModelType from "../../@types/AddChartMenuModelType";

class AddChartMenuModel {
  private tab: number;
  private type: string;
  private title: string;
  private minXInterval: string;
  private timeUnit: string;
  private minY: string;
  private maxY: string;
  private autoRange: boolean;
  private selectedChart: number;
  private dispatch: React.Dispatch<any>;

  constructor (initialState: AddChartMenuModelType, dispatch: React.Dispatch<any>) {
    this.tab = initialState.tab;
    this.type = initialState.type;
    this.title = initialState.title;
    this.minXInterval = initialState.minXInterval;
    this.timeUnit = initialState.timeUnit;
    this.minY = initialState.minY;
    this.maxY = initialState.maxY;
    this.autoRange = initialState.autoRange;
    this.selectedChart = initialState.selectedChart;
    this.dispatch = dispatch;
  }

  public getNewChartInfo = () => {
    let multiplier: number;
    if (this.timeUnit === "second") {
      multiplier = 1000;
    } else if (this.timeUnit === "minute") {
      multiplier = 60000;
    } else {
      multiplier = 3600000;
    }

    return({
      // idTree: this.idTree,
      type: this.type,
      xInterval: parseInt(this.minXInterval)*multiplier,
      timeMultiplier: multiplier,
      yInterval: [parseFloat(this.minY), parseFloat(this.maxY)],
      autoRange: this.autoRange,
      title: this.title
    })
  }

  public getTab = () => this.tab;
  public setTab = (value: number) => {
    this.tab = value;
    this.dispatch({
      type: "UPDATE_TAB",
      value: this.tab
    })
  }

  public setType = (value: string) => {
    this.type = value;
    this.dispatch({
      type: "UPDATE_TYPE",
      value: this.type
    })
  }

  public setTitle = (value: string) => {
    this.title = value;
    this.dispatch({
      type: "UPDATE_TITLE",
      value: this.title
    })
  }

  public setMinXInterval = (value: string) => {
    this.minXInterval = value;
    this.dispatch({
      type: "UPDATE_MINXINTERVAL",
      value: this.minXInterval
    })
  }

  public setTimeUnit = (value: string) => {
    this.timeUnit = value;
    this.dispatch({
      type: "UPDATE_TIMEUNIT",
      value: this.timeUnit
    })
  }

  public setMinY = (value: string) => {
    this.minY = value;
    this.dispatch({
      type: "UPDATE_MINY",
      value: this.minY
    })
  }

  public setMaxY = (value: string) => {
    this.maxY = value;
    this.dispatch({
      type: "UPDATE_MAXY",
      value: this.maxY
    })
  }

  public setAutoRange = (value: boolean) => {
    this.autoRange = value;
    this.dispatch({
      type: "UPDATE_AUTORANGE",
      value: this.autoRange
    })
  }

  public getSelectedChart = () => this.selectedChart;
  public setSelectedChart = (value: number) => {
    this.selectedChart = value;
    this.dispatch({
      type: "UPDATE_SELECTEDCHART",
      value: this.selectedChart
    })
  }
}

export default AddChartMenuModel
