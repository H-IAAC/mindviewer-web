import { useEffect, useReducer } from "react";
import ScatterChartModel from "./scatterChartModel";
import ScatterChartView from "./scatterChartView";

// Initial state for ScatterChart
const initialScatterChartState = { 
  data: [],
  dataChart: [],
  active: false,
  autoRange: true,
  xInterval: [],
  yInterval: [],
  showXAxisGrid: false,
  showYAxisGrid: false,
  colors: [],
  viewport: undefined,
  title: "",
  tooltipActive: false,
  loading: true
};

// Reducer for ScatterChart
const reducerScatterChart = (state: any, action: any) => {
  switch (action.type) {
    case 'INIT_CHART':
      return {
        data: action.data,
        dataChart: action.dataChart,
        active: action.active,
        autoRange: action.autoRange,
        xInterval: action.xInterval,
        yInterval: action.yInterval,
        showXAxisGrid: action.showXAxisGrid,
        showYAxisGrid: action.showYAxisGrid,
        colors: action.colors,
        viewport: action.viewport,
        title: action.title,
        tooltipActive: action.tooltipActive,
        loading: action.loading
      };
    case 'UPDATE_DATA':
      return { 
        ...state, 
        data: action.value
      };
    case 'UPDATE_DATACHART':
      return { 
        ...state, 
        dataChart: action.value
      };
    case 'UPDATE_ACTIVE':
      return { 
        ...state, 
        active: action.value
      };
    case 'UPDATE_AUTORANGE':
      return { 
        ...state, 
        autoRange: action.value
      };
    case 'UPDATE_XINTERVAL':
      return { 
        ...state, 
        xInterval: action.value
      };
    case 'UPDATE_YINTERVAL':
      return { 
        ...state, 
        yInterval: action.value
      };
    case 'UPDATE_SHOWXAXISGRID':
      return { 
        ...state, 
        showXAxisGrid: action.value
      };
    case 'UPDATE_SHOWYAXISGRID':
      return { 
        ...state, 
        showYAxisGrid: action.value
      };
    case 'UPDATE_COLORS':
      return { 
        ...state, 
        colors: action.value
      };
    case 'UPDATE_VIEWPORT':
      return { 
        ...state, 
        viewport: action.value
      };
    case 'UPDATE_TITLE':
      return { 
        ...state, 
        title: action.value
      };
    case 'UPDATE_TOOLTIPACTIVE':
      return { 
        ...state, 
        tooltipActive: action.value
      };
    case 'UPDATE_LOADING':
      return { 
        ...state, 
        loading: action.value
      };
    case 'RESET_CHART':
      return { 
        ...state,
        dataChart: [],
        active: false
      };
    default:
      return state;
  }
}

// Controller for ScatterChart
const ScatterChartController = (props: any) => {
  const { chartId } = props;

  // Getting instance of ScatterChart model
  const chart = props.chart as ScatterChartModel;

  // Use of hooks
  const [scatterChartState, dispatch] = useReducer(reducerScatterChart,initialScatterChartState);

  // Initializing ScatterChart model
  useEffect(() => {
    chart.setDispatch(dispatch);
    chart.init();
  },[chart])

  const scatterChartViewProps: any = {
    scatterChartState,
    chartId
  }

  return(
    <ScatterChartView 
      {...scatterChartViewProps}
    />
  )
}

export default ScatterChartController;