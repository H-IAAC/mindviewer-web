import { useEffect, useReducer } from 'react';
import LineChartForVectorActionsViewProps from '../../../@types/LineChartForVectorActionsViewProps';
import LineChartForVectorProps from '../../../@types/LineChartForVectorProps';
import getScreenshot from '../../../utils/ScreenShot/getScreenshot';
import LineChartForVectorActionsModel from './lineChartForVectorActionsModel';
import LineChartForVectorActionsView from './lineChartForVectorActionsView';

const initialLineChartActionsState = { 
  enableRefresh: true,
  sliderValue: 100,
  editChartMenu: false,
  chartTime: "",
  inputTimeModal: false
};

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

const LineChartForVectorActionsController = (props: LineChartForVectorProps) => {
  const { chartId } = props;
  const chartActions = props.chartActions as LineChartForVectorActionsModel;


  const [lineChartForVectorActionsState, dispatch] = useReducer(reducerLineChartActions,initialLineChartActionsState);
  //const lineChartActionsModel = new LineChartActionsModel(chart, dispatch)

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
    //console.log("aki")
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