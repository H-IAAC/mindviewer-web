import MapModel from "../MapModel";

class EditMapMenuModel {
  private chart: MapModel;
  private chartId: number = -1;
  private tab: number = 0;
  private title: string = "";
  private tooltipEnabled: boolean = false;
  private elements: {
    label: string | undefined;
    color: string;
  }[] = [];
  private elementsColors: string[] = [];
  private colorsChanged: boolean = false;
  private selectedElements: number[] = [];
  private palette: string[] | undefined;

  private dispatch: React.Dispatch<any> = () => null;

  constructor (chart: MapModel) {
    this.chart = chart;
  }

  public init = (chartId: number, dispatch: React.Dispatch<any>) => {
    this.chartId = chartId;

    this.tab = 0;
    this.title = this.chart.getTitle();
    this.tooltipEnabled = this.chart.getTooltipEnabled();
    this.elements = this.chart.getElements();
    this.elementsColors = this.elements.map(item => item.color);
    this.colorsChanged = false;
    this.selectedElements = [];
    this.palette = undefined;

    this.dispatch = dispatch;
    this.dispatch({
      type: "INIT",
      title: this.title,
      tooltipEnabled: this.tooltipEnabled,
      elements: this.elements,
      elementsColors: this.elementsColors,
    })
  }

  /*
    saveEdits: Se selecionada a aba "Parâmetros", salva os novos parâmetros do gráfico. Se selecionada
    a aba "Elementos", chama 'removeDataFromChart', passando o id do gráfico e os elementos a serem 
    removidos
  */
  public saveEdits = (removeDataFromChart: (chartId: number, elementId: number[]) => void) => {
    if (this.tab === 0) {
      if (this.chart.getTitle() !== this.title) {
        //console.log(this.title);
        this.chart.setTitle(this.title);
      }
      
      if (this.chart.getTooltipEnabled() !== this.tooltipEnabled)
        this.chart.setTooltipEnabled(this.tooltipEnabled);

    } else {
      if (this.colorsChanged) {
        this.chart.setColors([...this.elementsColors]);
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

  public setTooltipEnabled = (value: boolean) => {
    this.tooltipEnabled = value;
    this.dispatch({
      type: "UPDATE_TOOLTIPENABLED",
      value: value
    })
  }

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

}

export default EditMapMenuModel;