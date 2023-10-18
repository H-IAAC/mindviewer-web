import React, {useEffect, useReducer} from 'react';
import TreeNodeInfoModel from './model';
import TreeNodeInfoView from './view';

// Initial state for TreeNodeInfo
const initialTreeNodeInfoState = {
  data: {}, 
  showMenu: false,
  xPos: "0px",
  yPos: "0px",
  idTree: [],
  expandedNodes: [],
  selectedNodes: []
};

// Reducer for TreeNodeInfo
const reducerTreeNodeInfo = (state: any, action: any) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        data: action.data, 
        showMenu: action.showMenu,
        xPos: action.xPos,
        yPos: action.yPos,
        idTree: action.idTree,
        expandedNodes: action.expandedNodes,
        selectedNodes: action.selectedNodes
      }
    case 'OPEN_CONTEXTMENU':
      return { 
        ...state, 
        idTree: action.idTree,
        xPos: action.xPos,
        yPos: action.yPos,
        showMenu: true
      };
    case 'CLOSE_CONTEXTMENU':
      return { 
        ...state, 
        idTree: [],
        showMenu: false
      };
    case 'UPDATE_DATA':
      return {
        ...state,
        data: action.value
      }
    case 'UPDATE_EXPANDEDNODES':
      return { 
        ...state, 
        expandedNodes: action.expandedNodes
      };
    case 'UPDATE_SELECTEDNODES':
      return { 
        ...state, 
        selectedNodes: action.selectedNodes,
      };
    default:
      return state;
  }
}

// Controller for TreeNodeInfo
const TreeNodeInfoController = (props: any) => {
  const [treeNodeInfoState, dispatch] = useReducer(reducerTreeNodeInfo,initialTreeNodeInfoState);
  const treeNodeInfoModel = TreeNodeInfoModel.getInstance();

  // Initially, we configure the click to call the 'handleClick' function;
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {window.removeEventListener('click', handleClick)}
  });

  // Initialize the model
  useEffect(() => {
    treeNodeInfoModel.init(dispatch);
  },[])

  // Function that handle context menu action
  const handleContextMenu = (e: any, key: string) => {
    treeNodeInfoModel.handleContextMenu(e, key);
  }

  // Function that handle click action
  const handleClick = () => {
    treeNodeInfoModel.handleClick()
  }

  // Function that handle toggle action
  const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    treeNodeInfoModel.setExpandedNodes(nodeIds);
  };

  // Function that handle select action
  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    treeNodeInfoModel.setSelectedNodes(nodeIds);
  };

  const treeNodeInfoViewProps: any = {
    treeNodeInfoState,
    handleContextMenu,
    handleToggle,
    handleSelect,
    treeNodeInfoProps: props
  }

  return(
    <TreeNodeInfoView
      {...treeNodeInfoViewProps}
    />
  )
}

export default React.memo(TreeNodeInfoController);