import React from "react";
import JsonData from "../../@types/JsonDataType";
import IDataTree from "../../interfaces/IDataTree";
import ColorManager from "./ColorManager/colorManager";
import EditHeatMapMenuModel from "./EditHeatMapMenu/model";

class HeatMapModel {
  private id: number = 0;
  private idTree: string[][];
  private data: IDataTree[] = [];
  protected jsonIds: string[] = [];
  private processedData: { x: string, y: string, value: number, time: Date }[][] = [];
  private previousProcessedData: { x: string, y: string, value: number, time: Date }[][] = [];
  private elementRef: any;
  private enableRefresh: boolean = true;
  //private color: any;
  private range: number = 0;
  private viewport: number = 0;
  private time: number | undefined;
  private xLabels: number[] = [];
  private yLabels: number[] = [];
  private xLabelsEnabled: boolean = true;
  private yLabelsEnabled: boolean = true;
  private valueLabelEnabled: boolean = false;
  private panZoomEnabled: boolean = false;
  private tooltipEnabled: boolean = false;
  private xCrossHairEnabled: boolean = false;
  private yCrossHairEnabled: boolean = false;
  private backgroundImageEnabled: boolean = false;
  private markerShape: string = "rect";
  private markerSize: number | undefined;
  private title: string;
  private active: boolean = false;
  private loading: boolean = true;
  private location = "default";
  private colorFunction: (e: any) => string = () => "";
  private dispatch: React.Dispatch<any> = () => null;
  private legendBar = <></>;

  private editHeatMapMenuModel: EditHeatMapMenuModel;
  private colorManager: ColorManager;

  constructor(idTree: string[][], title: string) {
    this.idTree = idTree;
    this.title = title;

    this.editHeatMapMenuModel = new EditHeatMapMenuModel(this);
    this.colorManager = new ColorManager();
  }

  public init = () => {
    this.dispatch({
      type: "INIT_HEATMAP",
      processedData: [...this.processedData],
      active: this.active,
      viewport: this.viewport,
      title: this.title,
      loading: this.loading,
      panZoomEnabled: this.panZoomEnabled,
      markerShape: this.markerShape,
      markerSize: this.markerSize,
      xLabelsEnabled: this.xLabelsEnabled,
      yLabelsEnabled: this.yLabelsEnabled,
      valueLabelEnabled: this.valueLabelEnabled,
      tooltipEnabled: this.tooltipEnabled,
      xCrossHairEnabled: this.xCrossHairEnabled,
      yCrossHairEnabled: this.yCrossHairEnabled,
      backgroundImageEnabled: this.backgroundImageEnabled
    })
  }

  //getters
  public getId = () => this.id;
  public getIdTree = () => this.idTree;
  public getData = () => this.data;
  public getProcessedData = () => this.processedData;
  public getEnableRefresh = () => this.enableRefresh;
  public getColorFunction = () => this.colorFunction;
  public getRange = () => this.range;
  public getViewport = () => this.viewport;
  public getXLabels = () => this.xLabels;
  public getYLabels = () => this.yLabels;
  public getXLabelsEnabled = () => this.xLabelsEnabled;
  public getYLabelsEnabled = () => this.yLabelsEnabled;
  public getValueLabelEnabled = () => this.valueLabelEnabled;
  public getPanZoomEnabled = () => this.panZoomEnabled;
  public getTooltipEnabled = () => this.tooltipEnabled;
  public getXCrossHairEnabled = () => this.xCrossHairEnabled;
  public getYCrossHairEnabled = () => this.yCrossHairEnabled;
  public getBackgroundImageEnabled = () => this.backgroundImageEnabled;
  public getMarkerShape = () => this.markerShape;
  public getMarkerSize = () => this.markerSize;
  public getTitle = () => this.title;
  public getActive = () => this.active;
  public getLoading = () => this.loading;
  public getLocation = () => this.location;

  public getEditHeatMapMenuModel = () => {
    return this.editHeatMapMenuModel;
  }

  public getColorManager = () => {
    return this.colorManager;
  }

  public getTime(formatted=true) { 
    if (this.time) {
      if (formatted)
        return `${new Date(this.time).toLocaleString()}.${(this.time%1000).toString().padStart(3,"0")}`;
      return this.time;
    }
    else
      return ""
  }

