import HeatMapModel from "../heatMapModel";


const roundDecimal = (num: number, places: number) => {
	return +(num.toFixed(places));
}

class EditHeatMapMenuModel {
  private chart: HeatMapModel;
  private chartId: number = -1;
  // private type: string = "";
  private tab: number = 0;
  private title: string = "";
  private xLabelsEnabled: boolean = true;
  private yLabelsEnabled: boolean = true;
  private valueLabelEnabled: boolean = false;
  private panZoomEnabled: boolean = false;
  private tooltipEnabled: boolean = false;
  private xCrossHairEnabled: boolean = false;
  private yCrossHairEnabled: boolean = false;
  private backgroundImageEnabled: boolean = false;
  private markerShape: string = "rect";
  private markerSize: string | undefined;
  private colorRangeType: string = "gradient";
  // private minXInterval: string = "";
  // private timeUnit: string = "";
  // private minY: string = "";
  // private maxY: string = "";
  // private autoRange: boolean = false;
  // private elements: {
  //   label: string | undefined;
  //   color: string;
  // }[] = [];
  // private elementsColors: string[] = [];
  // private colorsChanged: boolean = false;
  // private selectedElements: number[] = [];
  // private palette: string[] | undefined;
  // private showYAxisGrid: boolean = false;
  private dispatch: React.Dispatch<any> = () => null;

  constructor (chart: HeatMapModel) {
    this.chart = chart;
  }

  public init = (chartId: number, dispatch: React.Dispatch<any>) => {
    this.chartId = chartId;

    // this.type = this.chart instanceof LineChartModel? 'line' : 'bar';
    this.tab = 0;
    this.title = this.chart.getTitle();
    this.xLabelsEnabled = this.chart.getXLabelsEnabled();
    this.yLabelsEnabled = this.chart.getYLabelsEnabled();
    this.valueLabelEnabled = this.chart.getValueLabelEnabled();
    this.panZoomEnabled = this.chart.getPanZoomEnabled();
    this.tooltipEnabled = this.chart.getTooltipEnabled();
    this.xCrossHairEnabled = this.chart.getXCrossHairEnabled();
    this.yCrossHairEnabled = this.chart.getYCrossHairEnabled();
    this.backgroundImageEnabled = this.chart.getBackgroundImageEnabled();
    this.markerShape = this.chart.getMarkerShape();
    this.markerSize = this.chart.getMarkerSize()?.toString();
    this.colorRangeType = this.chart.getColorManager().getType();
    // this.minXInterval = roundDecimal((this.chart.getDefaultInterval()/this.chart.getTimeMultiplier()),2).toString();
    // this.timeUnit = this.getTimeUnit();
    // this.minY = this.chart.getYInterval()[0].toString();
    // this.maxY = this.chart.getYInterval()[1].toString();
    // this.autoRange = this.chart.getAutoRange();
    // this.elements = this.chart.getElements();
    // this.elementsColors = this.elements.map(item => item.color);
    // this.colorsChanged = false;
    // this.selectedElements = [];
    // this.palette = undefined;
    // this.showYAxisGrid = this.chart.getShowYAxisGrid();

    this.dispatch = dispatch;
    this.dispatch({
      type: "INIT",
      title: this.title,
      xLabelsEnabled: this.xLabelsEnabled,
      yLabelsEnabled: this.yLabelsEnabled,
      valueLabelEnabled: this.valueLabelEnabled,
      panZoomEnabled: this.panZoomEnabled,
      tooltipEnabled: this.tooltipEnabled,
      xCrossHairEnabled: this.xCrossHairEnabled,
      yCrossHairEnabled: this.yCrossHairEnabled,
      backgroundImageEnabled: this.backgroundImageEnabled,
      markerShape: this.markerShape,
      markerSize: this.markerSize,
      colorRangeType: this.colorRangeType
    })
  }

