import { useEffect, useReducer } from 'react';
import getScreenshot from '../../utils/ScreenShot/getScreenshot';
import HeatMapActionsModel from './heatMapActionsModel';
import HeatMapActionsView from './heatMapActionsView';


const initialHeatMapActionsState = { 
  enableRefresh: true,
  sliderValue: 100,
  editHeatMapMenu: false,
  time: "",
  inputTimeModal: false
};

const reducerHeatMapActions = (state: any, action: any) => {
  //console.log("aki")
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

const HeatMapActionsController = (props: any) => {
  const { chartId } = props;
  const chartActions = props.chartActions as HeatMapActionsModel;

  const [heatMapActionsState, dispatch] = useReducer(reducerHeatMapActions,initialHeatMapActionsState);
  //const lineChartActionsModel = LineChartActionsModel.getInstance(chartId);

  useEffect(() => {
    chartActions.init(dispatch);
  },[])

  useEffect(() => {
    chartActions.restart(dispatch);
  },[chartActions])

  const handleEditHeatMapMenu = (value: boolean) => {
    chartActions.setEditHeatMapMenu(value);
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