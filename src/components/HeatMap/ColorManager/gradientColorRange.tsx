import * as d3 from 'd3-scale';
import IColorRange from '../../../interfaces/IColorRange';

class GradientColorRange implements IColorRange{
  private breakPoints: {value: string, color: string}[];
  private breakPointsAux: {value: string, color: string}[];
  private legendBar = <></>;
  private dispatch: React.Dispatch<any> = () => null;

  constructor () {
    this.breakPoints = [];
    this.breakPointsAux = [];
  }

  public setDispatch = (dispatch: React.Dispatch<any>) => {
    this.breakPointsAux = [...this.breakPoints];
    this.updateLegendBar();

    this.dispatch = dispatch;
    this.dispatch({
      type: "UPDATE_BREAKPOINTS",
      breakPoints: [...this.breakPoints],
      legendBar: this.legendBar
    })
  }

  public saveEdit = () => {
    this.breakPoints = [...this.breakPointsAux]
  }

  public init = (values: number[]) => {
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    this.breakPointsAux.push(
      {
        value: minValue.toString(),
        color: "#f00"
      },
      {
        value: maxValue.toString(),
        color: "#00f"
      }
    )

    this.breakPoints = [...this.breakPointsAux];
    this.updateLegendBar();
  }

  public add = () => {
    const len = this.breakPointsAux.length;
    const value = Math.round((parseFloat(this.breakPointsAux[len-1].value)+parseFloat(this.breakPointsAux[len-2].value))/2);

    const domain = this.breakPoints.map(item => parseFloat(item.value));
    const range = this.breakPoints.map(item => item.color);
    const colorFc = d3.scaleLinear<string>()
      .domain(domain)
      .range(range);

    this.breakPointsAux.push({
      value: value.toString(),
      color: colorFc(value)
    })

    this.breakPointsAux.sort((a, b) => parseFloat(a.value)-parseFloat(b.value))

    this.updateLegendBar();
    this.dispatch({
      type: "UPDATE_BREAKPOINTS",
      breakPoints: [...this.breakPointsAux],
      legendBar: this.legendBar
    })
  }

  public remove = (index: number) => {
    this.breakPointsAux.splice(index,1);

    this.updateLegendBar();
    this.dispatch({
      type: "UPDATE_BREAKPOINTS",
      breakPoints: [...this.breakPointsAux],
      legendBar: this.legendBar
    })
  }

  public update = (index: number, info: {value: string, color: string}) => {
    this.breakPointsAux[index] = info;

    this.updateLegendBar();
    this.dispatch({
      type: "UPDATE_BREAKPOINTS",
      breakPoints: [...this.breakPointsAux],
      legendBar: this.legendBar
    })
  }

  public getRule = () => {
    const domain = this.breakPoints.map(item => parseFloat(item.value));
    const range = this.breakPoints.map(item => item.color);
    const colorFc = d3.scaleLinear<string>()
      .domain(domain)
      .range(range);
    colorFc.clamp(true);

    return((e: any) => colorFc(e.value/*.value*/));
  }

  public updateLegendBar = () => {
    const range = parseFloat(this.breakPointsAux[this.breakPointsAux.length-1].value)-parseFloat(this.breakPointsAux[0].value);
    const minValue = parseFloat(this.breakPointsAux[0].value);

    let backgroundImage = "linear-gradient(to right";
    let markers: any[] = [];

    this.breakPointsAux.forEach(item => {
      const percentual = (parseFloat(item.value)-minValue)*100/range;
      backgroundImage += `, ${item.color} ${percentual}%`;

      markers.push({
        value: item.value,
        percentual: percentual
      })
    })
    backgroundImage += ")";

    this.legendBar = 
      <div
        style={{
          display: 'flex', 
          width: '440px', 
          height: '50px', 
          position: 'relative',
          border: '1px #000 solid',
          backgroundImage: backgroundImage
        }}
      >
        {
          markers.map(item => (
            <div
              style={{
                width: '2px',
                height: '100%',
                backgroundColor: '#000',
                position: 'absolute',
                left: `${item.percentual}%`,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <p
                style={{
                  position: 'absolute',
                  bottom: '-20px'              
                }}
              >{item.value}</p>
            </div>
          ))
        }
      </div>
  }

  public getLegendBar = () => {
    const range = parseFloat(this.breakPoints[this.breakPoints.length-1].value)-parseFloat(this.breakPoints[0].value);
    const minValue = parseFloat(this.breakPoints[0].value);

    let backgroundImage = "linear-gradient(to top";
    let markers: any[] = [];

    this.breakPoints.forEach(item => {
      const percentual = (parseFloat(item.value)-minValue)*100/range;
      backgroundImage += `, ${item.color} ${percentual}%`;

      markers.push({
        value: item.value,
        percentual: percentual
      })
    })
    backgroundImage += ")";

    return(
      <div
        style={{
          display: 'flex', 
          width: '50px', 
          height: '92%', 
          position: 'relative',
          border: '1px #000 solid',
          backgroundImage: backgroundImage
        }}
      >
        {
          markers.map(item => (
            <div
              style={{
                width: '100%',
                height: '2px',
                backgroundColor: '#000',
                position: 'absolute',
                bottom: `${item.percentual}%`,
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
              >{item.value}</p>
            </div>
          ))
        }
      </div>
    )
  }
}

export default GradientColorRange;