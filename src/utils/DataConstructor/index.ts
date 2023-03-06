import IDataTree from '../../interfaces/IDataTree';
import { ICodeletProperties, IMemoryProperties, IMindProperties } from '../../interfaces/IMindProperties';

import moIcon from '../../assets/mo.png';
import mindIcon from '../../assets/mind.png';
import moContainerIcon from '../../assets/container.png';
import codeletIcon from '../../assets/codelet.png';
import inputIcon from '../../assets/input.png';
import outputIcon from '../../assets/output.png';
import broadcastIcon from '../../assets/broadcast.png';

const getType = (data: any): string => {
  const dataAux = data;

  if (typeof dataAux === "string") {
    return "String";
  }

  if (typeof dataAux === "number") {
    return "Number";
  }

  if (typeof dataAux === "boolean") {
    return "Bool";
  }

  if (dataAux[0] !== undefined) {
    if (dataAux[0][0] !== undefined) {
      const aux = parseFloat(dataAux[0][0]);
      if (isNaN(aux))
        return "Object";
      return "Matrix";
    }

    const aux = parseFloat(dataAux[0]);
    if (isNaN(aux))
      return "Object";
    return "Array";
  }

  return "Object"
}

const getType2 = (data: any): string => {
  const dataAux = data;

  if (typeof dataAux === "string") {
    return "String";
  }

  if (typeof dataAux === "number") {
    return "Number";
  }

  if (typeof dataAux === "boolean") {
    return "Bool";
  }

  // if (dataAux[0] !== undefined) {
  //   if (dataAux[0][0] !== undefined) {
  //     const aux = parseFloat(dataAux[0][0]);
  //     if (isNaN(aux))
  //       return "Object";
  //     return "Matrix";
  //   }

  //   const aux = parseFloat(dataAux[0]);
  //   if (isNaN(aux))
  //     return "Object";
  //   return "Array";
  // }

  return "Object"
}

class DataConstructor {

  public constructJsonTree = (jsonData: any, time: Date, id = "") => {
    let jsonTree: any[] = [];
    let counterId = 1;
    let isObject = getType2(jsonData) === "Object";

    if (jsonData === undefined || !isObject)
      return [jsonData, false]

    const isArray = Array.isArray(jsonData);

    if (isArray) {
      jsonData.forEach((item: any, index: number) => {
        let newId = id !== "" ? id+"-"+counterId.toString() : counterId.toString();

        const [info, hasChildren] = this.constructJsonTree(item, time, newId);

        jsonTree.push({
          id: newId,
          type: "jsonData",
          icon: "",
          time: time,
          label: index,
          labelForTree: hasChildren? index.toString() : `${index}: ${info}`,
          info,
          hasChildren
        })

        counterId++;
      })
    } else {
      for (let key in jsonData) {
        let newId = id !== "" ? id+"-"+counterId.toString() : counterId.toString();

        const [info, hasChildren] = this.constructJsonTree(jsonData[key], time, newId);

        jsonTree.push({
          id: newId,
          type: "jsonData",
          icon: "",
          time: time,
          label: key,
          labelForTree: hasChildren? key : `${key}: ${info}`,
          info,
          hasChildren
        })

        counterId++;
      }
    }
    return [jsonTree, true];
  }

  /*
    constructMemoryTree: constrói a estrutura da árvore de memórias
  */
  public constructMemoryTree = (memoryData: IMemoryProperties[] | undefined, id="") => {
    let counterId = 1;

    let children: IMemoryProperties[] | undefined;
    let name: string;
    let icon: string;
    let valueX: Date | number | undefined;
    let valueY: any;
    let memoryJson: Array<IDataTree> = [];

    if (memoryData === undefined || memoryData.length === 0) return undefined;

    memoryData.forEach((memory) => {
      let newId = id !== "" ? id+"-"+counterId.toString() : counterId.toString();
      //Se a memória for um container, a função realizará uma chamada recursiva para resolver os dados dos filhos
      if (memory.memories.length !== 0) {
        children = memory.memories;
        name = memory.name;
        icon = moContainerIcon;
        valueX = undefined; 
        valueY = undefined;
      } else {
        children = undefined;
        icon = moIcon;
        try {
          name = memory.name+": "+memory.I?.toFixed(3)+" ("+memory.evaluation?.toFixed(3)+")";
        } catch (error) {
          name = memory.name
        }
        //valueX = memory.timestamp-initialTime;
        valueX = new Date(memory.timestamp);
        valueY = memory.I;

        if (getType(valueY) === "Object") {
          const [info, hasChildren] = this.constructJsonTree(valueY, valueX, newId+"-i");

          valueY = {
            id: newId+"-i",
            type: "jsonData",
            icon: "",
            time: valueX,
            label: "info",
            labelForTree: "info",
            info,
            hasChildren
          }
        }
      }

      if (memory.type) {
        if (memory.type == 'input') {
          icon = inputIcon;
        }
        else if (memory.type == 'output') {
          icon = outputIcon;
        }
        else if (memory.type == 'broadcast') {
          icon = broadcastIcon;
        }
      }

      memoryJson.push({
        id: newId,
        type: 'memory',
        icon: icon,
        name: name,
        labelChart: memory.name,
        values: (valueX !== undefined && valueY !== undefined)? [{
          x: valueX,
          y: valueY,
          evaluation: memory.evaluation
        }] : undefined,
        children: this.constructMemoryTree(children, newId) //Chamada recursiva
      })

      counterId++;
    })

    return (memoryJson);
  }

