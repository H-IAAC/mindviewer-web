import {useEffect, useReducer} from 'react';
import MainPanelProps from '../../@types/MainPanelProps';
import MainPanelViewProps from '../../@types/MainPanelViewProps';
import MainPanelModel from './model';
import MainPanelView from './view';

// Initial state for MainPanel
const initialMainPanelState = { 
  data: [],
  chartList: [],
  chartComponentList: [],
  chartLocation: [],
  updateVariable: false,
  noConnection: true,
};

// Reducer for MainPanel
const reducerMainPanel = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_DATA':
      return { 
        ...state, 
        data: action.data
      };
    case 'UPDATE_NOCONNECTION':
      return { 
        ...state, 
        noConnection: action.value
      };
    case 'UPDATE_CHARTLIST':
      return {
        ...state,
        chartList: action.chartList,
        chartComponentList: action.chartComponentList,
        chartLocation: action.chartLocation
      };
    case 'UPDATEVARIABLE':
      return {
        ...state,
        updateVariable: !state.updateVariable
      };
    case 'UPDATE_CHARTLOCATION':
      return {
        ...state,
        chartLocation: action.chartLocation
      }
    default:
      return state;
  }
}

// Controller for MainPanel
const MainPanelController = (props: MainPanelProps) => {
  const {
    initialTime, 
    setupOption, 
    url, 
    files, 
    connectionActive,
    layout
  } = props.appState;
  const {
    handleConnectionActive
  } = props;

  // Use of hooks
  const [mainPanelState, dispatch] = useReducer(reducerMainPanel,initialMainPanelState);

  // Getting instance of MainPanel model
  const mainPanelModel = MainPanelModel.getInstance();

  // Initializing model
  useEffect(() => {
    mainPanelModel.init(mainPanelState, dispatch);
    if (setupOption) {
      mainPanelModel.setFiles(files);
      mainPanelModel.initDataFiles();
    } else {
      handleConnectionActive(true);
      mainPanelModel.setUrl(url);
      mainPanelModel.setConnectionActive(true);
    }
  },[])

  // When connection status changes, we update MainPanel
  useEffect(() => {
    mainPanelModel.setConnection(connectionActive);
  },[connectionActive])

  // When data changes, we update MainPanel
  useEffect(() => {
    mainPanelModel.updateCharts();
  },[mainPanelState.data])

  // Function that handle adding chart action
  const handleAddChart = (tabActive: number, options: any) => {
    mainPanelModel.addChart(tabActive, options);
  }

  // Function that handle adding new data action
  const handleAddNewDataInChart = (tabActive: number, idTree: string[], key: number) => {
    mainPanelModel.addNewDataInChart(tabActive, idTree, key);
  }

  // Function that handle removing chart action
  const handleRemoveChart = (id: number) => {
    mainPanelModel.removeChart(id);
  }

  // Function that handle removing data action
  const handleRemoveDataFromChart = (chartId: number, elementId: number[]) => {
    mainPanelModel.removeDataFromChart(chartId, elementId);
  }

  // Function that handle updating chart location action
  const handleUpdateChartLocation = (chartId: number, newLocation: string) => {
    mainPanelModel.updateChartLocation(chartId, newLocation);
  }

  const updateChartsWithNoConnection = () => {
    mainPanelModel.updateChartsWithNoConnection();
  }

  const mainPanelViewProps: MainPanelViewProps = {
    mainPanelState,
    layout,
    handleAddChart,
    handleAddNewDataInChart,
    handleRemoveChart,
    handleRemoveDataFromChart,
    updateChartsWithNoConnection,
    handleUpdateChartLocation
  }

  return(
    <MainPanelView 
      {...mainPanelViewProps}
    />
  )
}

export default MainPanelController;