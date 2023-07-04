import AddChartMenuModelType from "../../@types/AddChartMenuModelType";

class AddChartMenuModel {
  private tab: number;            // current tab ("Novo gráfico" or "add em um gráfico existente")
  private type: string;           // current chart type
  private title: string;          // chart title
  private minXInterval: string;   // x interval
  private timeUnit: string;       // time unit for x axis
  private minY: string;           // inferior limit for y axis
  private maxY: string;           // superior limit for y axis
  private autoRange: boolean;     // it defines if auto range of y axis is activated
  private selectedChart: number;  // selected chart in "add em um gráfico existente" tab
  private dispatch: React.Dispatch<any>;  // tab option

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

  // Function that returns the new chart's info 
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
      type: this.type,
      xInterval: parseInt(this.minXInterval)*multiplier,
      timeMultiplier: multiplier,
      yInterval: [parseFloat(this.minY), parseFloat(this.maxY)],
      autoRange: this.autoRange,
      title: this.title
    })
  }

  // getters
  public getTab = () => this.tab;
  public getSelectedChart = () => this.selectedChart;

  // setters
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

  public setSelectedChart = (value: number) => {
    this.selectedChart = value;
    this.dispatch({
      type: "UPDATE_SELECTEDCHART",
      value: this.selectedChart
    })
  }
}

export default AddChartMenuModel
