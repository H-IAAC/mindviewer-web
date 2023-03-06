import React from "react";
import IChart from "../../interfaces/IChart";
import IDataTree from "../../interfaces/IDataTree";
import ColorPalettes from '../../utils/ColorPalettes';
import EditChartMenuModel from "../EditChartMenu/model";

const randomColor = () => {
  const hex = (Math.random()*0xFFFFFF<<0).toString(16);
  return `#${hex}`;
}

abstract class Chart implements IChart {
  protected idTree: string[][];
  //protected type: string;
  protected data: IDataTree[] = [];
  protected jsonIds: string[] = [];
  protected dataChart: any[] = [];
  protected previousDataChart: any[] = [];
  protected elementRef: any;
  //protected viewport: number;
  protected enableRefresh: boolean = true;
  protected defaultInterval = 10000;
  protected timeMultiplier: number = 0;
  protected xInterval: number[] = [0, 10000];
  protected yInterval = [0,1];
  protected autoRange: boolean = true;
  protected title: string = "";
  protected range = 0;
  protected active: boolean = false;
  protected colors: string[] = [...ColorPalettes[0]];
  protected loading: boolean = true;
  protected id: number = 0;
  protected colorsFixed = false;
  protected time: number | undefined;
  protected tooltipActive: boolean = false;
  protected showXAxisGrid = false;
  protected showYAxisGrid = false;
  protected location = "default";
  protected dispatch: React.Dispatch<any> = () => {return};

  protected editChartMenuModel: EditChartMenuModel;

  constructor (idTree: string[][]) {
    this.idTree = idTree;

    this.editChartMenuModel = new EditChartMenuModel(this);
  }

  public getEditChartMenuModel () {
    return this.editChartMenuModel;
  }

  public setDispatch (dispatch: React.Dispatch<any>) {
    this.dispatch = dispatch;
  }

  public setData (data: [IDataTree, string][]) { 
    if (this.active) {
      this.data = data.map(item =>  item[0]);
      this.jsonIds = data.map(item => item[1]);

      this.dispatch({
        type: "UPDATE_DATA",
        value: [...this.data]
      })

      if (this.colors.length < this.data.length) {
        while (this.colors.length !== this.data.length) {
          this.colors.push(randomColor());
        }
        this.dispatch({
          type: "UPDATE_COLORS",
          value: [...this.colors]
        })
      }

      if (this.data.length === 0) {
        this.loading = false;
        this.dispatch({
          type: "UPDATE_LOADING",
          value: this.loading
        })
        return;
      } else {
        this.loading = true;
        this.dispatch({
          type: "UPDATE_LOADING",
          value: this.loading
        })
      }

      this.constructDataChart();
      if (this.enableRefresh) {
        this.elementRef = this.data[0].values ? [...this.data[0].values] : [];
        this.time = this.elementRef[this.elementRef.length-1].x.getTime();
        this.xInterval = this.getDomain();
        this.dispatch({
          type: "UPDATE_XINTERVAL",
          value: [...this.xInterval]
        })

        this.setViewport();
      }
      //this.fixColors()
    }
  };

  abstract defineRange: () => void;
  abstract setViewport: () => void;
  abstract setViewportWithSlider: (value: number) => void;
  abstract setViewportWithXAxisSlider: (value: number) => void;
  abstract findViewportValueWithTime: (time: number) => number;
  abstract handleStep: (step: number) => number;
  abstract getDomain: () => number[];
  abstract fixColors: () => void;
  abstract deleteColors: (items: number[]) => void;
  abstract constructDataChart: () => void;
  abstract setTooltipActive: (value: boolean) => void;
  abstract getXAxisViewPortValue: () => number;

  /*
    getters e setters
  */
  public setLocation = (value: string) => {this.location = value};
  public setEnableRefresh (value: boolean) { this.enableRefresh = value }
  public setDefaultInterval (value: number) { this.defaultInterval = value }
  public setTimeMultiplier (value: number) { this.timeMultiplier = value }
  public setYInterval (value: Array<number>) { 
    this.yInterval = value;
    this.dispatch({
      type: "UPDATE_YINTERVAL",
      value: this.yInterval
    })
  }
  public setAutoRange (value: boolean) { 
    this.autoRange = value;
    this.dispatch({
      type: "UPDATE_AUTORANGE",
      value: this.autoRange
    }) 
  }
  public setTitle (value: string) { 
    this.title = value;
    this.dispatch({
      type: "UPDATE_TITLE",
      value: this.title
    })
  }
  public setActive (value: boolean) { 
    this.active = value;
    this.dispatch({
      type: "UPDATE_ACTIVE",
      value: this.active
    })
  }
  public setId (value: number) {this.id = value}
  public setIdTree (value: string[][]) {this.idTree = value}
  public setColors (value: string[]) {
    this.colors = value;
    this.dispatch({
      type: "UPDATE_COLORS",
      value: [...this.colors]
    })
  }
  //public setTooltipActive (value: boolean) {this.tooltipActive = value}
  public setShowXAxisGrid(value: boolean) {
    this.showXAxisGrid = value;
    this.dispatch({
      type: "UPDATE_SHOWXAXISGRID",
      value: this.showXAxisGrid
    })
  }
  public setShowYAxisGrid(value: boolean) {
    this.showYAxisGrid = value;
    this.dispatch({
      type: "UPDATE_SHOWYAXISGRID",
      value: this.showYAxisGrid
    })
  }

  public getDefaultInterval() { return this.defaultInterval }
  public getTimeMultiplier() { return this.timeMultiplier }
  public getYInterval() { return this.yInterval }
  public getAutoRange() { return this.autoRange }
  public getTitle() { return this.title }
  public getIdTree() {return this.idTree}
  public getShowXAxisGrid() {return this.showXAxisGrid}
  public getShowYAxisGrid() {return this.showYAxisGrid}
  public getLocation = () => this.location;

  public getTime(formatted=true) { 
    if (this.time) {
      if (formatted)
        return `${new Date(this.time).toLocaleString()}.${(this.time%1000).toString().padStart(3,"0")}`;
      return this.time;
    }
    else
      return ""
  }

  // getElements: Retorna os elementos atuais do gráfico
  public getElements() {
    const elements = this.data.map((item, index) => ({label: item.labelChart, color: this.colors[index]}));
    return elements;
  }

  /*
    reset: reinicializa os dados do gráfico
  */
  public reset() {
    this.active = false;
    this.previousDataChart = [];
    this.dataChart = [];
    this.colorsFixed = false;
    this.dispatch({
      type: "RESET_CHART"
    })
  }
}

export default Chart;