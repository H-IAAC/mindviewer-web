import {useEffect, useReducer} from 'react';
import TreeProps from '../../@types/TreeProps';
import TreeViewProps from '../../@types/TreeViewProps';

import TreeModel from './model';
import TreeView from './view';

// Initial state for Tree
const initialTreeState = { 
  showMenu: false,
  xPos: "0px",
  yPos: "0px",
  idTree: []
};

// Reducer for Tree
const reducerTree = (state: any, action: any) => {
  switch (action.type) {
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
    default:
      return state;
  }
}

// Controller for Tree
const TreeController = (props: TreeProps) => {
  const { selectedNodes, tabActive } = props.treePanelState;

  // Use of hooks
  const [treeState, dispatch] = useReducer(reducerTree,initialTreeState);

  // Creating instance of Tree model
  const treeModel = new TreeModel(treeState, dispatch);

  // Initially, we configure the click to call the 'handleClick' function;
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {window.removeEventListener('click', handleClick)}
  });

  // Function that handle context menu action
  const handleContextMenu = (e: any, key: string) => {
    treeModel.handleContextMenu(e, key, selectedNodes[tabActive]);
  }

  // Function that handle click action
  const handleClick = () => {
    treeModel.handleClick()
  }

  const treeViewProps: TreeViewProps = {
    treeState,
    handleContextMenu,
    treeProps: props
  }

  return(
    <TreeView
      {...treeViewProps}
    />
  )
}

export default TreeController;