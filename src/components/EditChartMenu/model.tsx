import IChart from "../../interfaces/IChart";
import LineChartModel from "../Charts/LineChart/lineChartModel";

const roundDecimal = (num: number, places: number) => {
	return +(num.toFixed(places));
}

class EditChartMenuModel {
  private chart: IChart;
  private chartId: number = -1;
  private type: string = "";
  private tab: number = 0;
  private title: string = "";
  private minXInterval: string = "";
  private timeUnit: string = "";
  private minY: string = "";
  private maxY: string = "";
  private autoRange: boolean = false;
  private elements: {
    label: string | undefined;
    color: string;
  }[] = [];
  private elementsColors: string[] = [];
  private colorsChanged: boolean = false;
  private selectedElements: number[] = [];
  private palette: string[] | undefined;
  private showYAxisGrid: boolean = false;
  private dispatch: React.Dispatch<any> = () => null;

  constructor (chart: IChart) {
    this.chart = chart;
  }

  public init = (chartId: number, dispatch: React.Dispatch<any>) => {
    this.chartId = chartId;

    this.type = this.chart instanceof LineChartModel? 'line' : 'bar';
    this.tab = 0;
    this.title = this.chart.getTitle();
    this.minXInterval = roundDecimal((this.chart.getDefaultInterval()/this.chart.getTimeMultiplier()),2).toString();
    this.timeUnit = this.getTimeUnit();
    this.minY = this.chart.getYInterval()[0].toString();
    this.maxY = this.chart.getYInterval()[1].toString();
    this.autoRange = this.chart.getAutoRange();
    this.elements = this.chart.getElements();
    this.elementsColors = this.elements.map(item => item.color);
    this.colorsChanged = false;
    this.selectedElements = [];
    this.palette = undefined;
    this.showYAxisGrid = this.chart.getShowYAxisGrid();

    this.dispatch = dispatch;
    this.dispatch({
      type: "INIT",
      chartType: this.type,
      title: this.title,
      minXInterval: this.minXInterval,
      timeUnit: this.timeUnit,
      minY: this.minY,
      maxY: this.maxY,
      autoRange: this.autoRange,
      elements: this.elements,
      elementsColors: this.elementsColors,
      showYAxisGrid: this.showYAxisGrid
    })
  }

  //getTimeUnit: função que retorna a unidade de tempo do gráfico
  public getTimeUnit = (): string => {
    const multiplier = this.chart.getTimeMultiplier();
    if (multiplier === 1000) {
      return "second"
    }
    if (multiplier === 60000) {
      return "minute"
    }
    // if (multiplier === 3600000) {
    //   return "hour"
    // }
    return "hour"
  }

  /*
    saveEdits: Se selecionada a aba "Parâmetros", salva os novos parâmetros do gráfico. Se selecionada
    a aba "Elementos", chama 'removeDataFromChart', passando o id do gráfico e os elementos a serem 
    removidos
  */
  public saveEdits = (handleXAxisChanged: ()=>void, removeDataFromChart: (chartId: number, elementId: number[]) => void) => {
    let multiplier: number = 1000;
    if (this.tab === 0) {
      if (this.chart.getTitle() !== this.title) {
        console.log(this.title);
        this.chart.setTitle(this.title);
      }

      if (this.type === 'line' && (roundDecimal((this.chart.getDefaultInterval()/this.chart.getTimeMultiplier()),2).toString() !== this.minXInterval || this.timeUnit !== this.getTimeUnit())) { 
        if (this.timeUnit === "second") {
          multiplier = 1000;
        } else if (this.timeUnit === "minute") {
          multiplier = 60000;
        } else {
          multiplier = 3600000;
        }

        this.chart.setDefaultInterval(parseFloat(this.minXInterval)*multiplier);
        this.chart.setTimeMultiplier(multiplier);
        handleXAxisChanged();
      }

      if (this.chart.getYInterval()[0].toString() !== this.minY || this.chart.getYInterval()[1].toString() !== this.maxY)
        this.chart.setYInterval([parseFloat(this.minY), parseFloat(this.maxY)]);

      if (this.chart.getAutoRange() !== this.autoRange)
        this.chart.setAutoRange(this.autoRange);

      if (this.chart.getShowYAxisGrid() !== this.showYAxisGrid)
        this.chart.setShowYAxisGrid(this.showYAxisGrid);
    } else {
      //console.log(colorsChanged);
      if (this.colorsChanged) {
        //console.log("aki");
        this.chart.setColors([...this.elementsColors]);
        this.chart.fixColors();
      }

      if (this.selectedElements.length !== 0) {
        removeDataFromChart(this.chartId, this.selectedElements);
        this.chart.deleteColors(this.selectedElements);
      }
    }
  }

  public setColor = (color: string, index: number) => {
    //console.log(color);
    this.elementsColors[index] = color.toLowerCase();
    this.dispatch({
      type: "UPDATE_ELEMENTSCOLORS",
      value: [...this.elementsColors]
    })

    this.colorsChanged = true;
  }

  public confirmPalette = () => {
    if (this.palette) {
      this.elementsColors = [...this.palette];
      this.dispatch({
        type: "UPDATE_ELEMENTSCOLORS",
        value: [...this.elementsColors]
      })

      this.colorsChanged = true;
    }
  }

  public setTab = (value: number) => {
    this.tab = value;
    this.dispatch({
      type: "UPDATE_TAB",
      value: value
    })
  }

  public setTitle = (value: string) => {
    this.title = value;
    this.dispatch({
      type: "UPDATE_TITLE",
      value: value
    })
  }

  public setMinXInterval = (value: string) => {
    this.minXInterval = value;
    this.dispatch({
      type: "UPDATE_MINXINTERVAL",
      value: value
    })
  }

  public setTimeUnit = (value: string) => {
    this.timeUnit = value;
    this.dispatch({
      type: "UPDATE_TIMEUNIT",
      value: value
    })
  }

  public setMinY = (value: string) => {
    this.minY = value;
    this.dispatch({
      type: "UPDATE_MINY",
      value: value
    })
  }

  public setMaxY = (value: string) => {
    this.maxY = value;
    this.dispatch({
      type: "UPDATE_MAXY",
      value: value
    })
  }

  public setAutoRange = (value: boolean) => {
    this.autoRange = value;
    this.dispatch({
      type: "UPDATE_AUTORANGE",
      value: value
    })
  }

  // public setElementsColors = (value: string[]) => {
  //   this.elementsColors = value;
  //   this.dispatch({
  //     type: "UPDATE_ELEMENTSCOLORS",
  //     value: value
  //   })
  // }

  public addInSelectedElements = (value: number) => {
    this.selectedElements.push(value);
    this.dispatch({
      type: "UPDATE_SELECTEDELEMENTS",
      value: [...this.selectedElements]
    })
  }

  public setPalette = (value: string[]) => {
    this.palette = value;
    this.dispatch({
      type: "UPDATE_PALETTE",
      value: value
    })
  }

  public setShowYAxisGrid = (value: boolean) => {
    this.showYAxisGrid = value;
    this.dispatch({
      type: "UPDATE_SHOWYAXISGRID",
      value: value
    })
  }
}

export default EditChartMenuModel