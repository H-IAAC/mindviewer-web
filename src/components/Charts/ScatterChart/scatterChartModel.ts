import JsonData from "../../../@types/JsonDataType";
import Chart from "../chartModel";

class ScatterChartModel extends Chart {
  private viewport: number;

  constructor (idTree: string[][], defaultInterval: number, yInterval: number[], autoRange: boolean, timeMultiplier: number, title: string) {
    super(idTree);
    this.defaultInterval = defaultInterval;
    this.timeMultiplier = timeMultiplier;
    this.yInterval = yInterval;
    this.autoRange = autoRange;
    this.title = title;
    this.viewport = 0;
  }

  public init = () => {
    this.dispatch({
      type: "INIT_CHART",
      data: [...this.data],
      dataChart: [...this.dataChart],
      active: this.active,
      autoRange: this.autoRange,
      xInterval: this.xInterval,
      yInterval: this.yInterval,
      showXAxisGrid: this.showXAxisGrid,
      showYAxisGrid: this.showYAxisGrid,
      colors: [...this.colors],
      viewport: this.viewport,
      title: this.title,
      tooltipActive: this.tooltipActive,
      loading: this.loading
    })
  }

  /*
    defineRange: calcula o novo 'range', quando auto-refresh é desativado
  */
  public defineRange = () => {
    this.range = this.dataChart.length
    //console.log(this.range);
  }

  public setViewport = () => {
    this.viewport = this.dataChart.length-1;
    this.dispatch({
      type: "UPDATE_VIEWPORT",
      value: this.viewport
    })
    //this.fixColors();
  }

  /*
    setViewPortWithSlider: define o novo 'viewport', quando o slider é mudado
  */
  public setViewportWithSlider = (value: number) => {
    if (this.range === 0) return;

    if (value == 100) {
      this.setViewport();
      this.time = this.dataChart[this.dataChart.length-1][0]["time"].getTime();
      return;
    }
    
    this.viewport = Math.floor((value*0.01)*this.range);
    this.dispatch({
      type: "UPDATE_VIEWPORT",
      value: this.viewport
    })

    this.time = this.dataChart[this.viewport][0]["time"].getTime();
  }

  public handleStep = (step: number) => {
    if (this.range === 0) return 100;

    const viewportAux = this.viewport + step;
    
    if (viewportAux < 0) return 0;
    if (viewportAux >= this.dataChart.length) return 100;

    this.viewport = viewportAux;
    this.dispatch({
      type: "UPDATE_VIEWPORT",
      value: this.viewport
    })

    this.time = this.dataChart[this.viewport][0].time.getTime();
    
    const sliderValue = this.viewport*100/(this.range);
    return (sliderValue);
  }
  
  public setViewportWithXAxisSlider = (value: number) => {return;}

  public findViewportValueWithTime = (time: number) => {
    if (time) {
      const difs = this.dataChart.map(item => (
        Math.abs(item[0]["time"].getTime()-time)
      ))

      const min = Math.min(...difs)
      const index = difs.findIndex(item => item === min)
      const viewport = index*100/(this.range)
      return (viewport)
    }
    return 100;
  }

