import React from "react";
import TreeModelType from "../../@types/TreeModelType";
import IDataTree from "../../interfaces/IDataTree";

class TreeNodeInfoModel {
  /*
    showMenu -> Váriavel booleana que indica se o menu de contexto está sendo visualizado;
    xPos -> Posição x do menu de contexto;
    yPos -> Posição y do menu de contexto;
    idTree -> Índice do nó da arvore que está sendo analisado pelo menu de contexto;
  */
  private static instance: TreeNodeInfoModel;
  private data: IDataTree | undefined;
  private expandedNodes: string[];
  private selectedNodes: string[];
  private showMenu: boolean;
  private xPos: string;
  private yPos: string;
  private idTree: string[];
  private dispatch: React.Dispatch<any>;

  public static getInstance = () => {
    if (TreeNodeInfoModel.instance == null)
      TreeNodeInfoModel.instance = new TreeNodeInfoModel()
    return TreeNodeInfoModel.instance
  }

  constructor () {
    console.log("oi")
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
      data: this.data,
      showMenu: this.showMenu,
      expandedNodes: this.expandedNodes,
      selectedNodes: this.selectedNodes,
      xPos: this.xPos,
      yPos: this.yPos,
      idTree: [...this.idTree]
    })
  }

  public setData = (data: IDataTree) => {
    this.data = data;
    this.dispatch({
      type: "UPDATE_DATA",
      value: data
    })
  }

  /*
    handleContextMenu: define a posição e o nó do menu de contexto e mostra ele na tela;
  */
  public handleContextMenu = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, key: string) => {
    e.preventDefault();

    if (this.idTree.length !== 0) return;

    //comparar com selectedNodes
    // if (selectedNodesProcessed.map(item => item[0]).includes(key)) {
    //   this.idTree.push(...selectedNodesProcessed)
    // } else {
    // let list = [key];
    // while (key !== "0") {
    //   key = key.length === 1? "0" : key.slice(0,-1);
    //   list.push(key);
    // }
    this.idTree.push(key)
    // }
    
    console.log(e.screenX)
    console.log(e.screenY)

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

export default TreeNodeInfoModel;

