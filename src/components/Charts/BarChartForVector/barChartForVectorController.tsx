import { useEffect, useReducer } from "react";
import BarChartForVectorProps from "../../../@types/BarChartForVectorProps";
import BarChartForVectorViewProps from "../../../@types/BarChartForVectorViewProps";
import BarChartForVectorModel from "./barChartForVectorModel";
import BarChartForVectorView from "./barChartForVectorView";

// Initial state for BarChart
const initialBarChartState = { 
  data: [],
  dataChart: [],
  active: false,
  autoRange: true,
  yInterval: [],
  showXAxisGrid: false,
  showYAxisGrid: false,
  colors: [],
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
        data: action.data,
        dataChart: action.dataChart,
        active: action.active,
        autoRange: action.autoRange,
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
        dataChart: action.value,
        //colorsFixed: false
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
    case 'UPDATE_COLORS':
      return { 
        ...state, 
        colors: action.value
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
      };
    default:
      return state;
  }
}

// Controller for BarChart
const BarChartForVectorController = (props: BarChartForVectorProps) => {
  const { chartId } = props;

  // Getting instance of BarChart model
  const chart = props.chart as BarChartForVectorModel;

  // Use of hooks
  const [barChartForVectorState, dispatch] = useReducer(reducerBarChart,initialBarChartState);

  // Initializing BarChart model
  useEffect(() => {
    chart.setDispatch(dispatch);
    chart.init();
    chart.setId(chartId)
  },[chart])

  // useEffect(()=>{
  //   setTimeout(chart.fixColors,5)
  // },[barChartState.viewport, barChartState.dataChart])

  const barChartForVectorViewProps: BarChartForVectorViewProps = {
    barChartForVectorState,
    chartId
  }

  return(
    <BarChartForVectorView 
      {...barChartForVectorViewProps}
    />
  )
}

export default BarChartForVectorController;