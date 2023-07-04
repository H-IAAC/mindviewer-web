import { useEffect, useReducer } from "react";
import NodeInfoProps from "../../@types/NodeInfoProps";
import NodeInfoViewProps from "../../@types/NodeInfoViewProps";
import NodeInfoModel from "./model";
import NodeInfoView from "./view";

// Initial state for NodeInfo
const initialNodeInfoState = { 
  pathList: [],
  nodeData: undefined,
  nodeJsonData: undefined,
  nodeDataType: "Undefined",
  time: "",
  index: 0,
  inputTimeModal: false 
};

// Reducer for NodeInfo
const reducerNodeInfo = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_INFO':
      return { 
        ...state, 
        pathList: action.pathList,
        nodeData: action.nodeData,
        nodeJsonData: action.nodeJsonData,
        nodeDataType: action.nodeDataType,
        index: action.index,
        time: action.time
      };
    case 'UPDATE_NODEDATA':
      return { 
        ...state, 
        nodeData: action.value
      };
    case 'UPDATE_NODEJSONDATA':
      return { 
        ...state, 
        nodeJsonData: action.nodeJsonData,
        index: action.index,
        time: action.time
      };
    case 'UPDATE_TIME':
      return {
        ...state,
        index: action.index,
        time: action.time
      }
    case 'UPDATE_INPUTTIMEMODAL':
      return {
        ...state,
        inputTimeModal: action.value
      }
    default:
      return state;
  }
}

// Controller for NodeInfo
const NodeInfoController = (props: NodeInfoProps) => {
  const {
    idTree,
    tabActive
  } = props.treePanelState;
  const {
    mainPanelState,
  } = props.treePanelProps;
  const {
    handleOpenAddChartMenu,
    handleCloseNodeInfoModal,
  } = props;

  // Use of hooks
  const [nodeInfoState, dispatch] = useReducer(reducerNodeInfo,initialNodeInfoState);

  // Getting instance of NodeInfo model
  const nodeInfoModel = NodeInfoModel.getInstance();

  // Initializing model
  useEffect(() => {
    nodeInfoModel.init(dispatch);
    nodeInfoModel.reset();
    nodeInfoModel.handleNewInfo(idTree[0], mainPanelState.data, tabActive);
  },[])

  // Function that handle id tree action
  const handleIdTree = (idTree: string) => {
    nodeInfoModel.handleNewInfo(idTree, mainPanelState.data, tabActive);
  }

  // Function that handle adding chart action
  const handleAddChart = () => {
    handleOpenAddChartMenu([nodeInfoModel.getIdTree()]);
    handleCloseNodeInfoModal();
  }

  // Function that handle InputTimeModal action
  const handleInputTimeModal = (value: boolean) => {
    nodeInfoModel.setInputTimeModal(value);
  }

  // Function that handle input time action
  const handleInputTime = (date: Date) => {
    nodeInfoModel.setInputTime(date)
  }

  const nodeInfoViewProps: NodeInfoViewProps = {
    nodeInfoState,
    handleIdTree,
    handleAddChart,
    handleInputTimeModal,
    handleInputTime,
    nodeInfoProps: props
  }

  return(
    <NodeInfoView
      {...nodeInfoViewProps}
    />
  )
}

export default NodeInfoController;