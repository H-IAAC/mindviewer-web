import React from "react";
import IColorRange from "../../../interfaces/IColorRange";

class CategoricalColorRange implements IColorRange {
  private colorIntervals: {min: string, max: string, color: string}[];
  private colorIntervalsAux: {min: string, max: string, color: string}[];
  private legendBar = <></>;
  private dispatch: React.Dispatch<any> = () => null;

  constructor () {
    this.colorIntervals = [];
    this.colorIntervalsAux = [];
  }

  public setDispatch = (dispatch: React.Dispatch<any>) => {
    this.colorIntervalsAux = [...this.colorIntervals];
    this.updateLegendBar();

    this.dispatch = dispatch;
    this.dispatch({
      type: "UPDATE_COLORINTERVALS",
      intervals: [...this.colorIntervals],
      legendBar: this.legendBar
    })
  }

  public saveEdit = () => {
    this.colorIntervals = [...this.colorIntervalsAux]
  }

  public init = (values: number[]) => {
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const avg = Math.round((minValue+maxValue)/2);

    this.colorIntervalsAux.push(
      {
        min: minValue.toString(),
        max: avg.toString(),
        color: "#f00"
      },
      {
        min: avg.toString(),
        max: maxValue.toString(),
        color: "#00f"
      }
    )

    this.colorIntervals = [...this.colorIntervalsAux];
    this.updateLegendBar();
  }

  public add = () => {
    const len = this.colorIntervalsAux.length;
    const value = parseFloat(this.colorIntervalsAux[len-1].max);
    this.colorIntervalsAux.push({
      min: value.toString(),
      max: (value+10).toString(),
      color: "#fff"
    })

    this.updateLegendBar();
    this.dispatch({
      type: "UPDATE_COLORINTERVALS",
      intervals: [...this.colorIntervalsAux],
      legendBar: this.legendBar
    })
  }

  public remove = (index: number) => {
    this.colorIntervalsAux.splice(index, 1);

    this.updateLegendBar();
    this.dispatch({
      type: "UPDATE_COLORINTERVALS",
      intervals: [...this.colorIntervalsAux],
      legendBar: this.legendBar
    })
  }

  public update = (index: number, info: {min: string, max: string, color: string}) => {
    this.colorIntervalsAux[index] = info;

    this.updateLegendBar();
    this.dispatch({
      type: "UPDATE_COLORINTERVALS",
      intervals: [...this.colorIntervalsAux],
      legendBar: this.legendBar
    })
  }

  public getRule = () => {
    return((e: any) => {
      for (let i = 0; i < this.colorIntervals.length; i++) {
        const interval = this.colorIntervals[i];
        if (e.value/*.value*/ >= parseFloat(interval.min) && e.value/*.value*/ <= parseFloat(interval.max)) {
          return interval.color;
        }
      }
      return "#fff";
    })
  }

  public updateLegendBar = () => {
    let intervals: {min: string, max: string, color: string}[]= [];
    this.colorIntervalsAux.forEach((item, index) => {
      if (index === 0) {
        intervals.push(item);
      }
      else {
        const lastMax = intervals[intervals.length-1].max;
        if (item.min === lastMax) {
          intervals.push(item)
        } else {
          intervals.push({
            min: lastMax,
            max: item.min,
            color: "#fff"
          }, item)
        }
      }
    })

    const range = parseFloat(intervals[intervals.length-1].max) - parseFloat(intervals[0].min);
    const minValue = parseFloat(intervals[0].min);
    this.legendBar = 
      <div style={{
        display: 'flex', 
        width: '440px', 
        height: '50px', 
        position: 'relative',
        border: '1px #000 solid'
      }}>
        {
          intervals.map((item, index) => (
            <>
              <div
                style={{
                  width: `${(parseFloat(item.max)-parseFloat(item.min))*100/range}%`,
                  backgroundColor: item.color
                }}
              />
              <div
                style={{
                  width: '2px',
                  height: '100%',
                  backgroundColor: '#000',
                  position: 'absolute',
                  left: `${(parseFloat(item.min)-minValue)*100/range}%`,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <p
                  style={{
                    position: 'absolute',
                    bottom: '-20px'              
                  }}
                >{item.min}</p>
              </div>
              {
                index === intervals.length-1 &&
                <div
                  style={{
                    width: '2px',
                    height: '100%',
                    backgroundColor: '#000',
                    position: 'absolute',
                    right: 0,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <p
                    style={{
                      position: 'absolute',
                      bottom: '-20px'                
                    }}
                  >{item.max}</p>
                </div>
              }
            </>
          ))
        }
      </div>
  }

  public getLegendBar = () => {
    let intervals: {min: string, max: string, color: string}[]= [];
    this.colorIntervals.forEach((item, index) => {
      if (index === 0) {
        intervals.push(item);
      }
      else {
        const lastMax = intervals[intervals.length-1].max;
        if (item.min === lastMax) {
          intervals.push(item)
        } else {
          intervals.push({
            min: lastMax,
            max: item.min,
            color: "#fff"
          }, item)
        }
      }
    })

    const range = parseFloat(intervals[intervals.length-1].max) - parseFloat(intervals[0].min);
    const minValue = parseFloat(intervals[0].min);
    
    return(
      <div style={{
        display: 'flex', 
        flexDirection: 'column-reverse',
        width: '50px', 
        height: '92%', 
        position: 'relative',
        border: '1px #000 solid'
      }}>
        {
          intervals.map((item, index) => (
            <>
              <div
                style={{
                  height: `${(parseFloat(item.max)-parseFloat(item.min))*100/range}%`,
                  backgroundColor: item.color
                }}
              />
              <div
                style={{
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#000',
                  position: 'absolute',
                  bottom: `${(parseFloat(item.min)-minValue)*100/range}%`,
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <p
                  style={{
                    position: 'absolute',
                    left: '60px',
                    top: '-8px',
                    fontSize: '14px'                  
                  }}
                >{item.min}</p>
              </div>
              {
                index === intervals.length-1 &&
                <div
                  style={{
                    width: '100%',
                    height: '2px',
                    backgroundColor: '#000',
                    position: 'absolute',
                    top: 0,
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <p
                    style={{
                      position: 'absolute',
                      left: '60px',
                      top: '-8px',
                      fontSize: '14px'                  
                    }}
                  >{item.max}</p>
                </div>
              }
            </>
          ))
        }
      </div>
    )
  }
}

export default CategoricalColorRange;