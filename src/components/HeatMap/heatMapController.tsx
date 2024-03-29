import { useEffect, useReducer } from "react";
import HeatMapModel from "./heatMapModel";
import HeatMapView from "./heatMapView";

// Initial state for HeatMap
const initialHeatMapState = {
  processedData: [],
  active: false,
  viewport: 0,
  title: "",
  loading: true,
  panZoomEnabled: false,
  markerShape: "rect",
  markerSize: undefined,
  xLabelsEnabled: true,
  yLabelsEnabled: true,
  valueLabelEnabled: false,
  tooltipEnabled: false,
  xCrossHairEnabled: false,
  yCrossHairEnabled: false,
  backgroundImageEnabled: false,
  colorFunction: undefined,
  legendBar: undefined
}

// Reducer for HeatMap
const reducerHeatMap = (state: any, action: any) => {
  switch (action.type) {
    case 'INIT_HEATMAP':
      return {
        processedData: action.processedData,
        active: action.active,
        viewport: action.viewport,
        title: action.title,
        loading: action.loading,
        panZoomEnabled: action.panZoomEnabled,
        markerShape: action.markerShape,
        markerSize: action.markerSize,
        xLabelsEnabled: action.xLabelsEnabled,
        yLabelsEnabled: action.yLabelsEnabled,
        valueLabelEnabled: action.valueLabelEnabled,
        tooltipEnabled: action.tooltipEnabled,
        xCrossHairEnabled: action.xCrossHairEnabled,
        yCrossHairEnabled: action.yCrossHairEnabled,
        backgroundImageEnabled: action.backgroundImageEnabled
      }
    case 'UPDATE_PROCESSEDDATA':
      return {
        ...state,
        processedData: action.value
      }
    case 'UPDATE_VIEWPORT':
      return {
        ...state,
        viewport: action.value
      }
    case 'UPDATE_ACTIVE':
      return {
        ...state,
        active: action.value
      }
    case 'UPDATE_TITLE':
      return {
        ...state,
        title: action.value
      }
    case 'UPDATE_LOADING':
      return {
        ...state,
        loading: action.value
      }
    case 'UPDATE_PANZOOMENABLED':
      return {
        ...state,
        panZoomEnabled: action.value
      }
    case 'UPDATE_MARKERSHAPE':
      return {
        ...state,
        markerShape: action.value
      }
    case 'UPDATE_MARKERSIZE':
      return {
        ...state,
        markerSize: action.value
      }
    case 'UPDATE_XLABELSENABLED':
      return {
        ...state,
        xLabelsEnabled: action.value
      }
    case 'UPDATE_YLABELSENABLED':
      return {
        ...state,
        yLabelsEnabled: action.value
      }
    case 'UPDATE_VALUELABELENABLED':
      return {
        ...state,
        valueLabelEnabled: action.value
      }
    case 'UPDATE_TOOLTIPENABLED':
      return {
        ...state,
        tooltipEnabled: action.value
      }
    case 'UPDATE_XCROSSHAIRENABLED':
      return {
        ...state,
        xCrossHairEnabled: action.value
      }
    case 'UPDATE_YCROSSHAIRENABLED':
      return {
        ...state,
        yCrossHairEnabled: action.value
      }
    case 'UPDATE_BACKGROUNDIMAGEENABLED':
      return {
        ...state,
        backgroundImageEnabled: action.value
      }
    case 'UPDATE_COLORFUNCTION':
      return {
        ...state,
        colorFunction: action.value
      }
    case 'UPDATE_LEGENDBAR':
      return {
        ...state,
        legendBar: action.legendBar
      }
    case 'RESET_HEATMAP':
      return {
        ...state,
        processedData: [],
        active: false,
      }
    default:
      return state;
  }
}

// Controller for HeatMap
const HeatMapController = (props: any) => {
  const { chartId } = props;

  // Getting instance of HeatMap model
  const chart = props.chart as HeatMapModel;

  // Use of hooks
  const [heatMapState, dispatch] = useReducer(reducerHeatMap, initialHeatMapState);

  // Initializing HeatMap model
  useEffect(() => {
    chart.setDispatch(dispatch);
    chart.init();
    chart.setId(chartId);
    setTimeout(chart.updateLegendBar, 300);
  }, [chart])

  const heatMapViewProps: any = {
    heatMapState,
    chartId,
    colorFunction: chart.getColorFunction()
  }

  return (
    <HeatMapView
      {...heatMapViewProps}
    />
  )
}

export default HeatMapController;