import JsonData from "../../../@types/JsonDataType";
import Chart from "../chartModel";

class ScatterChartModel extends Chart {
  private viewport: number;   // x axis range of visualization

  constructor (idTree: string[][], defaultInterval: number, yInterval: number[], autoRange: boolean, timeMultiplier: number, title: string) {
    super(idTree);
    this.defaultInterval = defaultInterval;
    this.timeMultiplier = timeMultiplier;
    this.yInterval = yInterval;
    this.autoRange = autoRange;
    this.title = title;
    this.viewport = 0;
  }

  // Initialization function
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
    defineRange: calculates the new 'range', when auto-refresh is turned off
  */
  public defineRange = () => {
    this.range = this.dataChart.length
    //console.log(this.range);
  }

  // setters

  public setViewport = () => {
    this.viewport = this.dataChart.length-1;
    this.dispatch({
      type: "UPDATE_VIEWPORT",
      value: this.viewport
    })
    //this.fixColors();
  }

  /*
    setViewPortWithSlider: sets the new 'viewport', when the slider is changed
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

  // Function that defines the new viewport according to a step
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
  
  // Unused
  public setViewportWithXAxisSlider = (value: number) => {return;}

  // Function that finds viewport value with a instant of time
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
     getDomain: Returns the current visualization range of the chart
  */
  public getDomain = () => {
    if (this.elementRef.length === 0) {
      return([0,this.defaultInterval])
    }
    return ([this.elementRef[0].x, Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x)])
  }

  // unused
  public fixColors = () => {return}

  // Function that deletes a list of colors from chart color's list
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

  // getters

  public getXAxisViewPortValue = () => 0;

  /*
    constructDataChart: Build new 'previousDataChart' and 'dataChart'
  */
  public constructDataChart = () => {
    // If there is no data, we initialize the vector with all information available
    if (this.dataChart.length === 0) { 
      if (this.data[0].values) {
        // We iterate the values vector
        for (let j = 0; j < this.data[0].values.length; j++) {
          let vectorAux: any[] = [];
          // We iterate the data vector
          for (let i = 0; i < this.data.length; i++) {
            // For each element, we process it to be in the format accepted by the library
            const element = this.data[i];
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
          
          // Initializing the dataChart vectors
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
    // Else, we just update the vectors
    else { 
      let vectorAux: any[] = [];
      if (this.data[0].values) {
        let len = this.data[0].values.length;
        // We iterate the data vector
        for (let i = 0; i < this.data.length; i++) {
          const element = this.data[i];
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

      // Updating the dataChart vectors
      this.previousDataChart.push(vectorAux);
      if (this.enableRefresh) {
        this.dataChart = [...this.previousDataChart];
        this.dispatch({
          type: "UPDATE_DATACHART",
          value: [...this.dataChart]
        })
      }
    }
  }
}

export default ScatterChartModel;