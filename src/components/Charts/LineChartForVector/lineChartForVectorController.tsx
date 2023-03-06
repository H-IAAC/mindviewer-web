import { useEffect, useReducer } from "react";
import LineChartForVectorProps from "../../../@types/LineChartForVectorProps";
import LineChartForVectorViewProps from "../../../@types/LineChartForVectorViewProps";
import LineChartForVectorModel from "./lineChartForVectorModel";
import LineChartForVectorView from "./lineChartForVectorView";

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

const LineChartForVectorController = (props: LineChartForVectorProps) => {
  const { chartId } = props;
  const chart = props.chart as LineChartForVectorModel;

  const [lineChartForVectorState, dispatch] = useReducer(reducerLineChart,initialLineChartState);

  useEffect(() => {
    chart.setDispatch(dispatch);
    chart.init();
  },[chart])

  const lineChartViewProps: LineChartForVectorViewProps = {
    lineChartForVectorState,
    chartId
  }

  return(
    <LineChartForVectorView
      {...lineChartViewProps}
    />
  )
}

export default LineChartForVectorController;