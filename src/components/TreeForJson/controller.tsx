import {useEffect, useReducer} from 'react';
import TreeProps from '../../@types/TreeProps';
import TreeViewProps from '../../@types/TreeViewProps';

import TreeForJsonModel from './model';
import TreeForJsonView from './view';

const initialTreeForJsonState = { 
  jsonTree: [],
  showMenu: false,
  xPos: "0px",
  yPos: "0px",
  idTree: [],
  expandedNodes: [],
  selectedNodes: []
};

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

const TreeForJsonController = (props: any) => {
  const [treeForJsonState, dispatch] = useReducer(reducerTreeForJson,initialTreeForJsonState);
  const treeForJsonModel = TreeForJsonModel.getInstance();

  //Inicialmente, configura-se o click para chamar a função 'handleClick';
  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => {window.removeEventListener('click', handleClick)}
  });

  useEffect(() => {
    treeForJsonModel.init(dispatch);
  },[])

  const handleContextMenu = (e: any, key: string) => {
    treeForJsonModel.handleContextMenu(e, key);
  }

  const handleClick = () => {
    treeForJsonModel.handleClick()
  }

  const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    treeForJsonModel.setExpandedNodes(nodeIds);
  };

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