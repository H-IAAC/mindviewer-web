import React from "react";
import JsonData from "../../@types/JsonDataType";
import IDataTree from "../../interfaces/IDataTree";
import ColorPalettes from '../../utils/ColorPalettes';
import EditMapMenuModel from "./EditMapMenu/model";

const randomColor = () => {
  const hex = (Math.random()*0xFFFFFF<<0).toString(16);
  return `#${hex}`;
}

class MapModel {
  private id: number = 0;
  private idTree: string[][];
  private data: IDataTree[] = [];
  protected jsonIds: string[] = [];
  private processedData: { group: string, positions: number[][], time: Date }[][] = [];
  private previousProcessedData: { group: string, positions: number[][], time: Date }[][] = [];
  private elementRef: any;
  private enableRefresh: boolean = true;
  private colors: string[] = [...ColorPalettes[0]];
  private range: number = 0;
  private viewport: number = 0;
  private time: number | undefined;
  private tooltipEnabled: boolean = false;
  private title: string;
  private active: boolean = false;
  private loading: boolean = true;
  private location = "default";
  private dispatch: React.Dispatch<any> = () => null;

  private editMapMenuModel: EditMapMenuModel;

  constructor(idTree: string[][], title: string) {
    this.idTree = idTree;
    this.title = title;

    this.editMapMenuModel = new EditMapMenuModel(this)
  }

  public init = () => {
    this.dispatch({
      type: "INIT_MAP",
      processedData: [...this.processedData],
      active: this.active,
      viewport: this.viewport,
      title: this.title,
      loading: this.loading,
      tooltipEnabled: this.tooltipEnabled,
      colors: [...this.colors]
    })
  }

  //getters
  public getId = () => this.id;
  public getIdTree = () => this.idTree;
  public getData = () => this.data;
  public getProcessedData = () => this.processedData;
  public getEnableRefresh = () => this.enableRefresh;
  public getRange = () => this.range;
  public getViewport = () => this.viewport;
  public getTooltipEnabled = () => this.tooltipEnabled;
  public getTitle = () => this.title;
  public getActive = () => this.active;
  public getLoading = () => this.loading;
  public getLocation = () => this.location;

  public getEditMapMenuModel = () => {
    return this.editMapMenuModel;
  }

  public getElements() {
    const elements = this.data.map((item, index) => ({label: item.labelChart, color: this.colors[index]}));
    return elements;
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

  //setters

  public setData (data: [IDataTree, string][]) { 
    if (this.active) {
      this.data = data.map(item =>  item[0]);
      this.jsonIds = data.map(item => item[1]);

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
  public setProcessedData = (value: { group: string, positions: number[][], time: Date }[][]) => { this.processedData = value };
  public setEnableRefresh = (value: boolean) => { this.enableRefresh = value };
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

  public setTooltipEnabled = (value: boolean) => { 
    this.tooltipEnabled = value;
    this.dispatch({
      type: "UPDATE_TOOLTIPENABLED",
      value: this.tooltipEnabled
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

  public setColors (value: string[]) {
    this.colors = value;
    this.dispatch({
      type: "UPDATE_COLORS",
      value: [...this.colors]
    })
  }

  public deleteColors = (items: number[]) => {
    let index: number | undefined;
    while (items.length !== 0) {
      index = items.pop();
      index !== undefined && this.colors.splice(index,1);
    }
    this.dispatch({
      type: "UPDATE_COLORS",
      value: [...this.colors]
    })
  }
  
  public setDispatch = (dispatch: React.Dispatch<any>) => { 
    console.log("aki3")
    this.dispatch = dispatch 
  };

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

  public constructProcessedData = () => {
    if (this.processedData.length === 0) {
      if (this.data[0].values) {
        for (let j = 0; j < this.data[0].values.length; j++) {
          let vectorAux: { group: string, positions: number[][], time: Date }[] = [];
          for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            if (this.jsonIds[i].length === 0) {
              // if (element.values) {
              //   const time = element.values[j].x as Date;
              //   const objAux = element.values[j].y;

              //   if (Array.isArray(matrixAux)) {
              //     if (Array.isArray(matrixAux[0])) {
              //       const matrix: number[][] = matrixAux;
              //       matrix.forEach((vector, yValue) => {
              //         vector.forEach((value, xValue) => {
              //           vectorAux.push({
              //             x: `${xValue}`,
              //             y: `${yValue}`,
              //             value: value,
              //             time: time
              //           })

              //           valuesArray.push(value);
              //         })
              //       })
              //     } else {
              //       const vector: number[] = matrixAux;
              //       vector.forEach((value, xValue) => {
              //         vectorAux.push({
              //           x: `${xValue}`,
              //           y: "0",
              //           value: value,
              //           time: time
              //         })

              //         valuesArray.push(value);
              //       })
              //     }
              //   }
              // }
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
              let positionsAux: number[][] = []

              requiredJsonData.info.forEach((item: JsonData) => {
                let position = item.info[3].info;
                let lat = position[0].info[2].info;
                let lng = position[1].info[2].info;
                let timestamp = position[2].info[2].info;
                
                positionsAux.push([lat,lng,timestamp]);
              })

              const info: any = {
                group: element.name,
                positions: positionsAux,
                time: time
              }
              vectorAux.push(info);
            }
          }
          this.previousProcessedData.push(vectorAux);
          this.processedData.push(vectorAux);
        }
        console.log([...this.processedData])
        this.dispatch({
          type: "UPDATE_PROCESSEDDATA",
          value: [...this.processedData]
        })
      }
    }
    else {
      let vectorAux: { group: string, positions: number[][], time: Date }[] = [];
      if (this.data[0].values) {
        let len = this.data[0].values.length;
        for (let i = 0; i < this.data.length; i++) {
          const element = this.data[i];
          if (this.jsonIds[i].length === 0) {
            // if (element.values) {
            //   const time = element.values[len-1].x as Date;
            //   const matrixAux = element.values[len-1].y;

            //   if (Array.isArray(matrixAux)) {
            //     if (Array.isArray(matrixAux[0])) {
            //       const matrix: number[][] = matrixAux;
            //       matrix.forEach((vector, yValue) => {
            //         vector.forEach((value, xValue) => {
            //           vectorAux.push({
            //             x: `${xValue}`,
            //             y: `${yValue}`,
            //             value: value,
            //             time: time
            //           })
            //         })
            //       })
            //     } else {
            //       const vector: number[] = matrixAux;
            //       vector.forEach((value, xValue) => {
            //         vectorAux.push({
            //           x: `${xValue}`,
            //           y: "0",
            //           value: value,
            //           time: time
            //         })
            //       })
            //     }
            //   }
            // }
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
            let positionsAux: number[][] = []

            requiredJsonData.info.forEach((item: JsonData) => {
              let position = item.info[3].info;
              let lat = position[0].info[2].info;
              let lng = position[1].info[2].info;
              let timestamp = position[2].info[2].info;
              
              positionsAux.push([lat,lng,timestamp]);
            })

            const info: any = {
              group: element.name,
              positions: positionsAux,
              time: time
            }
            vectorAux.push(info);
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
    this.dispatch({ type: "RESET_MAP" })
  }

}

export default MapModel;