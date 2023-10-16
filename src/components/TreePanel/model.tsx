import TreePanelModelType from "../../@types/TreePanelModelType";

class TreePanelModel {
  /*
    tabActive -> Guarda o índice da tab atual (0 ou 1);
    expandedNodes -> Vetor de nós que estão expandidos na árvore;
    selectedNodes -> Vetor de nós selecionados na árvore (no momento, não é útil);
    addChartMenu -> Variável que indica se o modal de adicionar gráfico está ativo;
    idTree -> Nó da árvore selecionado
    allCharts -> Lista dos gráficos existentes
  */
  private tabActive: number;
  private expandedNodes: string[][];
  private selectedNodes: string[][];
  private selectedNodesProcessed: string[][];
  private addChartMenu: boolean;
  private nodeInfoModal: boolean;
  private ideasModal: boolean;
  private idTree: string[];
  private allCharts: string[];
  private dispatch: React.Dispatch<any>;

  constructor (initialState: TreePanelModelType, dispatch: React.Dispatch<any>) {
    this.tabActive = initialState.tabActive;
    this.expandedNodes = initialState.expandedNodes;
    this.selectedNodes = initialState.selectedNodes;
    this.selectedNodesProcessed = initialState.selectedNodesProcessed;
    this.addChartMenu = initialState.addChartMenu;
    this.nodeInfoModal = initialState.nodeInfoModal;
    this.ideasModal = initialState.ideasModal;
    this.idTree = initialState.idTree;
    this.allCharts = initialState.allCharts;
    this.dispatch = dispatch;
  }

  public getTabActive = () => this.tabActive;
  public setTabActive = (value: number) => {
    this.tabActive = value;
    this.dispatch({
      type: "UPDATE_TAB",
      value: value
    })
  }

  public setExpandedNodes = (nodeIds: string[]) => {
    this.expandedNodes[this.tabActive] = nodeIds;
    this.dispatch({
      type: "UPDATE_EXPANDEDNODES",
      expandedNodes: [...this.expandedNodes]
    })
  }

  public setSelectedNodes = (nodeIds: string[]) => {
    this.selectedNodes[this.tabActive] = nodeIds;

    this.selectedNodesProcessed = nodeIds.map(item => {
      let list = [item];
      
      while (item !== "0") {
        item = item.length === 1? "0" : item.slice(0,-1);
        list.push(item); 
      }

      return(list)
    })

    this.dispatch({
      type: "UPDATE_SELECTEDNODES",
      selectedNodes: [...this.selectedNodes],
      selectedNodesProcessed: [...this.selectedNodesProcessed]
    })
  }

  public openAddChartMenu = (chartList: any, idTree: string[]) => {
    this.idTree = idTree;
    this.allCharts = chartList.map((item: any) => item.getTitle());;
    this.addChartMenu = true;
    this.dispatch({
      type: "OPEN_ADDCHARTMENU",
      idTree: this.idTree,
      allCharts: this.allCharts
    })
  }

  public closeAddChartMenu = () => {
    this.addChartMenu = false;
    this.dispatch({
      type: "CLOSE_ADDCHARTMENU"
    })
  }

  public openNodeInfoModal = (idTree: string[]) => {
    this.idTree = idTree;
    this.nodeInfoModal = true;
    this.dispatch({
      type: "OPEN_NODEINFOMODAL",
      idTree: this.idTree,
    })
  }

  public closeNodeInfoModal = () => {
    this.nodeInfoModal = false;
    this.ideasModal = false;
    this.dispatch({
      type: "CLOSE_NODEINFOMODAL"
    })
  }

  public openIdeaModal = (idTree: string[]) => {
    this.idTree = idTree;
    this.nodeInfoModal = false;
    this.ideasModal = true;
    this.dispatch({
      type: "OPEN_IDEAMODAL",
      idTree: this.idTree,
    })
  }

  public addChartNewTab = (idTree: string) => {
    const idString = this.tabActive.toString()+"-"+idTree;
    window.open(`?id=${idString}`);
  }
}

export default TreePanelModel;