  public updateLegendBar = () => {
    this.legendBar = this.colorManager.getLegendBar();
    this.dispatch({
      type: "UPDATE_LEGENDBAR",
      legendBar: this.legendBar
    })

    console.log('aki')
  }

  //setters

  public setData (data: [IDataTree, string][]) { 
    if (this.active) {
      this.data = data.map(item =>  item[0]);
      this.jsonIds = data.map(item => item[1]);
      // this.dispatch({
      //   type: "UPDATE_DATA",
      //   value: [...this.data]
      // })

      // if (this.colors.length < this.data.length) {
      //   while (this.colors.length !== this.data.length) {
      //     this.colors.push(randomColor());
      //   }
      //   this.dispatch({
      //     type: "UPDATE_COLORS",
      //     value: [...this.colors]
      //   })
      // }

      if (this.data.length === 0) {
        this.loading = false;
        this.dispatch({
          type: "UPDATE_LOADING",
          value: this.loading
        })
        return;
      } else {
        if (!this.loading) {
          this.loading = true;
          this.dispatch({
            type: "UPDATE_LOADING",
            value: this.loading
          })
        }
      }

      this.constructProcessedData();
      if (this.enableRefresh) {
        this.elementRef = this.data[0].values ? [...this.data[0].values] : [];
        this.time = this.elementRef[this.elementRef.length-1].x.getTime();

        this.resetViewport();
      }
    }
  };

  public setLocation = (value: string) => {this.location = value};
  public setId = (value: number) => { this.id = value };
  public setIdTree = (value: string[][]) => { this.idTree = value };
  public setProcessedData = (value: { x: string, y: string, value: number, time: Date }[][]) => { this.processedData = value };
  public setEnableRefresh = (value: boolean) => { this.enableRefresh = value };
  //public setColor = (value: any) => { this.color = value };
  public setRange = (value: number) => { this.range = value };
  public setViewport = (value: number) => { this.viewport = value };

  public resetViewport = () => { 
    this.viewport = this.processedData.length - 1;
    this.dispatch({
      type: "UPDATE_VIEWPORT",
      value: this.viewport
    })
  };

  public setTime = (value: number) => { this.time = value };
  public setXLabels = (value: number[]) => { this.xLabels = value };
  public setYLabels = (value: number[]) => { this.yLabels = value };
  
  public setXLabelsEnabled = (value: boolean) => { 
    this.xLabelsEnabled = value;
    this.dispatch({
      type: "UPDATE_XLABELSENABLED",
      value: this.xLabelsEnabled
    })
  };

  public setYLabelsEnabled = (value: boolean) => { 
    this.yLabelsEnabled = value;
    this.dispatch({
      type: "UPDATE_YLABELSENABLED",
      value: this.yLabelsEnabled
    })
  };

  public setValueLabelEnabled = (value: boolean) => { 
    this.valueLabelEnabled = value;
    this.dispatch({
      type: "UPDATE_VALUELABELENABLED",
      value: this.valueLabelEnabled
    })
  };
  
  public setPanZoomEnabled = (value: boolean) => { 
    this.panZoomEnabled = value;
    this.dispatch({
      type: "UPDATE_PANZOOMENABLED",
      value: this.panZoomEnabled
    })
  };

  public setTooltipEnabled = (value: boolean) => { 
    this.tooltipEnabled = value;
    this.dispatch({
      type: "UPDATE_TOOLTIPENABLED",
      value: this.tooltipEnabled
    })
    //console.log(this.tooltipEnabled)
  };

  public setXCrossHairEnabled = (value: boolean) => { 
    this.xCrossHairEnabled = value;
    this.dispatch({
      type: "UPDATE_XCROSSHAIRENABLED",
      value: this.xCrossHairEnabled
    })
  };

  public setYCrossHairEnabled = (value: boolean) => { 
    this.yCrossHairEnabled = value;
    this.dispatch({
      type: "UPDATE_YCROSSHAIRENABLED",
      value: this.yCrossHairEnabled
    })
  };

  public setBackgroundImageEnabled = (value: boolean) => { 
    this.backgroundImageEnabled = value;
    this.dispatch({
      type: "UPDATE_BACKGROUNDIMAGEENABLED",
      value: this.backgroundImageEnabled
    })
  };
  
