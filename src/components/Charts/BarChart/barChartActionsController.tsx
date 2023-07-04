import { useEffect, useReducer } from 'react';
import getScreenshot from '../../../utils/ScreenShot/getScreenshot';
import BarChartActionsView from './barChartActionsView';
import BarChartActionsModel from './barChartActionsModel';
import BarChartProps from '../../../@types/BarChartProps';
import BarChartActionsViewProps from '../../../@types/BarChartActionsViewProps';

// Initial state for BarChartActions
const initialBarChartActionsState = { 
  enableRefresh: true,
  sliderValue: 100,
  editChartMenu: false,
  chartTime: "",
  inputTimeModal: false
};

// Reducer for BarChartActions
const reducerBarChartActions = (state: any, action: any) => {
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

// Controller for BarChartActions
const BarChartActionsController = (props: BarChartProps) => {
  const { chartId } = props;

  // Getting instance of BarChartActions model
  const chartActions = props.chartActions as BarChartActionsModel;

  // Use of hooks
  const [barChartActionsState, dispatch] = useReducer(reducerBarChartActions,initialBarChartActionsState);

  // Initializing BarChartActions model
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

  const barChartActionsViewProps: BarChartActionsViewProps = {
    barChartActionsState,
    handleEditChartMenu,
    handleInputTimeModal,
    handleEnableRefresh,
    handleSlider,
    handleSliderStep,
    handleInputTime,
    handleXAxisChanged,
    handleScreenshot,
    barChartProps: props
  }

  return(
    <BarChartActionsView
      {...barChartActionsViewProps}
    />
  )
}

export default BarChartActionsController;