  /*
    saveEdits: Se selecionada a aba "Parâmetros", salva os novos parâmetros do gráfico. Se selecionada
    a aba "Elementos", chama 'removeDataFromChart', passando o id do gráfico e os elementos a serem 
    removidos
  */
  public saveEdits = () => {
    if (this.tab === 0) {
      if (this.chart.getTitle() !== this.title) {
        //console.log(this.title);
        this.chart.setTitle(this.title);
      }

      if (this.chart.getXLabelsEnabled() !== this.xLabelsEnabled)
        this.chart.setXLabelsEnabled(this.xLabelsEnabled);

      if (this.chart.getYLabelsEnabled() !== this.yLabelsEnabled)
        this.chart.setYLabelsEnabled(this.yLabelsEnabled);

      if (this.chart.getValueLabelEnabled() !== this.valueLabelEnabled)
        this.chart.setValueLabelEnabled(this.valueLabelEnabled);

      if (this.chart.getPanZoomEnabled() !== this.panZoomEnabled)
        this.chart.setPanZoomEnabled(this.panZoomEnabled);
      
      if (this.chart.getTooltipEnabled() !== this.tooltipEnabled)
        this.chart.setTooltipEnabled(this.tooltipEnabled);

      if (this.chart.getXCrossHairEnabled() !== this.xCrossHairEnabled)
        this.chart.setXCrossHairEnabled(this.xCrossHairEnabled);
      
      if (this.chart.getYCrossHairEnabled() !== this.yCrossHairEnabled)
        this.chart.setYCrossHairEnabled(this.yCrossHairEnabled);

      if (this.chart.getBackgroundImageEnabled() !== this.backgroundImageEnabled)
        this.chart.setBackgroundImageEnabled(this.backgroundImageEnabled);

      if (this.chart.getMarkerShape() !== this.markerShape)
        this.chart.setMarkerShape(this.markerShape)

      if (this.chart.getMarkerSize() !== this.markerSize) {
        if (this.markerSize) {
          if (isNaN(parseInt(this.markerSize))) {
            this.chart.setMarkerSize(undefined)
          } else {
            this.chart.setMarkerSize(parseInt(this.markerSize))
          }
        } else {
          this.chart.setMarkerSize(undefined)
        }
      }
    } else {
      const colorManager = this.chart.getColorManager();
      colorManager.saveEdit(this.colorRangeType);
      this.chart.setColor(colorManager.getColorFunction());
      this.chart.updateLegendBar();
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

  public setXLabelsEnabled = (value: boolean) => {
    this.xLabelsEnabled = value;
    this.dispatch({
      type: "UPDATE_XLABELSENABLED",
      value: value
    })
  }

  public setYLabelsEnabled = (value: boolean) => {
    this.yLabelsEnabled = value;
    this.dispatch({
      type: "UPDATE_YLABELSENABLED",
      value: value
    })
  }

  public setValueLabelEnabled = (value: boolean) => {
    this.valueLabelEnabled = value;
    this.dispatch({
      type: "UPDATE_VALUELABELENABLED",
      value: value
    })
  }

  public setPanZoomEnabled = (value: boolean) => {
    this.panZoomEnabled = value;
    this.dispatch({
      type: "UPDATE_PANZOOMENABLED",
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

  public setXCrossHairEnabled = (value: boolean) => {
    this.xCrossHairEnabled = value;
    this.dispatch({
      type: "UPDATE_XCROSSHAIRENABLED",
      value: value
    })
  }

  public setYCrossHairEnabled = (value: boolean) => {
    this.yCrossHairEnabled = value;
    this.dispatch({
      type: "UPDATE_YCROSSHAIRENABLED",
      value: value
    })
  }

  public setBackgroundImageEnabled = (value: boolean) => {
    this.backgroundImageEnabled = value;
    this.dispatch({
      type: "UPDATE_BACKGROUNDIMAGEENABLED",
      value: value
    })
  }

  public setMarkerShape = (value: string) => {
    this.markerShape = value;
    this.dispatch({
      type: "UPDATE_MARKERSHAPE",
      value: value
    })
  }

  public setMarkerSize = (value: string) => {
    this.markerSize = value;
    this.dispatch({
      type: "UPDATE_MARKERSIZE",
      value: value
    })
  }

  public setColorRangeType = (value: string) => {
    this.colorRangeType = value;
    this.dispatch({
      type: "UPDATE_COLORRANGETYPE",
      value: value
    })
  }

}

export default EditHeatMapMenuModel;