import HeatMapModel from "./heatMapModel";

class HeatMapActionsModel {
  private enableRefresh: boolean;
  private sliderValue: number;
  private editHeatMapMenu: boolean;
  private time: string;
  private inputTimeModal: boolean;
  private heatMap!: HeatMapModel;
  private dispatch: React.Dispatch<any>;

  // public static getInstance = (id: number) => {
  //   if (LineChartActionsModel.instances.length < id+1)
  //     LineChartActionsModel.instances.push(new LineChartActionsModel())
  //   return LineChartActionsModel.instances[id]
  // }

  // public static removeInstance = (id: number) => {
  //   LineChartActionsModel.instances.splice(id,1);
  // }

  constructor (heatMap: HeatMapModel) {
    this.heatMap = heatMap;
    this.enableRefresh = true;
    this.sliderValue = 100;
    this.editHeatMapMenu = false;
    this.time = "";
    this.inputTimeModal = false;
    this.dispatch = () => null;
  }

  public init = (dispatch: React.Dispatch<any>) => {
    this.dispatch = dispatch;
  }

  public getHeatMapModel = () => {
    return this.heatMap;
  }

  public setEditHeatMapMenu = (value: boolean) => {
    this.editHeatMapMenu = value;
    this.dispatch({
      type: "UPDATE_EDITHEATMAPMENU",
      value: value
    })
  }

  public restart = (dispatch: React.Dispatch<any>) => {
    this.dispatch = dispatch;
    this.dispatch({
      type: "UPDATE_ALL",
      enableRefresh: this.enableRefresh,
      sliderValue: this.sliderValue,
      time: this.time
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
    //console.log(value);
    this.enableRefresh = value;
    this.heatMap.setEnableRefresh(value);
    if (!value) {
      this.heatMap.defineRange();
      this.time = this.heatMap.getTime().toString();
      this.dispatch({
        type: "DISABLE_REFRESH",
        time: this.time,
      })
      //console.log("aki")
      this.heatMap.setTooltipEnabled(true);
    } else {
      this.heatMap.setTooltipEnabled(false);
      this.sliderValue = 100;
      this.heatMap.setViewportWithSlider(100);
      this.dispatch({
        type: "ENABLE_REFRESH",
        sliderValue: this.sliderValue,
      })
    }
  }

  public setSliderValue = (value: number) => {
    if (!this.enableRefresh) {
      this.sliderValue = value;
      this.heatMap.setViewportWithSlider(value as number);
      this.time = this.heatMap.getTime().toString();
      this.dispatch({
        type: "UPDATE_SLIDERVALUE",
        sliderValue: this.sliderValue,
        time: this.time
      })
    }
  }

  public setSliderWithStep = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    //console.log(e.key)

    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      const value: number = this.heatMap.handleStep(-1);
      this.sliderValue = value;
      this.time = this.heatMap.getTime().toString();
      this.dispatch({
        type: "UPDATE_SLIDERVALUE",
        sliderValue: this.sliderValue,
        time: this.time
      })
      return
    }

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      const value: number = this.heatMap.handleStep(1);
      this.sliderValue = value;
      this.time = this.heatMap.getTime().toString();
      this.dispatch({
        type: "UPDATE_SLIDERVALUE",
        sliderValue: this.sliderValue,
        time: this.time
      })
      return
    }
  }

  public setSliderValueWithInputTime = (date: Date) => {
    const viewport = this.heatMap.findViewportValueWithTime(date.getTime())
    this.setSliderValue(viewport);
  }

  public xAxisChanged = () => {
    if (!this.enableRefresh) {
      this.heatMap.defineRange();
      this.sliderValue = 100;
      this.heatMap.resetViewport();
      this.dispatch({
        type: "RESET_SLIDERVALUE"
      })
    }
  }
}

export default HeatMapActionsModel;