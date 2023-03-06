import { useEffect, useReducer } from 'react';
import getScreenshot from '../../utils/ScreenShot/getScreenshot';
import MapActionsModel from './MapActionsModel';
import MapActionsView from './MapActionsView';

const initialMapActionsState = { 
  enableRefresh: true,
  sliderValue: 100,
  editMapMenu: false,
  time: "",
  inputTimeModal: false
};

const reducerMapActions = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_ALL':
      return {
        ...state,
        enableRefresh: action.enableRefresh,
        sliderValue: action.sliderValue,
        time: action.time
      };
    case 'UPDATE_EDITMAPMENU':
      return { 
        ...state, 
        editMapMenu: action.value
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

const MapActionsController = (props: any) => {
  const { chartId } = props;
  const chartActions = props.chartActions as MapActionsModel;

  const [mapActionsState, dispatch] = useReducer(reducerMapActions,initialMapActionsState);

  useEffect(() => {
    chartActions.init(dispatch);
  },[])

  useEffect(() => {
    chartActions.restart(dispatch);
  },[chartActions])

  const handleEditMapMenu = (value: boolean) => {
    chartActions.setEditMapMenu(value);
  }

  const handleInputTimeModal = (value: boolean) => {
    chartActions.setInputTimeModal(value);
  }

  const handleEnableRefresh = (value: boolean) => {
    chartActions.setEnableRefresh(value);
  }

  const handleSlider = (value: any) => {
    chartActions.setSliderValue(value as number);
  }

  const handleSliderStep = (e: React.KeyboardEvent<HTMLInputElement>) => {
    chartActions.setSliderWithStep(e);
  }

  const handleInputTime = (date: Date) => {
    chartActions.setSliderValueWithInputTime(date);
  }

  const handleXAxisChanged = () => {
    chartActions.xAxisChanged();
  }

  const handleScreenshot = (id: string, title: string) => {
    getScreenshot(id, title);
  }

  const mapActionsViewProps: any = {
    mapActionsState,
    handleEditMapMenu,
    handleInputTimeModal,
    handleEnableRefresh,
    handleSlider,
    handleSliderStep,
    handleInputTime,
    handleXAxisChanged,
    handleScreenshot,
    mapProps: props
  }

  return(
    <MapActionsView
      {...mapActionsViewProps}
    />
  )
}

export default MapActionsController;