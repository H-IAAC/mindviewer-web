import IdeasViewProps from '../../@types/IdeasViewProps';
import styles from './styles.module.css';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import iconType0 from '../../assets/ideas/0.png';
import iconType1 from '../../assets/ideas/1.png';
import iconType2 from '../../assets/ideas/2.png';
import iconType3 from '../../assets/ideas/3.png';
import iconType4 from '../../assets/ideas/4.png';
import iconType5 from '../../assets/ideas/5.png';
import iconType6 from '../../assets/ideas/6.png';
import iconType7 from '../../assets/ideas/7.png';
import iconType8 from '../../assets/ideas/8.png';
import iconType9 from '../../assets/ideas/9.png';
import iconType10 from '../../assets/ideas/10.png';
import iconType11 from '../../assets/ideas/11.png';
import iconType12 from '../../assets/ideas/12.png';
import iconType13 from '../../assets/ideas/13.png';
import iconType14 from '../../assets/ideas/14.png';
import iconType15 from '../../assets/ideas/15.png';
import iconType16 from '../../assets/ideas/16.png';
import iconType17 from '../../assets/ideas/17.png';

cytoscape.use(dagre);

const stylesheet: cytoscape.Stylesheet[] = [
  {
    selector: "node",
    style: {
      label: "data(id)",
      height: "100",
      width: "100",
      "text-valign": "center",
      "text-halign": "center",
      "background-color": "LightGray",
      "border-color": "black",
      "border-width": 2
    }
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "target-arrow-shape": "triangle",
      "line-color": "green",
      "target-arrow-color": "green",
      "curve-style": "bezier"
    }
  },
  {
    selector: '.ellipse',
    style: {
        shape: 'ellipse'
    }
  },
  {
    selector: '.ellipse-double',
    style: {
        shape: 'ellipse',
        "border-color": "black",
        "border-width": 10,
        "border-style": 'double'
    }
  },
  {
    selector: '.type0',
    style: {
      'background-color': 'Azure',
      'background-image': iconType0,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type1',
    style: {
      'background-color': 'DarkSeaGreen',
      'background-image': iconType1,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type2',
    style: {
      'background-color': 'DarkSeaGreen',
      'background-image': iconType2,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type3',
    style: {
      'background-color': 'WhiteSmoke',
      'background-image': iconType3,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type4',
    style: {
      'background-color': '#cfe2cf',
      'background-image': iconType4,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type5',
    style: {
      'background-color': 'Plum',
      'background-image': iconType5,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type6',
    style: {
      'background-color': '#ff6666',
      'background-image': iconType6,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type7',
    style: {
      'background-color': '#acc1fe',
      'background-image': iconType7,
      'background-width': '35%',
      'background-height': '35%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type8',
    style: {
      'background-color': '#d3edf8',
      'background-image': iconType8,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type9',
    style: {
      'background-color': 'Tan',
      'background-image': iconType9,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type10',
    style: {
      'background-color': 'BurlyWood',
      'background-image': iconType10,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type11',
    style: {
      'background-color': 'Wheat',
      'background-image': iconType11,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type12',
    style: {
      'background-color': 'LightSkyBlue',
      'background-image': iconType12,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type13',
    style: {
      'background-color': 'DodgerBlue',
      'background-image': iconType13,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'      
    }
  },
  {
    selector: '.type14',
    style: {
      'background-color': 'CornflowerBlue',
      'background-image': iconType14,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type15',
    style: {
      'background-color': 'CornflowerBlue',
      'background-image': iconType15,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type16',
    style: {
      'background-color': 'DarkSeaGreen',
      'background-image': iconType16,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  },
  {
    selector: '.type17',
    style: {
      'background-color': 'Wheat',
      'background-image': iconType17,
      'background-width': '40%',
      'background-height': '40%',
      'background-position-y': '90%'
    }
  }
];

const IdeasView = (props: IdeasViewProps) => {
  const {
    handleCloseNodeInfoModal,
  } = props.nodeInfoProps;
  const {
    nodeData,
    nodeJsonData,
    pathList
  } = props.nodeInfoState
  const {
    handleIdTree,
    cyRef,
    elements,
    isLoading,
  } = props

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
              
              { isLoading && <div className="App">Loading...</div> }
              { elements.nodes.length == 0 && <div className="App">There is no idea to display.</div> }
              { !isLoading && <CytoscapeComponent
                  cy={(cy) => (cyRef.current = cy)}
                  stylesheet={stylesheet}
                  elements={CytoscapeComponent.normalizeElements(elements)}
                  layout={{ name: "dagre"}}
                  style={{ width: "auto", height: "-webkit-fill-available" }}
                />
              }
            </div>
          </div>
        </div>
      </>
    )

  return(null);
}

export default IdeasView;