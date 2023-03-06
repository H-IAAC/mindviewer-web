import { useEffect, useReducer } from 'react';
import LineChartActionsModel from './lineChartActionsModel';
import getScreenshot from '../../../utils/ScreenShot/getScreenshot';
import LineChartActionsView from './lineChartActionsView';
import LineChartProps from '../../../@types/LineChartProps';
import LineChartActionsViewProps from '../../../@types/LineChartActionsViewProps';

const initialLineChartActionsState = { 
  enableRefresh: true,
  sliderValue: 100,
  sliderXAxisValue: 100,
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

const LineChartActionsController = (props: LineChartProps) => {
  const { chartId } = props;
  const chartActions = props.chartActions as LineChartActionsModel;


  const [lineChartActionsState, dispatch] = useReducer(reducerLineChartActions,initialLineChartActionsState);
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

  const handleSliderXAxis = (value: any) => {
    chartActions.setSliderXAxisValue(value as number);
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