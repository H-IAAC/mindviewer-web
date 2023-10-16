import { useEffect, useState } from 'react';
import NodeInfoViewProps from '../../@types/NodeInfoViewProps';
import IDataTree from '../../interfaces/IDataTree';
import InputTimeModal from '../InputTimeModal';
import styles from './styles.module.css';

import JSONTree from 'react-json-tree';
import TreeNodeInfo from '../TreeNodeInfo';
import TreeForJson from '../TreeForJson';

// const json = {
//   number: 10,
//   array: [1,2,3,4,5,6,7],
//   objeto: {
//     nome: "Maria",
//     idade: 20
//   }
// }

type JsonData = {
  id: string,
  icon: string,
  time: Date,
  label: string,
  info: any,
  hasChildren: boolean,
  type: string
}

const theme = {
  scheme: 'brewer',
  author: 'timothée poisot (http://github.com/tpoisot)',
  base00: '#0c0d0e',
  base01: '#2e2f30',
  base02: '#515253',
  base03: '#737475',
  base04: '#959697',
  base05: '#b7b8b9',
  base06: '#dadbdc',
  base07: '#fcfdfe',
  base08: '#e31a1c',
  base09: '#e6550d',
  base0A: '#dca060',
  base0B: '#31a354',
  base0C: '#80b1d3',
  base0D: '#3182bd',
  base0E: '#756bb1',
  base0F: '#b15928'
}

const NodeInfoView = (props: NodeInfoViewProps) => {
  const {
    handleCloseNodeInfoModal,
  } = props.nodeInfoProps;
  const {
    nodeDataType,
    nodeData,
    nodeJsonData,
    pathList,
    index,
    time,
    inputTimeModal
  } = props.nodeInfoState
  const {
    handleIdTree,
    handleAddChart,
    handleInputTimeModal,
    handleInputTime
  } = props

  const RenderData = ({ data }: {data: IDataTree | JsonData}) => {
    //console.log(data)
    if (data.type === "root") {
      return(
        <TreeNodeInfo
          data={data as IDataTree}  
          handleIdTree={handleIdTree}         
        />
      )
    }

    if (data.type === "memory") {
      const dataAux = data as IDataTree;
      //if (dataAux.values) console.log(dataAux.values[index]);
      if (dataAux.children) {
        return(
          <TreeNodeInfo
            data={dataAux}
            handleIdTree={handleIdTree}          
          /> 
        )
      }

      if (dataAux.values) {
        return(
          <div>
            <div>
              <h1>Evaluation:</h1>
              <p>{dataAux.values[index].evaluation}</p>
            </div>
            <div style={{marginTop: "10px"}}>
              <h1>Info:</h1>
              {
                (nodeDataType==="Number" ||
                 nodeDataType==="String" ||
                 nodeDataType==="Bool")
                ?
                  <p>
                    {dataAux.values[index].y}
                  </p>
                : 
                  (nodeDataType === "Json")
                ?
                  <TreeForJson
                    jsonTree={dataAux.values[index].y}
                    handleIdTree={handleIdTree}
                  />
                :
                  <JSONTree
                    data={dataAux.values[index].y}
                    hideRoot={true}
                    theme={{
                      extend: theme,
                      tree: {
                        backgroundColor: "#fcfdfd"
                      }
                    }}
                  />
              }
            </div>
          </div>
        )
      }
    }

    if (data.type === "codelet") {
      const dataAux = data as IDataTree;
      if (dataAux.values) {
        return(
          <div>
            <div>
              <h1>Activation:</h1>
              <p>{dataAux.values[index].y.toFixed(3)}</p>
            </div>
            <div style={{marginTop: "10px"}}>
              <h1>Memories:</h1>
              {dataAux.children
                ?
                  <TreeNodeInfo
                    data={dataAux} 
                    handleIdTree={handleIdTree}         
                  />
                : 
                  <p>
                    Não há memórias!
                  </p>
              }
            </div>
          </div>
        )
      }
    }

    if (data.type === "jsonData") {
      const dataAux = data as JsonData;

      return(
        <TreeForJson
          jsonTree={dataAux}
          handleIdTree={handleIdTree}
        />
      )
    }
    
    return(<></>)
  }

  const nodeDataAux = nodeJsonData ? nodeJsonData : nodeData;

  if (nodeDataAux)
    return(
      <>
        <div className={styles.container}>
          <div className={styles.background}></div>
          <div className={styles.modal}>
            <div className={styles.header}>
              <div className={styles.path}>
                {
                  pathList.map((item, index) => (
                    <div key={index}>
                      <button
                        onClick={() => handleIdTree(item.idTree)}
                      >
                        {item.name}
                      </button>
                      <p>
                        {`>`}
                      </p>
                    </div>
                  ))
                }
              </div>
              <button 
                className={styles.closeButton}
                onClick={handleCloseNodeInfoModal}
              >
                X
              </button>
            </div>
            <div className={styles.body}>
              {time !== "" &&
                <div className={styles.bodyTop}>
                  {nodeDataAux.type === "memory" &&
                    <div className={styles.type}>
                      <p>
                        Tipo: {nodeDataType}
                      </p>
                    </div>
                  }
                  <div className={styles.time} onClick={() => handleInputTimeModal(true)}>
                    <p>
                      {time}
                    </p>
                  </div>
                </div>
              }
              <div className={styles.bodyBottom}>
                <div className={styles.data}>
                  <RenderData
                    data={nodeDataAux}
                  />
                </div>
                <button 
                  className={styles.moreButton}
                  onClick={handleAddChart}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        {inputTimeModal &&
          <InputTimeModal
            time={time.replace("Tempo: ","")}
            handleInputTimeModal={handleInputTimeModal}
            handleInputTime={handleInputTime}
          />
        }
      </>
    )

  return(null);
}

export default NodeInfoView;