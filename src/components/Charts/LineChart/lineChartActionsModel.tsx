import LineChartActionsModelType from "../../../@types/LineChartActionsModelType";
import IChart from "../../../interfaces/IChart";
import LineChartModel from "./lineChartModel";

class LineChartActionsModel {
  // private static instances: LineChartActionsModel[] = [];
  private enableRefresh: boolean;
  private sliderValue: number;
  private sliderXAxisValue: number;
  private editChartMenu: boolean;
  private chartTime: string;
  private inputTimeModal: boolean;
  private chart!: LineChartModel;
  private dispatch: React.Dispatch<any>;

  // public static getInstance = (id: number) => {
  //   if (LineChartActionsModel.instances.length < id+1)
  //     LineChartActionsModel.instances.push(new LineChartActionsModel())
  //   return LineChartActionsModel.instances[id]
  // }

  // public static removeInstance = (id: number) => {
  //   LineChartActionsModel.instances.splice(id,1);
  // }

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

  public init = (dispatch: React.Dispatch<any>) => {
    this.dispatch = dispatch;
  }

  public getChart = () => {
    return this.chart;
  }

  public setEditChartMenu = (value: boolean) => {
    this.editChartMenu = value;
    this.dispatch({
      type: "UPDATE_EDITCHARTMENU",
      value: value
    })
  }

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

  public setInputTimeModal = (value: boolean) => {
    this.inputTimeModal = value;
    this.dispatch({
      type: "UPDATE_INPUTTIMEMODAL",
      value: value
    })
  }

  public setEnableRefresh = (value: boolean) => {
    console.log(value);
    this.enableRefresh = value;
    console.log(value);
    this.chart.setEnableRefresh(value);
    if (!value) {
      this.chart.defineRange();
      this.chartTime = this.chart.getTime().toString();
      this.sliderXAxisValue = this.chart.getXAxisViewPortValue();
      this.dispatch({
        type: "DISABLE_REFRESH",
        chartTime: this.chartTime,
        sliderXAxisValue: this.sliderXAxisValue
      })
      console.log("aki")
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
    console.log(this.enableRefresh)
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
}

export default LineChartActionsModel;