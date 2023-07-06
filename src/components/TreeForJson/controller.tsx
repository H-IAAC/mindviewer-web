import {useEffect, useReducer} from 'react';
import TreeProps from '../../@types/TreeProps';
import TreeViewProps from '../../@types/TreeViewProps';

import TreeForJsonModel from './model';
import TreeForJsonView from './view';

// Initial state for Tree
const initialTreeForJsonState = { 
  jsonTree: [],
  showMenu: false,
  xPos: "0px",
  yPos: "0px",
  idTree: [],
  expandedNodes: [],
  selectedNodes: []
};

// Reducer for Tree
const reducerTreeForJson = (state: any, action: any) => {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        jsonTree: action.jsonTree, 
        showMenu: action.showMenu,
        xPos: action.xPos,
        yPos: action.yPos,
        idTree: action.idTree,
        expandedNodes: action.expandedNodes,
        selectedNodes: action.selectedNodes
      }
    case 'UPDATE_JSONTREE':
      return {
        ...state,
        jsonTree: action.value
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

// Controller for Tree
const TreeForJsonController = (props: any) => {
  // Use of hooks
  const [treeForJsonState, dispatch] = useReducer(reducerTreeForJson,initialTreeForJsonState);

  // Getting instance of TreeForJson model
  const treeForJsonModel = TreeForJsonModel.getInstance();

  // Initially, we configure the click to call the 'handleClick' function;
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {window.removeEventListener('click', handleClick)}
  });

  // Initializating model
  useEffect(() => {
    treeForJsonModel.init(dispatch);
  },[])

  // Function that handle context menu action
  const handleContextMenu = (e: any, key: string) => {
    treeForJsonModel.handleContextMenu(e, key);
  }

  // Function that handle click action
  const handleClick = () => {
    treeForJsonModel.handleClick()
  }

  // Function that handle toggle action
  const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    treeForJsonModel.setExpandedNodes(nodeIds);
  };

  // Function that handle select action
  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    treeForJsonModel.setSelectedNodes(nodeIds);
  };

  const treeForJsonViewProps: any = {
    treeForJsonState,
    handleContextMenu,
    handleToggle,
    handleSelect,
    treeForJsonProps: props
  }

  return(
    <TreeForJsonView
      {...treeForJsonViewProps}
    />
  )
}

export default TreeForJsonController;