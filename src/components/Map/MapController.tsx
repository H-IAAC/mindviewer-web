import { useEffect, useReducer } from "react";
import MapModel from "./MapModel";
import MapView from "./MapView";

const initialMapState = {
  processedData: [],
  active: false,
  viewport: 0,
  title: "",
  loading: true,
  tooltipEnabled: false,
  colors: []
}

const reducerMap = (state: any, action: any) => {
  console.log(action.type);
  switch (action.type) {
    case 'INIT_MAP':
      return {
        processedData: action.processedData,
        active: action.active,
        viewport: action.viewport,
        title: action.title,
        loading: action.loading,
        tooltipEnabled: action.tooltipEnabled,
        colors: action.colors
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
    //outros updates
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
    case 'UPDATE_TOOLTIPENABLED':
      return {
        ...state,
        tooltipEnabled: action.value
      }
    case 'UPDATE_COLORS':
      return { 
        ...state, 
        colors: action.value
      };
    case 'RESET_MAP':
      return {
        ...state,
        processedData: [],
        active: false,
      }
    default:
      return state;
  }
}

const MapController = (props: any) => {
  const { chartId } = props;
  const chart = props.chart as MapModel;
  
  const [mapState, dispatch] = useReducer(reducerMap, initialMapState);
  
  useEffect(() => {
    setTimeout(() => initMap(chart),500)
  }, [chart])

  const initMap = (chart: MapModel) => {
    chart.setDispatch(dispatch);
    chart.init();
    chart.setId(chartId);
  }

  const mapViewProps: any = {
    mapState,
    chartId
  }

  console.log(mapState)
  return (
    <MapView
      {...mapViewProps}
    />
  )
}

export default MapController;