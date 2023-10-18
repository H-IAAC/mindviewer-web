import { Viewport } from "@devexpress/dx-react-chart";
import JsonData from "../../../@types/JsonDataType";
import Chart from "../chartModel";

class LineChartModel extends Chart {
  private viewport: Viewport;   // x axis range of visualization

  constructor (idTree: string[][], defaultInterval: number, yInterval: number[], autoRange: boolean, timeMultiplier: number, title: string) {
    super(idTree);
    this.defaultInterval = defaultInterval;
    this.timeMultiplier = timeMultiplier;
    this.yInterval = yInterval;
    this.autoRange = autoRange;
    this.title = title;
    this.viewport = {
      argumentStart: 0,
      argumentEnd: 10
    }
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
    this.range = Math.max(this.elementRef[this.elementRef.length-1].x.getTime()-this.elementRef[0].x.getTime()-this.defaultInterval,0);
  }

  // setters

  public setViewport = () => {
    if (this.elementRef) {
      this.viewport = {
        argumentStart: Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x.getTime())-this.defaultInterval,
        argumentEnd: Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x.getTime())
      }
      this.dispatch({
        type: "UPDATE_VIEWPORT",
        value: this.viewport
      })
    }
  }

  /*
    setViewPortWithSlider: sets the new 'viewport', when the slider is changed
  */
  public setViewportWithSlider = (value: number) => {
    if (this.range === 0) return;

    this.viewport = {
      argumentStart: this.elementRef[0].x.getTime()+(value*0.01)*this.range,
      argumentEnd: (this.elementRef[0].x.getTime()+(value*0.01)*this.range)+this.defaultInterval
    }
    this.dispatch({
      type: "UPDATE_VIEWPORT",
      value: this.viewport
    })
    this.time = Math.trunc((this.elementRef[0].x.getTime()+(value*0.01)*this.range)+this.defaultInterval);
  }

  // unused
  public handleStep = (step: number) => 0;
  
  // Function that sets the new viewport value according to x axis slider
  public setViewportWithXAxisSlider = (value: number) => {
    if (this.range === 0) return;

    const range = this.elementRef[this.elementRef.length-1].x.getTime()-this.elementRef[0].x.getTime()
    const newDefaultInterval  = -((range-1000)/100)*value+range;
    this.defaultInterval = Math.round(newDefaultInterval);
    this.timeMultiplier = 1000;

    const argumentStartAux = this.viewport.argumentEnd-this.defaultInterval;
    const argumentEndAux = Math.min(this.viewport.argumentStart+this.defaultInterval,this.elementRef[this.elementRef.length-1].x.getTime());

    if (argumentStartAux >= this.elementRef[0].x.getTime()) {
      this.viewport = {
        argumentStart: argumentStartAux,
        argumentEnd: this.viewport.argumentEnd
      }
    } else {
      this.viewport = {
        argumentStart: this.viewport.argumentStart,
        argumentEnd: argumentEndAux
      }
      this.time = Math.round(argumentEndAux);
    }

    this.defineRange();
    this.dispatch({
      type: "UPDATE_VIEWPORT",
      value: this.viewport
    });
  }

  // Function that finds viewport value with a instant of time
  public findViewportValueWithTime = (time: number) => {
    if (time) {
      const viewport = (time-this.defaultInterval-this.elementRef[0].x.getTime())*100/this.range

      if (viewport<0) return 0;
      if (viewport>100) return 100;
      return viewport
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
    return ([this.elementRef[0].x.getTime(), Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x.getTime())])
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

  public getXAxisViewPortValue = () => {
    const value = 100*(-this.range)/(1000-this.range-this.defaultInterval);
    if (value<0) return 0;
    if (value>100) return 100;
    return value;
  }

  /*
    constructDataChart: Build new 'previousDataChart' and 'dataChart'
  */
  public constructDataChart = () => {
    // If there is no data, we initialize the vector with all information available
    if (this.dataChart.length === 0) {
      if (this.data[0].values) {
        // We iterate the values vector
        for (let j = 0; j < this.data[0].values.length; j++) {
          const objAux: any = {};
          objAux["time"] = this.data[0].values[j].x;
          // We iterate the data vector
          for (let i = 0; i < this.data.length; i++) {
            // For each element, we process it to be in the format accepted by the library
            const element = this.data[i];
            if (this.jsonIds[i].length === 0) {
              if (element.values) objAux[`y${i}`] = element.values[j].y;
            } else if (element.values) {
              const idTreeAux = this.jsonIds[i].split("-").reverse();
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

              objAux[`y${i}`] = requiredJsonData.info;
            }
          }
          
          // Initializing the dataChart vectors
          this.previousDataChart.push(objAux);
          this.dataChart.push(objAux);
          this.dispatch({
            type: "UPDATE_DATACHART",
            value: [...this.dataChart]
          })
        }
      }
    }
    // Else, we just update the vectors
    else { 
      const objAux: any = {};
      if (this.data[0].values) {
        const len = this.data[0].values.length;
        objAux["time"] = this.data[0].values[len-1].x;
        // We iterate the data vector
        for (let i = 0; i < this.data.length; i++) {
          const element = this.data[i];
          if (this.jsonIds[i].length === 0) {
            if (element.values) objAux[`y${i}`] = element.values[len-1].y;
          } else if (element.values) {
            const idTreeAux = this.jsonIds[i].split("-").reverse();
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

            objAux[`y${i}`] = requiredJsonData.info;
          }
        }
      }

      // Updating the dataChart vectors
      this.previousDataChart.push(objAux);
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

export default LineChartModel;