  public setMarkerShape = (value: string) => { 
    this.markerShape = value;
    this.dispatch({
      type: "UPDATE_MARKERSHAPE",
      value: this.markerShape
    })
  };

  public setMarkerSize = (value: number|undefined) => { 
    this.markerSize = value;
    this.dispatch({
      type: "UPDATE_MARKERSIZE",
      value: this.markerSize
    })
  };
  
  public setTitle = (value: string) => { 
    this.title = value;
    this.dispatch({
      type: "UPDATE_TITLE",
      value: this.title
    })
  };

  public setActive = (value: boolean) => { 
    this.active = value;
    this.dispatch({
      type: "UPDATE_ACTIVE",
      value: this.active
    }) 
  };

  public setLoading = (value: boolean) => { 
    this.loading = value;
    this.dispatch({
      type: "UPDATE_LOADING",
      value: this.loading
    })
  };

  public setColor = (value: (e: any) => string) => { 
    this.colorFunction = value;
    this.dispatch({
      type: "UPDATE_COLORFUNCTION",
      value: this.colorFunction
    })
  };
  
  public setDispatch = (dispatch: React.Dispatch<any>) => { this.dispatch = dispatch };

  public defineRange = () => {
    this.range = this.processedData.length;
  }

  public setViewportWithSlider = (value: number) => {
    //implementar
    if (this.range === 0) return;

    if (value == 100) {
      this.resetViewport();
      this.time = this.processedData[this.processedData.length - 1][0]["time"].getTime();
      return;
    }

    this.viewport = Math.floor((value * 0.01) * this.range);
    this.dispatch({
      type: "UPDATE_VIEWPORT",
      value: this.viewport
    })

    this.time = this.processedData[this.viewport][0]["time"].getTime();
  }

  public handleStep = (step: number) => {
    if (this.range === 0) return 100;

    const viewportAux = this.viewport + step;

    if (viewportAux < 0) return 0;
    if (viewportAux >= this.processedData.length) return 100;

    this.viewport = viewportAux;
    this.dispatch({
      type: "UPDATE_VIEWPORT",
      value: this.viewport
    })

    this.time = this.processedData[this.viewport][0].time.getTime();

    const sliderValue = this.viewport * 100 / (this.range);
    return (sliderValue);
  }

  public findViewportValueWithTime = (time: number) => {
    if (time) {
      const difs = this.processedData.map(item => (
        Math.abs(item[0]["time"].getTime() - time)
      ))

      const min = Math.min(...difs)
      const index = difs.findIndex(item => item === min)
      const viewport = index * 100 / (this.range)
      return (viewport)
    }
    return 100;
  }

  // public getDomain = () => {
  //     if (this.elementRef.length === 0) {
  //         return([0,this.defaultInterval])
  //       }
  //     return ([this.elementRef[0].x, Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x)])
  // }

