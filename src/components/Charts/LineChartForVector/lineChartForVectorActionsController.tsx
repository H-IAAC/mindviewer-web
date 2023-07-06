import { useEffect, useReducer } from 'react';
import LineChartForVectorActionsViewProps from '../../../@types/LineChartForVectorActionsViewProps';
import LineChartForVectorProps from '../../../@types/LineChartForVectorProps';
import getScreenshot from '../../../utils/ScreenShot/getScreenshot';
import LineChartForVectorActionsModel from './lineChartForVectorActionsModel';
import LineChartForVectorActionsView from './lineChartForVectorActionsView';

// Initial state for LineChartActions
const initialLineChartActionsState = { 
  enableRefresh: true,
  sliderValue: 100,
  editChartMenu: false,
  chartTime: "",
  inputTimeModal: false
};

// Reducer for LineChartActions
const reducerLineChartActions = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_ALL':
      return {
        ...state,
        enableRefresh: action.enableRefresh,
        sliderValue: action.sliderValue,
        chartTime: action.chartTime
      };
    case 'UPDATE_EDITCHARTMENU':
      return { 
        ...state, 
        editChartMenu: action.value
      };
    case 'UPDATE_INPUTTIMEMODAL':
      return { 
        ...state, 
        inputTimeModal: action.value
      };
    case 'DISABLE_REFRESH':
      return { 
        ...state, 
        enableRefresh: false,
        chartTime: action.chartTime,
      };
    case 'ENABLE_REFRESH':
      return { 
        ...state,
        enableRefresh: true, 
        sliderValue: action.sliderValue,
      };
    case 'UPDATE_SLIDERVALUE':
      return { 
        ...state, 
        sliderValue: action.sliderValue,
        chartTime: action.chartTime
      };
    case 'RESET_SLIDERVALUE':
      return { 
        ...state, 
        sliderValue: 100
      }
    default:
      return state;
  }
}

// Controller for LineChartActions
const LineChartForVectorActionsController = (props: LineChartForVectorProps) => {
  const { chartId } = props;

  // Getting instance of LineChartActions model
  const chartActions = props.chartActions as LineChartForVectorActionsModel;

  // Use of hooks
  const [lineChartForVectorActionsState, dispatch] = useReducer(reducerLineChartActions,initialLineChartActionsState);

  // Initializing LineChartActions model
  useEffect(() => {
    chartActions.init(dispatch);
  },[])

  // If model changes, we restart it
  useEffect(() => {
    chartActions.restart(dispatch);
  },[chartActions])

  // Function that handle editting chart menu action
  const handleEditChartMenu = (value: boolean) => {
    chartActions.setEditChartMenu(value);
  }

  // Function that handle input time modal action
  const handleInputTimeModal = (value: boolean) => {
    chartActions.setInputTimeModal(value);
  }

  // Function that handle enabling refresh action
  const handleEnableRefresh = (value: boolean) => {
    chartActions.setEnableRefresh(value);
  }

  // Function that handle slider action
  const handleSlider = (value: any) => {
    chartActions.setSliderValue(value as number);
  }

  // Function that handle slider step action
  const handleSliderStep = (e: React.KeyboardEvent<HTMLInputElement>) => {
    chartActions.setSliderWithStep(e);
  }

  // Function that handle input time action
  const handleInputTime = (date: Date) => {
    chartActions.setSliderValueWithInputTime(date);
  }

  // Function that handle xAxis change action
  const handleXAxisChanged = () => {
    chartActions.xAxisChanged();
  }

  // Function that handle screenshot action
  const handleScreenshot = (id: string, title: string) => {
    getScreenshot(id, title);
  }

  const lineChartForVectorActionsViewProps: LineChartForVectorActionsViewProps = {
    lineChartForVectorActionsState,
    handleEditChartMenu,
    handleInputTimeModal,
    handleEnableRefresh,
    handleSlider,
    handleSliderStep,
    handleInputTime,
    handleXAxisChanged,
    handleScreenshot,
    lineChartForVectorProps: props
  }

  return(
    <LineChartForVectorActionsView
      {...lineChartForVectorActionsViewProps}
    />
  )
}

export default LineChartForVectorActionsController;