import {useEffect, useReducer} from 'react';
import TreeProps from '../../@types/TreeProps';
import TreeViewProps from '../../@types/TreeViewProps';

import TreeModel from './model';
import TreeView from './view';

const initialTreeState = { 
  showMenu: false,
  xPos: "0px",
  yPos: "0px",
  idTree: []
};

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

const TreeController = (props: TreeProps) => {
  const { selectedNodes, tabActive } = props.treePanelState;

  const [treeState, dispatch] = useReducer(reducerTree,initialTreeState);
  const treeModel = new TreeModel(treeState, dispatch);

  //Inicialmente, configura-se o click para chamar a função 'handleClick';
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {window.removeEventListener('click', handleClick)}
  });

  const handleContextMenu = (e: any, key: string) => {
    treeModel.handleContextMenu(e, key, selectedNodes[tabActive]);
  }

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