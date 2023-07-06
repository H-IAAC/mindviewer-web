import { useEffect, useReducer } from 'react';
import getScreenshot from '../../utils/ScreenShot/getScreenshot';
import HeatMapActionsModel from './heatMapActionsModel';
import HeatMapActionsView from './heatMapActionsView';

// Initial state for HeatMapActions
const initialHeatMapActionsState = { 
  enableRefresh: true,
  sliderValue: 100,
  editHeatMapMenu: false,
  time: "",
  inputTimeModal: false
};

// Reducer for HeatMapActions
const reducerHeatMapActions = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_ALL':
      return {
        ...state,
        enableRefresh: action.enableRefresh,
        sliderValue: action.sliderValue,
        time: action.time
      };
    case 'UPDATE_EDITHEATMAPMENU':
      return { 
        ...state, 
        editHeatMapMenu: action.value
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
        time: action.time,
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
        time: action.time
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

// Controller for HeatMapActions
const HeatMapActionsController = (props: any) => {
  const { chartId } = props;

  // Getting instance of HeatMapActions model
  const chartActions = props.chartActions as HeatMapActionsModel;

  // Use of hooks
  const [heatMapActionsState, dispatch] = useReducer(reducerHeatMapActions,initialHeatMapActionsState);

  // Initializing HeatMapActions model
  useEffect(() => {
    chartActions.init(dispatch);
  },[])

  // If model changes, we restart it
  useEffect(() => {
    chartActions.restart(dispatch);
  },[chartActions])

  // Function that handle editting heatmap menu action
  const handleEditHeatMapMenu = (value: boolean) => {
    chartActions.setEditHeatMapMenu(value);
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

  const heatMapActionsViewProps: any = {
    heatMapActionsState,
    handleEditHeatMapMenu,
    handleInputTimeModal,
    handleEnableRefresh,
    handleSlider,
    handleSliderStep,
    handleInputTime,
    handleXAxisChanged,
    handleScreenshot,
    heatMapProps: props
  }

  return(
    <HeatMapActionsView
      {...heatMapActionsViewProps}
    />
  )
}

export default HeatMapActionsController;