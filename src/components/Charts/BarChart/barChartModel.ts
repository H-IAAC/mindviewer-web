import JsonData from "../../../@types/JsonDataType";
import Chart from "../chartModel";

// Timeout wrapper
const timeout = (delay: number) => {
  return new Promise((res) => setTimeout(res, delay));
}

class BarChartModel extends Chart {
  private viewport: number;   // x axis range of visualization

  constructor (idTree: string[][], yInterval: number[], autoRange: boolean, title: string) {
    super(idTree);
    this.yInterval = yInterval;
    this.autoRange = autoRange;
    this.title = title;
    this.viewport = 0;
  }

  // Initialization function
  public init = () => {
    this.dispatch({
      type: "INIT_CHART",
      dataChart: [...this.dataChart],
      active: this.active,
      autoRange: this.autoRange,
      yInterval: this.yInterval,
      showXAxisGrid: this.showXAxisGrid,
      showYAxisGrid: this.showYAxisGrid,
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
    console.log(this.range);
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
      this.time = this.dataChart[this.dataChart.length-1][0].x.getTime();
      //this.fixColors();
      //setTimeout(this.fixColors,5)
      return;
    }
    
    this.viewport = Math.floor((value*0.01)*this.range);
    this.dispatch({
      type: "UPDATE_VIEWPORT",
      value: this.viewport
    })

    this.time = this.dataChart[this.viewport][0].x.getTime();
    //this.fixColors();
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

    this.time = this.dataChart[this.viewport][0].x.getTime();
    //this.fixColors();
    
    const sliderValue = this.viewport*100/(this.range);
    return (sliderValue);
  }

  // Unused
  public setViewportWithXAxisSlider = (value: number) => {return}

  // Function that finds viewport value with a instant of time
  public findViewportValueWithTime = (time: number) => {
    if (time) {
      const difs = this.dataChart.map(item => (
        Math.abs(item[0].x.getTime()-time)
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

  // Function that corrects the bars' colors (because the library doesn't support an option for each bar having just one color)
  // This correction is not working after the transition to MVC architecture
  public fixColors = async () => {
    let doc: HTMLElement | null;
    while (true) {
      doc = document.getElementById(`paper${this.id}`);
      if (doc) break;
      //await timeout(5);
    }
    
    const rects = doc.getElementsByTagName("rect");
    const texts = doc.getElementsByTagName("text");

    while (true) {
      if (rects.length <= 1 || texts.length === 0) {
        //await timeout(5);
      } else {
        break;
      }
    }

    const elements = this.getElements();
    let initial = 0

    for (let i = 0; i < texts.length; i++) {
      const item = texts[i];
      if (item.innerHTML === elements[0].label) {
        initial = i;
        break;
      }
    }

    for (let i = 0; i < rects.length-1; i++) {
      const color = `#${this.colors[i]}`;
      rects[i+1].style.fill = color;
      texts[initial+i].style.fill = color;
    }
    
    //this.colorsFixed = true;
    // this.dispatch({
    //   type: "COLORSFIXED"
    // })
  }

  // Function that deletes a list of colors from chart color's list
  public deleteColors = (items: number[]) => {
    let index: number | undefined;
    while (items.length !== 0) {
      index = items.pop();
      index !== undefined && this.colors.splice(index,1);
    }
  }
  
  public setTooltipActive = (value: boolean) => {
    this.tooltipActive = value; 
    this.dispatch({
      type: "UPDATE_TOOLTIPACTIVE",
      value: this.tooltipActive
    })

    setTimeout(() => this.setViewportWithSlider(100), 5);
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
          let vectorAux = [];
          // We iterate the data vector
          for (let i = 0; i < this.data.length; i++) {
            // For each element, we process it to be in the format accepted by the library
            const element = this.data[i];
            if (this.jsonIds[i].length === 0) {
              if (element.values) vectorAux.push({name: element.labelChart, y: element.values[j].y, x: element.values[j].x});
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

              vectorAux.push({name: requiredJsonData.label/*.split(":")[0]*/, y: requiredJsonData.info, x: element.values[j].x})
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
      let vectorAux = [];
      if (this.data[0].values) {
        let len = this.data[0].values.length;
        // We iterate the data vector
        for (let i = 0; i < this.data.length; i++) {
          const element = this.data[i];
          if (this.jsonIds[i].length === 0) {
            if (element.values) vectorAux.push({name: element.labelChart, y: element.values[len-1].y, x: element.values[len-1].x});
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

            vectorAux.push({name: requiredJsonData.label, y: requiredJsonData.info, x: element.values[len-1].x})
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
    //this.fixColors();
  }
}

export default BarChartModel;