  /*
    updateMemoryTree: atualiza os nomes e os valores da árvore de memórias
  */
  public updateMemoryTree = (data_aux: IDataTree[] | undefined, json: any) => {
    if (data_aux === undefined || data_aux.length === 0) return undefined;

    for (let i = 0; i < data_aux.length; i++) {
      try {
        data_aux[i].name = json[i].name+": "+json[i].I?.toFixed(3)+" ("+json[i].evaluation?.toFixed(3)+")";
      } catch (error) {
        ;
      }
      
      let valueX = new Date(json[i].timestamp);
      let valueY = json[i].I;
      if (getType(valueY) === "Object") {
        const [info, hasChildren] = this.constructJsonTree(valueY, valueX, data_aux[i].id+"-i");

        valueY = {
          id: data_aux[i].id+"-i",
          type: "jsonData",
          icon: "",
          time: valueX,
          label: "info",
          labelForTree: "info",
          info,
          hasChildren
        }
      }

      data_aux[i].values?.push({
        x: valueX,
        y: valueY,
        evaluation: json[i].evaluation
      });

      //Se tem filhos, realiza uma chamada recursiva
      if (data_aux[i].children) {
        data_aux[i].children = this.updateMemoryTree(data_aux[i].children, json[i].memories);
      }
    }

    return data_aux;
  }

  /*
    constructCodeletTree: constrói a estrutura da árvore de codelets
  */
  public constructCodeletTree = (codeletData: ICodeletProperties[] | undefined, id="") => {
    let counterId = 1;

    let children: IMemoryProperties[] | undefined;
    let inputMemories: IMemoryProperties[] = [];
    let outputMemories: IMemoryProperties[] = [];
    let broadcastMemories: IMemoryProperties[] = [];
    let name: string;
    //let icon: string;
    let codeletJson: Array<IDataTree> = [];
    let labelChart: string;
    let valueX: Date | number | undefined;
    let valueY: number | undefined;

    if (codeletData === undefined || codeletData.length === 0) return undefined;

    codeletData.forEach((codelet) => {
      name = codelet.name+": "+codelet.activation.toFixed(3);
      labelChart = codelet.name;
      //valueX = codelet.timestamp-initialTime;
      valueX = new Date(codelet.timestamp);
      valueY = codelet.activation;
      
      //Se o codelet tiver inputs
      if (codelet.inputs.length !== 0) {
        codelet.inputs.forEach(memory => memory.type = 'input');
        inputMemories = codelet.inputs;
      } else {
        inputMemories = [];
      }

      //Se o codelet tiver outputs
      if (codelet.outputs.length !== 0) {
        codelet.outputs.forEach(memory => memory.type = 'output');
        outputMemories = codelet.outputs;
      } else {
        outputMemories = [];
      }

      //Se o codelet tiver broadcasts
      if (codelet.broadcast.length !== 0) {
        codelet.broadcast.forEach(memory => memory.type = 'broadcast');
        broadcastMemories = codelet.broadcast;
      } else {
        broadcastMemories = [];
      }

      //Concatenamos todas as possíveis memórias do codelet em um vetor
      if (inputMemories.length != 0 || outputMemories.length != 0 || broadcastMemories.length != 0) {
        let aux: Array<any> = [];
        children = aux.concat(inputMemories, outputMemories, broadcastMemories);
        //console.log(children);
      } else {
        children = undefined;
      }

      let newId = id !== "" ? id+"-"+counterId.toString() : counterId.toString();

      codeletJson.push({
        id: newId,
        type: 'codelet',
        icon: codeletIcon,
        name: name,
        labelChart: labelChart,
        values: (valueX !== undefined && valueY !== undefined)? [{
          x: valueX,
          y: valueY,
          evaluation: 0
        }] : undefined,
        children: this.constructMemoryTree(children, newId)   //Construimos a árvore para as memórias do codelet
      })

      counterId++;
    })

    return (codeletJson);
  }

