import { useEffect, useReducer } from "react";
import LineChartProps from "../../../@types/LineChartProps";
import LineChartViewProps from "../../../@types/LineChartViewProps";
import LineChartModel from "./lineChartModel";
import LineChartView from "./lineChartView";

// Initial state for LineChart
const initialLineChartState = { 
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

// Reducer for LineChart
const reducerLineChart = (state: any, action: any) => {
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

// Controller for LineChart
const LineChartController = (props: LineChartProps) => {
  const { chartId } = props;

  // Getting instance of LineChart model
  const chart = props.chart as LineChartModel;

  // Use of hooks
  const [lineChartState, dispatch] = useReducer(reducerLineChart,initialLineChartState);

  // Initializing LineChart model
  useEffect(() => {
    chart.setDispatch(dispatch);
    chart.init();
  },[chart])

  const lineChartViewProps: LineChartViewProps = {
    lineChartState,
    chartId
  }

  return(
    <LineChartView 
      {...lineChartViewProps}
    />
  )
}

export default LineChartController;