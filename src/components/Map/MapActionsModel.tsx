import MapModel from "./MapModel";

class MapActionsModel {
  private enableRefresh: boolean;
  private sliderValue: number;
  private editMapMenu: boolean;
  private time: string;
  private inputTimeModal: boolean;
  private map!: MapModel;
  private dispatch: React.Dispatch<any>;

  constructor (map: MapModel) {
    this.map = map;
    this.enableRefresh = true;
    this.sliderValue = 100;
    this.editMapMenu = false;
    this.time = "";
    this.inputTimeModal = false;
    this.dispatch = () => null;
  }

  public init = (dispatch: React.Dispatch<any>) => {
    this.dispatch = dispatch;
  }

  public getHeatMapModel = () => {
    return this.map;
  }

  public setEditMapMenu = (value: boolean) => {
    this.editMapMenu = value;
    this.dispatch({
      type: "UPDATE_EDITMAPMENU",
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
    this.map.setEnableRefresh(value);
    if (!value) {
      this.map.defineRange();
      this.time = this.map.getTime().toString();
      this.dispatch({
        type: "DISABLE_REFRESH",
        time: this.time,
      })
      //console.log("aki")
      this.map.setTooltipEnabled(true);
    } else {
      this.map.setTooltipEnabled(false);
      this.sliderValue = 100;
      this.map.setViewportWithSlider(100);
      this.dispatch({
        type: "ENABLE_REFRESH",
        sliderValue: this.sliderValue,
      })
    }
  }

  public setSliderValue = (value: number) => {
    if (!this.enableRefresh) {
      this.sliderValue = value;
      this.map.setViewportWithSlider(value as number);
      this.time = this.map.getTime().toString();
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
      const value: number = this.map.handleStep(-1);
      this.sliderValue = value;
      this.time = this.map.getTime().toString();
      this.dispatch({
        type: "UPDATE_SLIDERVALUE",
        sliderValue: this.sliderValue,
        time: this.time
      })
      return
    }

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      const value: number = this.map.handleStep(1);
      this.sliderValue = value;
      this.time = this.map.getTime().toString();
      this.dispatch({
        type: "UPDATE_SLIDERVALUE",
        sliderValue: this.sliderValue,
        time: this.time
      })
      return
    }
  }

  public setSliderValueWithInputTime = (date: Date) => {
    const viewport = this.map.findViewportValueWithTime(date.getTime())
    this.setSliderValue(viewport);
  }

  public xAxisChanged = () => {
    if (!this.enableRefresh) {
      this.map.defineRange();
      this.sliderValue = 100;
      this.map.resetViewport();
      this.dispatch({
        type: "RESET_SLIDERVALUE"
      })
    }
  }
}

export default MapActionsModel;