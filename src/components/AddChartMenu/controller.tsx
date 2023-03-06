import { useReducer } from 'react';
import AddChartMenuProps from '../../@types/AddChartMenuProps';
import AddChartMenuViewProps from '../../@types/AddChartMenuViewProps';
import AddChartMenuModel from './model';
import AddChartMenuView from './view';

const initialAddChartMenuState = { 
  tab: 0,
  type: "line",
  title: "",
  minXInterval: "10",
  timeUnit: "second",
  minY: "0",
  maxY: "1",
  autoRange: true,
  selectedChart: -1
};

const reducerAddChartMenu = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_TAB':
      return { 
        ...state, 
        tab: action.value
      };
    case 'UPDATE_TYPE':
      return { 
        ...state, 
        type: action.value
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
    case 'UPDATE_SELECTEDCHART':
      return { 
        ...state, 
        selectedChart: action.value
      };
    default:
      return state;
  }
}

const AddChartMenuController = (props: AddChartMenuProps) => {
  const {
    treePanelState,
    handleNewChart,
    handleNewDataInChart
  } = props;

  const [addChartMenuState, dispatch] = useReducer(reducerAddChartMenu,initialAddChartMenuState);
  const addChartMenuModel = new AddChartMenuModel(addChartMenuState, dispatch);

  const handleSubmit = () => {
    if (addChartMenuModel.getTab() === 0) {
      handleNewChart(
        {
          idTree: treePanelState.idTree,
          ...addChartMenuModel.getNewChartInfo()
        }
      )
    } else {
      handleNewDataInChart(treePanelState.idTree, addChartMenuModel.getSelectedChart());
    }
  }

  const handleUpdateInfo = (idInfo: string, value: any) => {
    switch (idInfo) {
      case "tab":
        addChartMenuModel.setTab(value);
        break;
      case "type":
        addChartMenuModel.setType(value);
        break;
      case "title":
        addChartMenuModel.setTitle(value);
        break;
      case "minXInterval":
        addChartMenuModel.setMinXInterval(value);
        break;
      case "timeUnit":
        addChartMenuModel.setTimeUnit(value);
        break;
      case "minY":
        addChartMenuModel.setMinY(value);
        break;
      case "maxY":
        addChartMenuModel.setMaxY(value);
        break;
      case "autoRange":
        addChartMenuModel.setAutoRange(value);
        break;
      case "selectedChart":
        addChartMenuModel.setSelectedChart(value);
        break;
      default:
        break;
    }
  }

  const addChartMenuViewProps: AddChartMenuViewProps = {
    addChartMenuState,
    handleSubmit,
    handleUpdateInfo,
    addChartMenuProps: props
  }

  return(
    <AddChartMenuView 
      {...addChartMenuViewProps}
    />
  )
}

export default AddChartMenuController;