  /*
    updateCodeletTree: atualiza os nomes, os valores e as memórias da árvore de codelets
  */
  public updateCodeletTree = (data_aux: IDataTree[] | undefined, json: any) => {
    if (data_aux === undefined || data_aux.length === 0) return undefined;

    for (let i = 0; i < data_aux.length; i++) {
      data_aux[i].name = json[i].name+": "+json[i].activation.toFixed(3);
      //data_aux[i].values?.push({x: json[i].timestamp-initialTime, y:json[i].activation});
      data_aux[i].values?.push({
        x: new Date(json[i].timestamp), 
        y:json[i].activation,
        evaluation: 0
      });

      if (data_aux[i].children) {
        let inputMemories: IMemoryProperties[] = [];
        let outputMemories: IMemoryProperties[] = [];
        let broadcastMemories: IMemoryProperties[] = [];

        if (json[i].inputs.length !== 0) {
          inputMemories = json[i].inputs;
        } 
        if (json[i].outputs.length !== 0) {
          outputMemories = json[i].outputs;
        } 
        if (json[i].broadcast.length !== 0) {
          broadcastMemories = json[i].broadcast;
        } 

        let aux: Array<any> = [];
        let childrenAux = aux.concat(inputMemories, outputMemories, broadcastMemories);

        data_aux[i].children = this.updateMemoryTree(data_aux[i].children, childrenAux);
      }
    }

    return data_aux;
  }

  public constructMemoryTreeFromJsonFile = (memoryData: any , type: string, id: string, currentIndex: number) => {
    let counterId = currentIndex;

    let children: IMemoryProperties[] | undefined;
    let name: string;
    let icon: string;
    let valueX: Date | number | undefined;
    let valueY: any;
    let labelChart: string;
    let valuesAux: Array<any> | undefined;
    let memoryJson: Array<IDataTree> = [];

    if (memoryData === undefined || memoryData.length === 0) return undefined;

    memoryData[0].forEach((memory:any, index: number) => {
      labelChart = memory.data.name;
      let newId = id !== "" ? id+"-"+counterId.toString() : counterId.toString();

      //Se a memória for um container, a função realizará uma chamada recursiva para resolver os dados dos filhos
      if (memory.type.includes("MemoryContainer")) {
        children = memoryData.map((item: any) => item[index].data.memories);
        name = memory.data.name;
        icon = moContainerIcon;
        valuesAux = undefined;
      } else {
        children = undefined;
        icon = moIcon;
        try {
          name = memory.data.name+": "+memoryData[memoryData.length-1][index].data.I?.toFixed(3)+" ("+memoryData[memoryData.length-1][index].data.evaluation?.toFixed(3)+")";
        } catch (error) {
          name = memory.data.name
        }
        //valueX = memory.timestamp-initialTime;
        // valueX = new Date(memory.timestamp);
        // valueY = memory.I;

        valuesAux = [];
        memoryData.forEach((memory: any) => {
          let valueX = new Date(memory[index].data.timestamp);
          let valueY = memory[index].data.I;
          if (getType(valueY) === "Object") {
            const [info, hasChildren] = this.constructJsonTree(valueY, valueX, newId+"-i");

            valueY = {
              id: newId+"-i",
              type: "jsonData",
              icon: "",
              time: valueX,
              label: "info",
              labelForTree: "info",
              info,
              hasChildren
            }
          }
          valuesAux?.push({
            x: valueX,
            y: valueY,
            evaluation: memory[index].data.evaluation
          })
        })
      }

      if (type !== 'default') {
        if (type === 'input') {
          icon = inputIcon;
        }
        else if (type === 'output') {
          icon = outputIcon;
        }
        else if (type === 'broadcast') {
          icon = broadcastIcon;
        }
      }

      memoryJson.push({
        id: newId,
        type: 'memory',
        icon: icon,
        name: name,
        labelChart: labelChart,
        values: valuesAux? [...valuesAux] : undefined,
        children: this.constructMemoryTreeFromJsonFile(children,"default", newId, 1) //Chamada recursiva
      })

      counterId++;
    })

    return (memoryJson);
  }

