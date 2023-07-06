import {useEffect, useReducer} from 'react';
import ChartPanelProps from '../../@types/ChartPanelProps';
import ChartPanelViewProps from '../../@types/ChartPanelViewProps';
import ChartPanelModel from './model';
import ChartPanelView from './view';

// Initial state for ChartPanel
const initialChartPanelState = { 
  tab: 0,
  previousChartListLength: -1
};

// Reducer for ChartPanel
const reducerChartPanel = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_TAB':
      return { 
        ...state, 
        tab: action.value
      };
    case 'UPDATE_PREVIOUSCHARTLISTLENGTH':
      return { 
        ...state, 
        previousChartListLength: action.value
      };
    default:
      return state;
  }
}

// Controller for ChartPanel
const ChartPanelController = (props: ChartPanelProps) => {
  const {
    chartList
  } = props.charts;

  // Use of hooks
  const [chartPanelState, dispatch] = useReducer(reducerChartPanel,initialChartPanelState);

  // Creating ChartPanelModel instance
  const chartPanelModel = new ChartPanelModel(chartPanelState, dispatch);

  /*
    Se a lista de gráficos mudar, será mudado automaticamente para a última aba
  */
  useEffect(() => {
    if (chartPanelModel.getPreviousChartListLength() === -1) {
      chartPanelModel.setPreviousChartListLength(1);
      return;
    }

    if (chartList.length !== chartPanelModel.getPreviousChartListLength()) {
      chartPanelModel.setTab(chartList.length-1);
      chartPanelModel.setPreviousChartListLength(chartList.length);
    }
  },[chartList])

  // Function that handle changing tab action
  const handleTab = (value: number) => {
    chartPanelModel.setTab(value)
  }

  const chartPanelProps: ChartPanelViewProps = {
    chartPanelState,
    handleTab,
    chartPanelProps: props
  }

  return(
    <ChartPanelView 
      {...chartPanelProps}
    />
  )
}

export default ChartPanelController;