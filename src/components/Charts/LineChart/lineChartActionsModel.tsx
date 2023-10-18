import IChart from "../../../interfaces/IChart";
import LineChartModel from "./lineChartModel";

class LineChartActionsModel {
  private enableRefresh: boolean;       // it defines if chart's auto refresh is activated
  private sliderValue: number;          // time axis slider value
  private sliderXAxisValue: number;     // x axis slider value
  private editChartMenu: boolean;       // it defines if edit chart menu is opened
  private chartTime: string;            // instant of time showed by the chart
  private inputTimeModal: boolean;      // it defines if input time modal is opened
  private chart!: LineChartModel;       // chart model
  private dispatch: React.Dispatch<any>;  // dispatch function

  constructor (chart: IChart) {
    this.chart = chart as LineChartModel;
    this.enableRefresh = true;
    this.sliderValue = 100;
    this.sliderXAxisValue = 100;
    this.editChartMenu = false;
    this.chartTime = "";
    this.inputTimeModal = false;
    this.dispatch = () => null;
  }

  // Initialization function (setting dispatch)
  public init = (dispatch: React.Dispatch<any>) => {
    this.dispatch = dispatch;
  }

  // getters

  public getChart = () => {
    return this.chart;
  }

  // setters

  public setEditChartMenu = (value: boolean) => {
    this.editChartMenu = value;
    this.dispatch({
      type: "UPDATE_EDITCHARTMENU",
      value: value
    })
  }

  public setInputTimeModal = (value: boolean) => {
    this.inputTimeModal = value;
    this.dispatch({
      type: "UPDATE_INPUTTIMEMODAL",
      value: value
    })
  }

  public setEnableRefresh = (value: boolean) => {
    this.enableRefresh = value;
    this.chart.setEnableRefresh(value);

    // According to the new value, we do some adjusts
    if (!value) {
      this.chart.defineRange();
      this.chartTime = this.chart.getTime().toString();
      this.sliderXAxisValue = this.chart.getXAxisViewPortValue();
      this.dispatch({
        type: "DISABLE_REFRESH",
        chartTime: this.chartTime,
        sliderXAxisValue: this.sliderXAxisValue
      })
      this.chart.setTooltipActive(true);
    } else {
      this.chart.setTooltipActive(false);
      this.sliderValue = 100;
      this.chart.setViewportWithSlider(100);
      this.sliderXAxisValue = 100;
      this.dispatch({
        type: "ENABLE_REFRESH",
        sliderValue: this.sliderValue,
        sliderXAxisValue: this.sliderXAxisValue
      })
    }
  }

  public setSliderValue = (value: number) => {
    if (!this.enableRefresh) {
      this.sliderValue = value;
      this.chart.setViewportWithSlider(value as number);
      this.chartTime = this.chart.getTime().toString();
      this.dispatch({
        type: "UPDATE_SLIDERVALUE",
        sliderValue: this.sliderValue,
        chartTime: this.chartTime
      })
    }
  }

  public setSliderXAxisValue = (value: number) => {
    if (!this.enableRefresh) {
      this.sliderXAxisValue = value;
      this.chart.setViewportWithXAxisSlider(value);

      if (this.chart.getTime() !== this.chartTime) {
        this.chartTime = this.chart.getTime().toString();
      }

      const viewport = this.chart.findViewportValueWithTime(this.chart.getTime(false) as number);
      this.sliderValue = viewport;
      this.dispatch({
        type: "UPDATE_SLIDERXAXISVALUE",
        sliderXAxisValue: this.sliderXAxisValue,
        sliderValue: this.sliderValue,
        chartTime: this.chartTime,
      })
    }
  }

  public setSliderValueWithInputTime = (date: Date) => {
    const viewport = this.chart.findViewportValueWithTime(date.getTime())
    this.setSliderValue(viewport);
  }

  // If the chart is edited and the x axis changes, we do some adjusts. Just if enable refresh is false
  public xAxisChanged = () => {
    //if (!this.enableRefresh) {
      this.chart.defineRange();
      this.sliderValue = 100;
      this.chart.setViewport();
      this.dispatch({
        type: "RESET_SLIDERVALUE"
      })
    //}
  }

  // Functions that redefines dispatch function and some attributes
  public restart = (dispatch: React.Dispatch<any>) => {
    this.dispatch = dispatch;
    this.dispatch({
      type: "UPDATE_ALL",
      enableRefresh: this.enableRefresh,
      sliderValue: this.sliderValue,
      sliderXAxisValue: this.sliderXAxisValue,
      chartTime: this.chartTime
    })
  }
}

export default LineChartActionsModel;