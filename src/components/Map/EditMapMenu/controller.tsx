import { useEffect, useReducer } from 'react';
import MapModel from '../MapModel';
import EditMapMenuView from './view';

const initialEditMapMenuState = { 
  tab: 0,
  title: "",
  tooltipEnabled: false,
  elements: [],
  elementsColors: [],
  selectedElements: [],
  palette: undefined
};

const reducerEditMapMenu = (state: any, action: any) => {
  switch (action.type) {
    case 'INIT':
      return { 
        ...state,
        title: action.title,
        tooltipEnabled: action.tooltipEnabled,
        elements: action.elements,
        elementsColors: action.elementsColors,
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
    case 'UPDATE_TOOLTIPENABLED':
      return { 
        ...state, 
        tooltipEnabled: action.value
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
    default:
      return state;
  }
}

const EditMapMenuController = (props: any) => {
  const {
    //chart,
    chartId,
    handleXAxisChanged,
    removeDataFromChart,
    handleEditMapMenu
  } = props;

  const chart = props.chart as MapModel
  const [editMapMenuState, dispatch] = useReducer(reducerEditMapMenu,initialEditMapMenuState);
  const editMapMenuModel = chart.getEditMapMenuModel();

  useEffect(() => {
    editMapMenuModel.init(chartId, dispatch)
  },[])

  const handleSaveEdits = () => {
    editMapMenuModel.saveEdits(removeDataFromChart);
    handleEditMapMenu(false);
  }

  const handleColor = (color: string, index: number) => {
    editMapMenuModel.setColor(color,index);
  }

  const handleConfirmPalette = () => {
    editMapMenuModel.confirmPalette();
  }

  const handleUpdateInfo = (idInfo: string, value: any) => {
    switch (idInfo) {
      case "tab":
        editMapMenuModel.setTab(value);
        break;
      case "title":
        editMapMenuModel.setTitle(value);
        break;
      case "tooltipEnabled":
        editMapMenuModel.setTooltipEnabled(value);
        break;
      case "selectedElements":
        editMapMenuModel.addInSelectedElements(value);
        break;
      case "palette":
        editMapMenuModel.setPalette(value);
        break;
      default:
        break;
    }
  }

  const editMapMenuViewProps: any = {
    editMapMenuState,
    handleSaveEdits,
    handleUpdateInfo,
    handleColor,
    handleConfirmPalette,
    chartActionsProps: props
  }

  return(
    <EditMapMenuView 
      {...editMapMenuViewProps}
    />
  )
}

export default EditMapMenuController;