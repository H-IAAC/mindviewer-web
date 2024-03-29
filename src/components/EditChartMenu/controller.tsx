import { useEffect, useReducer } from 'react';
import EditChartMenuProps from '../../@types/EditChartMenuProps';
import EditChartMenuViewProps from '../../@types/EditChartMenuViewProps';
import EditChartMenuView from './view';

// Initial state for EditChartMenu
const initialEditChartMenuState = { 
  type: "",
  tab: 0,
  title: "",
  minXInterval: "",
  timeUnit: "",
  minY: "",
  maxY: "",
  autoRange: false,
  elements: [],
  elementsColors: [],
  selectedElements: [],
  palette: undefined,
  showYAxisGrid: false
};

// Reducer for EditChartMenu
const reducerEditChartMenu = (state: any, action: any) => {
  switch (action.type) {
    case 'INIT':
      return { 
        ...state,
        type: action.chartType, 
        title: action.title,
        minXInterval: action.minXInterval,
        timeUnit: action.timeUnit,
        minY: action.minY,
        maxY: action.maxY,
        autoRange: action.autoRange,
        elements: action.elements,
        elementsColors: action.elementsColors,
        showYAxisGrid: action.showYAxisGrid
      };
    case 'UPDATE_TAB':
      return { 
        ...state, 
        tab: action.value
      };
    case 'UPDATE_TITLE':
      return { 
        ...state, 
        title: action.value
      };
    case 'UPDATE_MINXINTERVAL':
      return { 
        ...state, 
        minXInterval: action.value
      };
    case 'UPDATE_TIMEUNIT':
      return { 
        ...state, 
        timeUnit: action.value
      };
    case 'UPDATE_MINY':
      return { 
        ...state, 
        minY: action.value
      };
    case 'UPDATE_MAXY':
      return { 
        ...state, 
        maxY: action.value
      };
    case 'UPDATE_AUTORANGE':
      return { 
        ...state, 
        autoRange: action.value
      };
    case 'UPDATE_ELEMENTSCOLORS':
      return { 
        ...state, 
        elementsColors: action.value
      };
    case 'UPDATE_SELECTEDELEMENTS':
      return { 
        ...state, 
        selectedElements: action.value
      };
    case 'UPDATE_PALETTE':
      return { 
        ...state, 
        palette: action.value
      };
    case 'UPDATE_SHOWYAXISGRID':
      return { 
        ...state, 
        showYAxisGrid: action.value
      };
    default:
      return state;
  }
}

// Controller for ChartMenu
const EditChartMenuController = (props: EditChartMenuProps) => {
  const {
    chart,
    chartId,
    handleXAxisChanged,
    removeDataFromChart,
    handleEditChartMenu
  } = props;

  // Use of hooks
  const [editChartMenuState, dispatch] = useReducer(reducerEditChartMenu,initialEditChartMenuState);

  // Getting instance of EditChartMenu model
  const editChartMenuModel = chart.getEditChartMenuModel();

  // Initializing ChartMenu model
  useEffect(() => {
    editChartMenuModel.init(chartId, dispatch)
  },[])

  // Function that handle saving edits action
  const handleSaveEdits = () => {
    editChartMenuModel.saveEdits(handleXAxisChanged,removeDataFromChart);
    handleEditChartMenu(false);
  }

  // Function that handle changing color action
  const handleColor = (color: string, index: number) => {
    editChartMenuModel.setColor(color,index);
  }

  // Function that handle confirming palette action
  const handleConfirmPalette = () => {
    editChartMenuModel.confirmPalette();
  }

  // Function that handle updating info action
  const handleUpdateInfo = (idInfo: string, value: any) => {
    switch (idInfo) {
      case "tab":
        editChartMenuModel.setTab(value);
        break;
      case "title":
        editChartMenuModel.setTitle(value);
        break;
      case "minXInterval":
        editChartMenuModel.setMinXInterval(value);
        break;
      case "timeUnit":
        editChartMenuModel.setTimeUnit(value);
        break;
      case "minY":
        editChartMenuModel.setMinY(value);
        break;
      case "maxY":
        editChartMenuModel.setMaxY(value);
        break;
      case "autoRange":
        editChartMenuModel.setAutoRange(value);
        break;
      case "selectedElements":
        editChartMenuModel.addInSelectedElements(value);
        break;
      case "palette":
        editChartMenuModel.setPalette(value);
        break;
      case "showYAxisGrid":
        editChartMenuModel.setShowYAxisGrid(value);
        break;
      default:
        break;
    }
  }

  const editChartMenuViewProps: EditChartMenuViewProps = {
    editChartMenuState,
    handleSaveEdits,
    handleColor,
    handleConfirmPalette,
    handleUpdateInfo,
    chartActionsProps: props
  }

  return(
    <EditChartMenuView 
      {...editChartMenuViewProps}
    />
  )
}

export default EditChartMenuController;