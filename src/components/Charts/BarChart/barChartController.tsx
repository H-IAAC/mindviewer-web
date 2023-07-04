import { useEffect, useReducer } from "react";
import BarChartProps from "../../../@types/BarChartProps";
import BarChartViewProps from "../../../@types/BarChartViewProps";
import BarChartModel from "./barChartModel";
import BarChartView from "./barChartView";

// Initial state for BarChart
const initialBarChartState = { 
  dataChart: [],
  active: false,
  autoRange: true,
  yInterval: [],
  showXAxisGrid: false,
  showYAxisGrid: false,
  colorsFixed: true,
  viewport: undefined,
  title: "",
  tooltipActive: false,
  loading: true
};

// Reducer for BarChart
const reducerBarChart = (state: any, action: any) => {
  switch (action.type) {
    case 'INIT_CHART':
      return {
        dataChart: action.dataChart,
        active: action.active,
        autoRange: action.autoRange,
        yInterval: action.yInterval,
        showXAxisGrid: action.showXAxisGrid,
        showYAxisGrid: action.showYAxisGrid,
        viewport: action.viewport,
        title: action.title,
        tooltipActive: action.tooltipActive,
        loading: action.loading
      };
    case 'UPDATE_DATACHART':
      return { 
        ...state, 
        dataChart: action.value,
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
    case 'COLORSFIXED':
      return { 
        ...state, 
        colorsFixed: true
      };
    case 'UPDATE_VIEWPORT':
      return { 
        ...state, 
        viewport: action.value,
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
        active: false,
        colorsFixed: false
      };
    default:
      return state;
  }
}

// Controller for BarChart
const BarChartController = (props: BarChartProps) => {
  const { chartId } = props;

  // Getting instance of BarChart model
  const chart = props.chart as BarChartModel;

  // Use of hooks
  const [barChartState, dispatch] = useReducer(reducerBarChart,initialBarChartState);

  // Initializing BarChart model
  useEffect(() => {
    chart.setDispatch(dispatch);
    chart.init();
    chart.setId(chartId)
  },[chart])

  const barChartViewProps: BarChartViewProps = {
    barChartState,
    chartId
  }

  return(
    <BarChartView 
      {...barChartViewProps}
    />
  )
}

export default BarChartController;