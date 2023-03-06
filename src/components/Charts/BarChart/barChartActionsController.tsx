import { useEffect, useReducer } from 'react';
import getScreenshot from '../../../utils/ScreenShot/getScreenshot';
import BarChartActionsView from './barChartActionsView';
import BarChartActionsModel from './barChartActionsModel';
import BarChartProps from '../../../@types/BarChartProps';
import BarChartActionsViewProps from '../../../@types/BarChartActionsViewProps';

const initialBarChartActionsState = { 
  enableRefresh: true,
  sliderValue: 100,
  editChartMenu: false,
  chartTime: "",
  inputTimeModal: false
};

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

const BarChartActionsController = (props: BarChartProps) => {
  const { chartId } = props;
  const chartActions = props.chartActions as BarChartActionsModel;

  const [barChartActionsState, dispatch] = useReducer(reducerBarChartActions,initialBarChartActionsState);
  //const lineChartActionsModel = LineChartActionsModel.getInstance(chartId);

  useEffect(() => {
    chartActions.init(dispatch);
  },[])

  useEffect(() => {
    chartActions.restart(dispatch);
  },[chartActions])

  const handleEditChartMenu = (value: boolean) => {
    chartActions.setEditChartMenu(value);
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