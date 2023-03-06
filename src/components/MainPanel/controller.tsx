import {useEffect, useReducer} from 'react';
import MainPanelProps from '../../@types/MainPanelProps';
import MainPanelViewProps from '../../@types/MainPanelViewProps';
import MainPanelModel from './model';
import MainPanelView from './view';

const initialMainPanelState = { 
  data: [],
  chartList: [],
  chartComponentList: [],
  chartLocation: [],
  updateVariable: false,
  noConnection: true,
};

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

  const [mainPanelState, dispatch] = useReducer(reducerMainPanel,initialMainPanelState);
  const mainPanelModel = MainPanelModel.getInstance();

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

  useEffect(() => {
    mainPanelModel.setConnection(connectionActive);
  },[connectionActive])

  useEffect(() => {
    mainPanelModel.updateCharts();
  },[mainPanelState.data])

  const handleAddChart = (tabActive: number, options: any) => {
    mainPanelModel.addChart(tabActive, options);
  }

  const handleAddNewDataInChart = (tabActive: number, idTree: string[], key: number) => {
    mainPanelModel.addNewDataInChart(tabActive, idTree, key);
  }

  const handleRemoveChart = (id: number) => {
    mainPanelModel.removeChart(id);
  }

  const handleRemoveDataFromChart = (chartId: number, elementId: number[]) => {
    mainPanelModel.removeDataFromChart(chartId, elementId);
  }

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