  /*
    getDomain: Devolve o intervalo atual de visualização do gráfico
  */
  public getDomain = () => {
    if (this.elementRef.length === 0) {
      return([0,this.defaultInterval])
    }
    return ([this.elementRef[0].x, Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x)])
  }

  public fixColors = () => {return}

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
  
  public setTooltipActive = (value: boolean) => {
    this.tooltipActive = value;
    this.dispatch({
      type: "UPDATE_TOOLTIPACTIVE",
      value: this.tooltipActive
    })
  }

  public getXAxisViewPortValue = () => 0;

  /*
    constructDataChart: Constroi os novos 'previousDataChart' e 'dataChart'
  */
  public constructDataChart = () => {
    // this.dataChart = new Array(300).fill(0).map(_ => ({x: 100*Math.random(), y: 100*Math.random()}));
    // this.dispatch({
    //   type: "UPDATE_DATACHART",
    //   value: [...this.dataChart]
    // })

    if (this.dataChart.length === 0) { 
      if (this.data[0].values) {
        for (let j = 0; j < this.data[0].values.length; j++) {
          let vectorAux: any[] = [];
          for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            // if (element.values) {
            //   const time = element.values[j].x;
            //   const points: Array<{x:number, y:number}> = element.values[j].y;
            //   points.forEach((point) => {
            //     vectorAux.push({
            //       [`x${i}`]: point.x,
            //       [`y${i}`]: point.y,
            //       time: time
            //     })
            //   })
            //   //vectorAux.push({name: element.labelChart, y: element.values[j].y, x: element.values[j].x});
            // }
            console.log(this.jsonIds);
            if (this.jsonIds[i].length === 0) {
              if (element.values) {
                const time = element.values[j].x;
                const points: Array<{x:number, y:number}> = element.values[j].y;
                points.forEach((point) => {
                  vectorAux.push({
                    [`x${i}`]: point.x,
                    [`y${i}`]: point.y,
                    time: time
                  })
                })
                //vectorAux.push({name: element.labelChart, y: element.values[j].y, x: element.values[j].x});
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
              
              const points = requiredJsonData.info.map((item: JsonData) =>  ({
                [item.info[0].label]: item.info[0].info,
                [item.info[1].label]: item.info[1].info
              }))
              
              const time = element.values[j].x;
              points.forEach((point: any) => {
                vectorAux.push({
                  [`x${i}`]: point.x,
                  [`y${i}`]: point.y,
                  time: time
                })
              })
            }
          }
          
          this.previousDataChart.push(vectorAux);
          this.dataChart.push(vectorAux);
        }
        this.dispatch({
          type: "UPDATE_DATACHART",
          value: [...this.dataChart]
        })
        //this.setViewport();
      }
    }
    else { 
      let vectorAux: any[] = [];
      if (this.data[0].values) {
        let len = this.data[0].values.length;
        for (let i = 0; i < this.data.length; i++) {
          const element = this.data[i];
          // if (element.values) {
          //   const time = element.values[len-1].x;
          //   const points: Array<{x:number, y:number}> = element.values[len-1].y;
          //   points.forEach((point) => {
          //     vectorAux.push({
          //       [`x${i}`]: point.x,
          //       [`y${i}`]: point.y,
          //       time: time
          //     })
          //   })
          //   //vectorAux.push({name: element.labelChart, y: element.values[len-1].y, x: element.values[len-1].x});
          // }
          if (this.jsonIds[i].length === 0) {
            if (element.values) {
              const time = element.values[len-1].x;
              const points: Array<{x:number, y:number}> = element.values[len-1].y;
              points.forEach((point) => {
                vectorAux.push({
                  [`x${i}`]: point.x,
                  [`y${i}`]: point.y,
                  time: time
                })
              })
              //vectorAux.push({name: element.labelChart, y: element.values[len-1].y, x: element.values[len-1].x});
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

            const points = requiredJsonData.info.map((item: JsonData) =>  ({
              [item.info[0].label]: item.info[0].info,
              [item.info[1].label]: item.info[1].info
            }))
            //objAux[`y${i}`] = requiredJsonData.info;
            const time = element.values[len-1].x;
            points.forEach((point: any) => {
              vectorAux.push({
                [`x${i}`]: point.x,
                [`y${i}`]: point.y,
                time: time
              })
            })
          }
        }
      }

      this.previousDataChart.push(vectorAux);
      if (this.enableRefresh) {
        this.dataChart = [...this.previousDataChart];
        this.dispatch({
          type: "UPDATE_DATACHART",
          value: [...this.dataChart]
        })
      }
    }
    // if (this.dataChart.length === 0) {
    //   if (this.data[0].values) {
    //     for (let j = 0; j < this.data[0].values.length; j++) {
    //       let objAux: any = {};
    //       objAux["time"] = this.data[0].values[j].x;
    //       for (let i = 0; i < this.data.length; i++) {
    //         const element = this.data[i];
    //         if (element.values) objAux[`y${i}`] = element.values[j].y;
            
    //       }
          
    //       this.previousDataChart.push(objAux);
    //       this.dataChart.push(objAux);
    //       this.dispatch({
    //         type: "UPDATE_DATACHART",
    //         value: [...this.dataChart]
    //       })
    //     }
    //   }
    // }
    // else { 
    //   let objAux: any = {};
    //   if (this.data[0].values) {
    //     let len = this.data[0].values.length;
    //     objAux["time"] = this.data[0].values[len-1].x;
    //     for (let i = 0; i < this.data.length; i++) {
    //       const element = this.data[i];
    //       if (element.values) objAux[`y${i}`] = element.values[len-1].y;
    //     }
    //   }

    //   this.previousDataChart.push(objAux);
    //   if (this.enableRefresh) {
    //     this.dataChart = [...this.previousDataChart];
    //     this.dispatch({
    //       type: "UPDATE_DATACHART",
    //       value: [...this.dataChart]
    //     })
    //   }
    // }
  }
}

export default ScatterChartModel;