  /*
    constructCodeletTree: constrói a estrutura da árvore de codelets
  */
  public constructCodeletTreeFromJsonFile = (codeletData: any, id="") => {
    let children: IDataTree[] | undefined;
    let inputMemories: IDataTree[] | undefined = [];
    let outputMemories: IDataTree[]| undefined = [];
    let broadcastMemories: IDataTree[]| undefined = [];
    let name: string;
    //let icon: string;
    //let codeletJson: Array<IDataTree> = [];
    let labelChart: string;
    let valueX: Date | number | undefined;
    let valueY: number | undefined;

    if (codeletData === undefined || codeletData.length === 0) return undefined;

    name = codeletData[0].codeletName+": "+codeletData[codeletData.length-1].activation.toFixed(3);;
    labelChart = codeletData[0].codeletName;

    let valuesAux: Array<any> = [];
    codeletData.forEach((codelet: any) => {
      let time: string = codelet.time;
      const day = time.slice(3,5);
      const month = time.slice(0,2);
      time = time.replace(day,month).replace(month,day);

      valuesAux.push({
        x: new Date(time),
        y: codelet.activation,
        evaluation: 0
      })
    })

    let currentIndex=1;

    //Se o codelet tiver inputs
    if (codeletData[0].mInputs.length !== 0) {
      let mInputs = codeletData.map((codelet:any) => (codelet.mInputs));
      inputMemories = this.constructMemoryTreeFromJsonFile(mInputs,"input", id, currentIndex);
      currentIndex = currentIndex+codeletData[0].mInputs.length;
    } else {
      inputMemories = [];
    }

    //Se o codeletData tiver outputs
    if (codeletData[0].mOutputs.length !== 0) {
      let mOutputs = codeletData.map((codelet:any) => (codelet.mOutputs));
      outputMemories = this.constructMemoryTreeFromJsonFile(mOutputs,"output",id, currentIndex);
      currentIndex = currentIndex+codeletData[0].mOutputs.length;
    } else {
      outputMemories = [];
    }

    //Se o codeletData tiver broadcasts
    if (codeletData[0].mBroadcasts.length !== 0) {
      let mBroadcasts = codeletData.map((codelet:any) => (codelet.mBroadcasts));
      broadcastMemories = this.constructMemoryTreeFromJsonFile(mBroadcasts,"broadcast", id, currentIndex);
      currentIndex = currentIndex+codeletData[0].mBroadcasts.length;
    } else {
      broadcastMemories = [];
    }

    //Concatenamos todas as possíveis memórias do codeletData em um vetor
    if (inputMemories?.length != 0 || outputMemories?.length != 0 || broadcastMemories?.length != 0) {
      let aux: Array<any> = [];
      children = aux.concat(inputMemories, outputMemories, broadcastMemories);
      console.log(children);
    } else {
      children = undefined;
    }

    let codeletJson:IDataTree = {
      id: id,
      type: 'codelet',
      icon: codeletIcon,
      name: name,
      labelChart: labelChart,
      values: valuesAux.length!==0 ? [...valuesAux] : undefined,
      children: children  
    }

    return {codeletTreeAux: codeletJson, memoryTreeAux: children};
  }

