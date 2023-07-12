import JsonData from "../../@types/JsonDataType";
import IDataTree from "../../interfaces/IDataTree";

class IdeasInfoModel {
  private static instance: IdeasInfoModel;

  private pathList: any[];
  private nodeData: IDataTree | undefined;
  private nodeJsonData: JsonData | undefined;
  private idTree: string;
  private time: string;
  private index: number;
  private dispatch: React.Dispatch<any>;

  public static getInstance = () => {
    if (IdeasInfoModel.instance == null)
      IdeasInfoModel.instance = new IdeasInfoModel()
    return IdeasInfoModel.instance
  }

  constructor () {
    this.pathList = [];
    this.nodeData = undefined;
    this.idTree = "";
    this.time = "";
    this.index = -1;
    this.dispatch = ()=>null;
  }

  public init = (dispatch: React.Dispatch<any>) => {
    this.dispatch = dispatch;
  }

  public handleNewInfo = (idTree: string, data: IDataTree[], tabActive: number) => {
    this.idTree = idTree;
    this.nodeJsonData = undefined;
    let idTreeAux = idTree.split("-").reverse();
    let nodeInfoListAux = [];

    let id;
    let requiredData: IDataTree = data[tabActive];
    let requiredJsonData: JsonData | undefined;
    let idCompare = "";
    let hasJsonTree = false;

    //console.log(JSON.stringify(data));

    nodeInfoListAux.push({
      name: requiredData.name.includes(":")? requiredData.name.slice(0,requiredData.name.indexOf(":")): requiredData.name,
      idTree: requiredData.id
    }) 
  
    while (idTreeAux.length !== 0) {
      id = idTreeAux.pop();
      if (id) {
        if (id === "i") {
          idCompare = idCompare !== "" ? idCompare+"-"+id : id;
          if (requiredData.values) requiredJsonData = requiredData.values[this.index === -1? requiredData.values.length-1 : this.index].y;
          nodeInfoListAux.push({
            name: "I",
            idTree: requiredJsonData?.id
          })
          hasJsonTree = true;
          break;
        }

        idCompare = idCompare !== "" ? idCompare+"-"+id : id;
      }

      if (requiredData.children) {
        for (let i = 0; i < requiredData.children.length; i++) {
          if (requiredData.children[i].id === idCompare) {
            requiredData = requiredData.children[i];
            
            nodeInfoListAux.push({
              name: requiredData.name.includes(":")? requiredData.name.slice(0,requiredData.name.indexOf(":")): requiredData.name,
              idTree: requiredData.id
            })
            break;
          }
        }
      }
    }

    if (hasJsonTree) {
      while (idTreeAux.length !== 0) {
        id = idTreeAux.pop();
        if (id) idCompare = idCompare !== "" ? idCompare+"-"+id : id;

        if (requiredJsonData)
          for (let i = 0; i < requiredJsonData.info.length; i++) {
            if (requiredJsonData.info[i].id === idCompare) {
              requiredJsonData = requiredJsonData.info[i];
              
              requiredJsonData && nodeInfoListAux.push({
                name: requiredJsonData.label,
                idTree: requiredJsonData.id
              })
              break;
            }
          }
      }
    }

    this.pathList = [...nodeInfoListAux];
    this.nodeData = requiredData;
    this.nodeJsonData = requiredJsonData;

    const nodeDataType = this.getType(this.nodeJsonData ? this.nodeJsonData : this.nodeData);

    if (requiredData.values) {
      //console.log('index: ' + (requiredData.values!!.length-1));
      this.index = requiredData.values!!.length-1;
      const timeAux = (requiredData.values[this.index].x as Date).getTime();
      this.time = `${new Date(timeAux).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}`;
    }

    this.dispatch({
      type: "UPDATE_INFO",
      pathList: this.pathList,
      nodeData: this.nodeData,
      nodeJsonData: this.nodeJsonData,
      nodeDataType: nodeDataType,
      index: this.index,
      time: this.time,
      numberOfElements: 0
    })
  }

  public getType = (data: any): string => {
    //console.log(data)
    if (data) {
      let dataAux;
      if (data.type === "jsonData") {
        return "Json";
      } else if (data.type === "root" || !(data as IDataTree).values) {
        return "Undefined";
      }
      else {
        dataAux = (data as IDataTree).values;
        if (dataAux) dataAux = dataAux[0].y
      }

      if (typeof dataAux === "string") {
        return "String";
      }
  
      if (typeof dataAux === "number") {
        return "Number";
      }
  
      if (typeof dataAux === "boolean") {
        return "Bool";
      }
  
      // if (typeof dataAux === "undefined") {
      //   return "Undefined";
      // }
  
      if (dataAux[0] !== undefined) {
        if (dataAux[0][0] !== undefined) {
          const aux = parseFloat(dataAux[0][0]);
          if (isNaN(aux))
            return "Json";
          return "Matrix";
        }
  
        const aux = parseFloat(dataAux[0]);
        console.log(aux);
        if (isNaN(aux))
          return "Json";
        return "Array";
      }
    }

    return "Json"
  }

  public getIdTree = () => this.idTree;

  public reset = () => {
    this.time = "";
    this.index = -1;
  }
}

export default IdeasInfoModel