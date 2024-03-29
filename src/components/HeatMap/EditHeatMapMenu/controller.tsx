import { useEffect, useReducer } from 'react';
import HeatMapModel from '../heatMapModel';
import EditHeatMapMenuView from './view';

// Initial state for EditHeatMapMenu
const initialEditHeatMapMenuState = { 
  tab: 0,
  title: "",
  xLabelsEnabled: true,
  yLabelsEnabled: true,
  valueLabelEnabled: false,
  panZoomEnabled: false,
  tooltipEnabled: false,
  xCrossHairEnabled: false,
  yCrossHairEnabled: false,
  backgroundImageEnabled: false,
  markerShape: "rect",
  markerSize: undefined,
  colorRangeType: "gradient"
};

// Reducer for EditHeatMapMenu
const reducerEditHeatMapMenu = (state: any, action: any) => {
  switch (action.type) {
    case 'INIT':
      return { 
        ...state,
        title: action.title,
        xLabelsEnabled: action.xLabelsEnabled,
        yLabelsEnabled: action.yLabelsEnabled,
        valueLabelEnabled: action.valueLabelEnabled,
        panZoomEnabled: action.panZoomEnabled,
        tooltipEnabled: action.tooltipEnabled,
        xCrossHairEnabled: action.xCrossHairEnabled,
        yCrossHairEnabled: action.yCrossHairEnabled,
        backgroundImageEnabled: action.backgroundImageEnabled,
        markerShape: action.markerShape,
        markerSize: action.markerSize,
        colorRangeType: action.colorRangeType
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
    case 'UPDATE_XLABELSENABLED':
      return { 
        ...state, 
        xLabelsEnabled: action.value
      };
    case 'UPDATE_YLABELSENABLED':
      return { 
        ...state, 
        yLabelsEnabled: action.value
      };
    case 'UPDATE_VALUELABELENABLED':
      return { 
        ...state, 
        valueLabelEnabled: action.value
      };
    case 'UPDATE_PANZOOMENABLED':
      return { 
        ...state, 
        panZoomEnabled: action.value
      };
    case 'UPDATE_TOOLTIPENABLED':
      return { 
        ...state, 
        tooltipEnabled: action.value
      };
    case 'UPDATE_XCROSSHAIRENABLED':
      return { 
        ...state, 
        xCrossHairEnabled: action.value
      };
    case 'UPDATE_YCROSSHAIRENABLED':
      return { 
        ...state, 
        yCrossHairEnabled: action.value
      };
    case 'UPDATE_BACKGROUNDIMAGEENABLED':
      return { 
        ...state, 
        backgroundImageEnabled: action.value
      };
    case 'UPDATE_MARKERSHAPE':
      return { 
        ...state, 
        markerShape: action.value
      };
    case 'UPDATE_MARKERSIZE':
      return { 
        ...state, 
        markerSize: action.value
      };
    case 'UPDATE_COLORRANGETYPE':
      return { 
        ...state, 
        colorRangeType: action.value
      };
    default:
      return state;
  }
}

// Controller for EditHeatMapMenu
const EditHeatMapMenuController = (props: any) => {
  const {
    chartId,
    handleXAxisChanged,
    removeDataFromChart,
    handleEditHeatMapMenu
  } = props;

  // Getting instance of HeatMap model
  const chart = props.chart as HeatMapModel

  // Use of hooks
  const [editHeatMapMenuState, dispatch] = useReducer(reducerEditHeatMapMenu,initialEditHeatMapMenuState);

  // Getting instance of EditHeatMapMenu model
  const editHeatMapMenuModel = chart.getEditHeatMapMenuModel();

  // Gettind instance of ColorManager model
  const colorManager = chart.getColorManager();

  // Initializing HeatMapMenu model
  useEffect(() => {
    editHeatMapMenuModel.init(chartId, dispatch)
  },[])

  // Function that handle saving edits action
  const handleSaveEdits = () => {
    editHeatMapMenuModel.saveEdits();
    handleEditHeatMapMenu(false);
  }

  // Function that handle updating info action
  const handleUpdateInfo = (idInfo: string, value: any) => {
    switch (idInfo) {
      case "tab":
        editHeatMapMenuModel.setTab(value);
        break;
      case "title":
        editHeatMapMenuModel.setTitle(value);
        break;
      case "xLabelsEnabled":
        editHeatMapMenuModel.setXLabelsEnabled(value);
        break;
      case "yLabelsEnabled":
        editHeatMapMenuModel.setYLabelsEnabled(value);
        break;
      case "valueLabelEnabled":
        editHeatMapMenuModel.setValueLabelEnabled(value);
        break;
      case "panZoomEnabled":
        editHeatMapMenuModel.setPanZoomEnabled(value);
        break;
      case "tooltipEnabled":
        editHeatMapMenuModel.setTooltipEnabled(value);
        break;
      case "xCrossHairEnabled":
        editHeatMapMenuModel.setXCrossHairEnabled(value);
        break;
      case "yCrossHairEnabled":
        editHeatMapMenuModel.setYCrossHairEnabled(value);
        break;
      case "backgroundImageEnabled":
        editHeatMapMenuModel.setBackgroundImageEnabled(value);
        break;
      case "markerShape":
        editHeatMapMenuModel.setMarkerShape(value);
        break;
      case "markerSize":
        editHeatMapMenuModel.setMarkerSize(value);
        break;
      case "colorRangeType":
        editHeatMapMenuModel.setColorRangeType(value);
        break;
      default:
        break;
    }
  }

  const editHeatMapMenuViewProps: any = {
    editHeatMapMenuState,
    colorManager,
    handleSaveEdits,
    handleUpdateInfo,
    chartActionsProps: props
  }

  return(
    <EditHeatMapMenuView 
      {...editHeatMapMenuViewProps}
    />
  )
}

export default EditHeatMapMenuController;