  public initializeDataFromFiles = (files: Array<string>) => {
    let jsonList: JSON[] = [];

    //Leitura dos arquivos
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        let convertedJson = this.getJsonFromFile(file);
        jsonList.push(convertedJson)
      }
    }
    //console.log([...jsonList]);
    // //Conversão para tree
    
    let codeletTree: Array<IDataTree> = [];
    let memoryTree: Array<IDataTree> = [];
    let allMemories: Array<IDataTree> = [];

    if (jsonList.length !== 0) {
      jsonList.forEach((item, index) => {
        const treeAux = this.constructCodeletTreeFromJsonFile(item, (index+1).toString());

        if (treeAux) {
          const {codeletTreeAux, memoryTreeAux} = treeAux;
          console.log(codeletTreeAux);
          codeletTree.push(codeletTreeAux);
          if (memoryTreeAux) {
            allMemories.push(...memoryTreeAux)
          }
        }
        
      })

      let memoryNames: Array<string> = [];
      for (let i = 0; i < allMemories.length; i++) {
        const memory = {...allMemories[i]};
        if (!memoryNames.includes(memory.name)) {
          if (memory.children) {
            memory.icon = moContainerIcon
          } else {
            memory.icon = moIcon
          }

          memoryTree.push(memory);
          memoryNames.push(memory.name);
        }
      }

      memoryTree = memoryTree.sort((a,b) => {
        if (a.children) return 1;
        return -1;
      })
    }

    const data = [
      {
        id: '0',
        type: 'root',
        name: 'Memories',
        labelChart: 'Memories',
        icon: mindIcon,
        children: memoryTree
      },
      {
        id: '0',
        type: 'root',
        name: 'Codelets',
        labelChart: 'Codelets',
        icon: mindIcon,
        children: codeletTree
      }
    ]

    return data;
  }

  public getJsonFromFile = (file: string) => {
    let jsonString = atob(file.split(',')[1]);
    jsonString = jsonString.slice(0,-1)+"]";
    try {
      const convertedJson = JSON.parse(jsonString);
      return(convertedJson);
    } catch (error) {
      alert(error);
    }
  }

  public initializeDataFromJson = (json: IMindProperties) => {
    //Criação da tree
    const data = [
      {
        id: '0',
        type: 'root',
        name: 'Memories',
        labelChart: 'Memories',
        icon: mindIcon,
        children: this.constructMemoryGroups(json.memories)
      },
      {
        id: '0',
        type: 'root',
        name: 'Codelets',
        labelChart: 'Codelets',
        icon: mindIcon,
        children: this.constructCodeletGroups(json.codelets)
      }
    ]

    return data;
  }

  public updateDataFromJson = (json: IMindProperties, data: IDataTree[]) => {
    let memoryGroups: {[key: string]: IMemoryProperties[]} = {};
    let codeletGroups: {[key: string]: ICodeletProperties[]} = {};

    let memoryGroupNames: string[] = [];
    let codeletGroupNames: string[] = [];

    json.memories.forEach(memory => {
      const group = memory.group;
      if (group) {
        if (!memoryGroups[group]) {
          memoryGroups[group] = [];
          memoryGroupNames.push(group);
        }
        
        memoryGroups[group].push(memory);
      }
    })

    json.codelets.forEach(codelet => {
      const group = codelet.group;
      if (group) {
        if (!codeletGroups[group]) {
          codeletGroups[group] = [];
          codeletGroupNames.push(group);
        }
        
        codeletGroups[group].push(codelet);
      }
    })

    let memRoot = data[0].children ?? [];
    let codRoot = data[1].children ?? [];

    for (let i = 0; i < memRoot.length; i++) {
      memRoot[i].children = this.updateMemoryTree(memRoot[i].children, memoryGroups[memoryGroupNames[i]]);
    }

    for (let i = 0; i < codRoot.length; i++) {
      codRoot[i].children = this.updateCodeletTree(codRoot[i].children, codeletGroups[codeletGroupNames[i]]);
    }

    //data[0].children = this.updateMemoryTree(data[0].children, json.memories);
    //data[1].children = this.updateCodeletTree(data[1].children, json.codelets);
    data[0].children = memRoot;
    data[1].children = codRoot;
    
    return data;
  }

  public constructMemoryGroups = (memoryData: IMemoryProperties[]) => {
    let memoryGroups: {[key: string]: IMemoryProperties[]} = {};
    memoryData.forEach(memory => {
      const group = memory.group;
      if (group) {
        if (!memoryGroups[group]) {
          memoryGroups[group] = [];
        }
        
        memoryGroups[group].push(memory);
      }
    })

    let memoryGroupsList: IDataTree[] = [];
    for (let key in memoryGroups) {
      memoryGroupsList.push({
        id: key,
        type: "root",
        name: key,
        labelChart: key,
        icon: mindIcon,
        children: this.constructMemoryTree(memoryGroups[key], key),
      })
    }

    return memoryGroupsList;
  }

  public constructCodeletGroups = (codeletData: ICodeletProperties[]) => {
    let codeletGroups: {[key: string]: ICodeletProperties[]} = {};
    codeletData.forEach(codelet => {
      const group = codelet.group;
      if (group) {
        if (!codeletGroups[group]) {
          codeletGroups[group] = [];
        }
        
        codeletGroups[group].push(codelet);
      }
    })

    let codeletGroupsList: IDataTree[] = [];
    for (let key in codeletGroups) {
      codeletGroupsList.push({
        id: key,
        type: "root",
        name: key,
        labelChart: key,
        icon: mindIcon,
        children: this.constructCodeletTree(codeletGroups[key], key),
      })
    }

    return codeletGroupsList;
  }
}

export default DataConstructor;