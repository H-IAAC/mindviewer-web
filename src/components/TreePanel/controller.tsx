import React, { useEffect, useReducer } from 'react';
import TreePanelProps from '../../@types/TreePanelProps';
import TreePanelViewProps from '../../@types/TreePanelViewProps';
import TreePanelModel from './model';
import TreePanelView from './view';

// Initial state for TreePanel
const initialTreePanelState = { 
  tabActive: 0,
  expandedNodes: [],
  selectedNodes: [],
  selectedNodesProcessed: [],
  addChartMenu: false,
  nodeInfoModal: false,
  idTree: [],
  allCharts: []
};

// Reducer for TreePanel
const reducerTreePanel = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_TAB':
      return { 
        ...state, 
        tabActive: action.value
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
        selectedNodesProcessed: action.selectedNodesProcessed
      };
    case 'OPEN_ADDCHARTMENU':
      return { 
        ...state, 
        idTree: action.idTree,
        allCharts: action.allCharts,
        addChartMenu: true
      };
    case 'CLOSE_ADDCHARTMENU':
      return { 
        ...state, 
        addChartMenu: false
      };
    case 'OPEN_NODEINFOMODAL':
      return { 
        ...state, 
        idTree: action.idTree,
        nodeInfoModal: true
      };
    case 'CLOSE_NODEINFOMODAL':
      return { 
        ...state, 
        nodeInfoModal: false
      };
    default:
      return state;
  }
}

// Controller for TreePanel
const TreePanelController = (props: TreePanelProps) => {
  const {
    data,
    chartList
  } = props.mainPanelState;
  const {
    handleAddChart,
    handleAddNewDataInChart
  } = props;

  // Use of hooks
  const [treePanelState, dispatch] = useReducer(reducerTreePanel,initialTreePanelState);

  // Creating instance of TreePanel model
  const treePanelModel = new TreePanelModel(treePanelState, dispatch);

  // Initializing
  useEffect(() => {
    // Getting url params
    const urlParams = new URLSearchParams(window.location.search);

    // Getting "id" param
    const id = urlParams.get("id");
    let idListParam: Array<string> = [];

    // Analysing if there is some pre-defined action to open "AddChartMenu"
    if (id) {
      idListParam = id.split("-");
      let tab = idListParam.shift();
      if (tab) {
        treePanelModel.setTabActive(parseInt(tab))
        treePanelModel.setExpandedNodes([...idListParam]);
      }

      const initializePage = () => treePanelModel.openAddChartMenu(chartList, [idListParam.join("-")]);
      // We open the menu after some seconds to avoid lost of information
      setTimeout(initializePage, 1500);
    }
  },[])

  /*
    handleToggle: Gerencia a ação de expansão e de contração dos nós da árvore;
  */
  const handleToggle = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    treePanelModel.setExpandedNodes(nodeIds);
  };

  /*
    handleSelect: Gerencia a ação de seleção dos nós da árvore;
  */
  const handleSelect = (event: React.ChangeEvent<{}>, nodeIds: string[]) => {
    treePanelModel.setSelectedNodes(nodeIds);
  };

  /*
    handleAddChart: atualiza a lista de gráficos, adicionando um novo gráfico;
  */
  const handleNewChart = (options: {idTree: string[], type: string, xInterval: number, timeMultiplier: number, yInterval:Array<number>, autoRange: boolean, title: string}) => {
    handleAddChart(treePanelModel.getTabActive(), options);
    treePanelModel.closeAddChartMenu();
  }

  /*
    handleNewDataInChart: Adiciona um novo dado em um determinado gráfico
  */
  const handleNewDataInChart = (idTree: string[], key: number) => {
    handleAddNewDataInChart(treePanelModel.getTabActive(), idTree, key);
    treePanelModel.closeAddChartMenu();
  }

  /*
    handleOpenAddChartMenu: Aciona o modal de adicionar gráficos
  */
  const handleOpenAddChartMenu = (idTree: string[]) => {
    treePanelModel.openAddChartMenu(chartList, idTree);
  }

  // Function that handle closing AddChartMenu action
  const handleCloseAddChartMenu = () => {
    treePanelModel.closeAddChartMenu();
  }

  // Function that handle opening NodeInfoModal action
  const handleOpenNodeInfoModal = (idTree: string[]) => {
    treePanelModel.openNodeInfoModal(idTree);
  }

  // Function that handle closing NodeInfoModal action
  const handleCloseNodeInfoModal = () => {
    treePanelModel.closeNodeInfoModal();
  }

  // Function that handle changing tab status action
  const handleTabActive = (value: number) => {
    treePanelModel.setTabActive(value);
  }

  // Function that handle adding chart on a new tab
  const handleAddChartNewTab = (idTree: string[]) => {
    treePanelModel.addChartNewTab(idTree[0]);
  }

  const treePanelViewProps: TreePanelViewProps = {
    treePanelState,
    handleToggle,
    handleSelect,
    handleNewChart,
    handleNewDataInChart,
    handleOpenAddChartMenu,
    handleCloseAddChartMenu,
    handleOpenNodeInfoModal,
    handleCloseNodeInfoModal,
    handleAddChartNewTab,
    handleTabActive,
    treePanelProps: props
  }

  return(
    <TreePanelView 
      {...treePanelViewProps}
    />
  )
}

export default TreePanelController;