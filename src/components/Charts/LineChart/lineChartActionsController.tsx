import { useEffect, useReducer } from 'react';
import LineChartActionsModel from './lineChartActionsModel';
import getScreenshot from '../../../utils/ScreenShot/getScreenshot';
import LineChartActionsView from './lineChartActionsView';
import LineChartProps from '../../../@types/LineChartProps';
import LineChartActionsViewProps from '../../../@types/LineChartActionsViewProps';

// Initial state for LineChartActions
const initialLineChartActionsState = { 
  enableRefresh: true,
  sliderValue: 100,
  sliderXAxisValue: 100,
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
        sliderXAxisValue: action.sliderXAxisValue,
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
        sliderXAxisValue: action.sliderXAxisValue
      };
    case 'ENABLE_REFRESH':
      return { 
        ...state,
        enableRefresh: true, 
        sliderValue: action.sliderValue,
        sliderXAxisValue: action.sliderXAxisValue
      };
    case 'UPDATE_SLIDERVALUE':
      return { 
        ...state, 
        sliderValue: action.sliderValue,
        chartTime: action.chartTime
      };
    case 'UPDATE_SLIDERXAXISVALUE':
      return { 
        ...state, 
        sliderXAxisValue: action.sliderXAxisValue,
        sliderValue: action.sliderValue,
        chartTime: action.chartTime,
      }
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
const LineChartActionsController = (props: LineChartProps) => {
  const { chartId } = props;

  // Getting instance of LineChartActions model
  const chartActions = props.chartActions as LineChartActionsModel;

  // Use of hooks
  const [lineChartActionsState, dispatch] = useReducer(reducerLineChartActions,initialLineChartActionsState);

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

  // Function that handle xAxis slider action
  const handleSliderXAxis = (value: any) => {
    chartActions.setSliderXAxisValue(value as number);
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

  const lineChartActionsViewProps: LineChartActionsViewProps = {
    lineChartActionsState,
    handleEditChartMenu,
    handleInputTimeModal,
    handleEnableRefresh,
    handleSlider,
    handleSliderXAxis,
    handleInputTime,
    handleXAxisChanged,
    handleScreenshot,
    lineChartProps: props
  }

  return(
    <LineChartActionsView
      {...lineChartActionsViewProps}
    />
  )
}

export default LineChartActionsController;