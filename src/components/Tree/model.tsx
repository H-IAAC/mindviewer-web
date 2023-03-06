import TreeModelType from "../../@types/TreeModelType";

class TreeModel {
  /*
    showMenu -> Váriavel booleana que indica se o menu de contexto está sendo visualizado;
    xPos -> Posição x do menu de contexto;
    yPos -> Posição y do menu de contexto;
    idTree -> Índice do nó da arvore que está sendo analisado pelo menu de contexto;
  */
  private showMenu: boolean;
  private xPos: string;
  private yPos: string;
  private idTree: string[];
  private dispatch: React.Dispatch<any>;

  constructor (initialState: TreeModelType, dispatch: React.Dispatch<any>) {
    this.showMenu = initialState.showMenu;
    this.xPos = initialState.xPos;
    this.yPos = initialState.yPos;
    this.idTree = initialState.idTree;
    this.dispatch = dispatch;
  }

  /*
    handleContextMenu: define a posição e o nó do menu de contexto e mostra ele na tela;
  */
  public handleContextMenu = (e: any, key: string, selectedNodesProcessed: string[]) => {
    e.preventDefault();

    if (this.idTree.length !== 0) return;

    //comparar com selectedNodes
    if (selectedNodesProcessed.includes(key)) {
      this.idTree.push(...selectedNodesProcessed)
    } else {
      this.idTree.push(key)
    }
    
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
}

export default TreeModel;

