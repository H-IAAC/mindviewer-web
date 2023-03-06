import TreeModelType from "../../@types/TreeModelType";

class TreeForJsonModel {
  /*
    showMenu -> Váriavel booleana que indica se o menu de contexto está sendo visualizado;
    xPos -> Posição x do menu de contexto;
    yPos -> Posição y do menu de contexto;
    idTree -> Índice do nó da arvore que está sendo analisado pelo menu de contexto;
  */
  private static instance: TreeForJsonModel;
  private expandedNodes: string[];
  private selectedNodes: string[];
  private showMenu: boolean;
  private xPos: string;
  private yPos: string;
  private idTree: string[];
  private dispatch: React.Dispatch<any>;
  private jsonTree: any;

  public static getInstance = () => {
    if (TreeForJsonModel.instance == null)
      TreeForJsonModel.instance = new TreeForJsonModel()
    return TreeForJsonModel.instance
  }

  constructor () {
    this.showMenu = false;
    this.expandedNodes = [];
    this.selectedNodes = [];
    this.xPos = "0px";
    this.yPos = "0px";
    this.idTree = [];
    this.dispatch = () => null;
  }

  public init = (dispatch: React.Dispatch<any>) => {
    this.dispatch = dispatch;
    this.dispatch({
      type: "INIT",
      jsonTree: this.jsonTree,
      showMenu: this.showMenu,
      expandedNodes: this.expandedNodes,
      selectedNodes: this.selectedNodes,
      xPos: this.xPos,
      yPos: this.yPos,
      idTree: [...this.idTree]
    })
  }
  // constructor (initialState: TreeModelType, dispatch: React.Dispatch<any>) {
  //   this.showMenu = initialState.showMenu;
  //   this.xPos = initialState.xPos;
  //   this.yPos = initialState.yPos;
  //   this.idTree = initialState.idTree;
  //   this.jsonTree = {};
  //   this.dispatch = dispatch;
  // }

  /*
    handleContextMenu: define a posição e o nó do menu de contexto e mostra ele na tela;
  */
  public handleContextMenu = (e: any, key: string, /*selectedNodesProcessed: string[]*/) => {
    e.preventDefault();

    if (this.idTree.length !== 0) return;

    //comparar com selectedNodes
    // if (selectedNodesProcessed.includes(key)) {
    //   this.idTree.push(...selectedNodesProcessed)
    // } else {
    //   this.idTree.push(key)
    // }
    
    this.idTree.push(key)

    this.showMenu = true;
    this.xPos = `${e.clientX}px`;
    this.yPos = `${e.clientY}px`;
    this.dispatch({
      type: "OPEN_CONTEXTMENU",
      idTree: [...this.idTree],
      xPos: this.xPos,
      yPos: this.yPos
    })
  }

  /*
    handleClick: se o menu estiver visível, a função o faz desaparecer e idTree é reinicializado;
  */
  public handleClick = () => {
    if (this.showMenu || this.idTree.length !== 0) {
      this.showMenu = false;
      this.idTree = [];
      this.dispatch({
        type: "CLOSE_CONTEXTMENU"
      })
    }
  }

  public setJsonTree = (jsonTree: any) => {
    this.jsonTree = jsonTree

    this.dispatch({
      type: "UPDATE_JSONTREE",
      value: this.jsonTree
    })
  }

  public setExpandedNodes = (nodeIds: string[]) => {
    this.expandedNodes = nodeIds;
    this.dispatch({
      type: "UPDATE_EXPANDEDNODES",
      expandedNodes: [...this.expandedNodes]
    })
  }

  public setSelectedNodes = (nodeIds: string[]) => {
    this.selectedNodes = nodeIds;
    this.dispatch({
      type: "UPDATE_SELECTEDNODES",
      SelectedNodes: [...this.selectedNodes]
    })
  }
}

export default TreeForJsonModel;