  public constructProcessedData = () => {
    if (this.processedData.length === 0) {
      if (this.data[0].values) {
        let valuesArray: number[] = [];

        for (let j = 0; j < this.data[0].values.length; j++) {
          let vectorAux: { x: string, y: string, value: number, time: Date }[] = [];
          for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            if (this.jsonIds[i].length === 0) {
              if (element.values) {
                const time = element.values[j].x as Date;
                const matrixAux = element.values[j].y;

                if (Array.isArray(matrixAux)) {
                  if (Array.isArray(matrixAux[0])) {
                    const matrix: number[][] = matrixAux;
                    matrix.forEach((vector, yValue) => {
                      vector.forEach((value, xValue) => {
                        vectorAux.push({
                          x: `${xValue}`,
                          y: `${yValue}`,
                          value: value,
                          time: time
                        })

                        valuesArray.push(value);
                      })
                    })
                  } else {
                    const vector: number[] = matrixAux;
                    vector.forEach((value, xValue) => {
                      vectorAux.push({
                        x: `${xValue}`,
                        y: "0",
                        value: value,
                        time: time
                      })

                      valuesArray.push(value);
                    })
                  }
                }

              }
            } else if (element.values) {
              let idTreeAux = this.jsonIds[i].split("-").reverse();
              let requiredJsonData: JsonData = element.values[j].y;
              
              let id;
              let idCompare = "i";

              if (idTreeAux.length !== 1) {
                idTreeAux.pop(); //Retira "i"
                while (idTreeAux.length != 0) {
                  id = idTreeAux.pop();
                  if (id) idCompare = idCompare+"-"+id;
          
                  if (requiredJsonData)
                    for (let i = 0; i < requiredJsonData.info.length; i++) {
                      if (requiredJsonData.info[i].id.includes(idCompare)) {
                        requiredJsonData = requiredJsonData.info[i];
                        break;
                      }
                    }
                }
              }

              const time = element.values[j].x as Date;
              requiredJsonData.info.forEach((item: JsonData) => {
                const info: any = {
                  [item.info[0].label]: item.info[0].info,
                  [item.info[1].label]: item.info[1].info,
                  [item.info[2].label]: item.info[2].info,
                  time: time
                }
                vectorAux.push(info);
                valuesArray.push(info.value);
              })
            }
          }

          this.previousProcessedData.push(vectorAux);
          this.processedData.push(vectorAux);
        }

        this.colorManager.init(valuesArray);
        this.legendBar = this.colorManager.getLegendBar();
        console.log(this.legendBar);    
        this.setColor(this.colorManager.getColorFunction())

        this.dispatch({
          type: "UPDATE_PROCESSEDDATA",
          value: [...this.processedData]
        })

        //setTimeout(this.updateLegendBar, 200);
      }
    }
    else {
      let vectorAux: { x: string, y: string, value: number, time: Date }[] = [];
      if (this.data[0].values) {
        let len = this.data[0].values.length;
        for (let i = 0; i < this.data.length; i++) {
          const element = this.data[i];
          if (this.jsonIds[i].length === 0) {
            if (element.values) {
              const time = element.values[len-1].x as Date;
              const matrixAux = element.values[len-1].y;

              if (Array.isArray(matrixAux)) {
                if (Array.isArray(matrixAux[0])) {
                  const matrix: number[][] = matrixAux;
                  matrix.forEach((vector, yValue) => {
                    vector.forEach((value, xValue) => {
                      vectorAux.push({
                        x: `${xValue}`,
                        y: `${yValue}`,
                        value: value,
                        time: time
                      })
                    })
                  })
                } else {
                  const vector: number[] = matrixAux;
                  vector.forEach((value, xValue) => {
                    vectorAux.push({
                      x: `${xValue}`,
                      y: "0",
                      value: value,
                      time: time
                    })
                  })
                }
              }

            }
          } else if (element.values) {
            let idTreeAux = this.jsonIds[i].split("-").reverse();
            let requiredJsonData: JsonData = element.values[len-1].y;
            
            let id;
            let idCompare = "i";

            if (idTreeAux.length !== 1) {
              idTreeAux.pop(); //Retira "i"
              while (idTreeAux.length != 0) {
                id = idTreeAux.pop();
                if (id) idCompare = idCompare+"-"+id;
        
                if (requiredJsonData)
                  for (let i = 0; i < requiredJsonData.info.length; i++) {
                    if (requiredJsonData.info[i].id.includes(idCompare)) {
                      requiredJsonData = requiredJsonData.info[i];
                      break;
                    }
                  }
              }
            }

            const time = element.values[len-1].x as Date;
            requiredJsonData.info.forEach((item: JsonData) => {
              const info: any = {
                [item.info[0].label]: item.info[0].info,
                [item.info[1].label]: item.info[1].info,
                [item.info[2].label]: item.info[2].info,
                time: time
              }
              vectorAux.push(info);
            })
          }
        }
      }

      this.previousProcessedData.push(vectorAux);
      if (this.enableRefresh) {
        this.processedData = [...this.previousProcessedData];
        this.dispatch({
          type: "UPDATE_PROCESSEDDATA",
          value: [...this.processedData]
        })
      }
    }
  }

  /*
      reset: reinicializa os dados do gráfico
  */
  public reset = () => {
    this.active = false;
    this.previousProcessedData = [];
    this.processedData = [];
    this.dispatch({ type: "RESET_HEATMAP" })
  }

}

export default HeatMapModel;