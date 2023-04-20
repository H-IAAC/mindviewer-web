import IdeasViewProps from '../../@types/IdeasViewProps';
import styles from './styles.module.css';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";

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
    selector: '.Azure',
    style: {
      'background-color': 'Azure'
    }
  },
  {
    selector: '.DarkSeaGreen',
    style: {
      'background-color': 'DarkSeaGreen'
    }
  },
  {
    selector: '.WhiteSmoke',
    style: {
      'background-color': 'WhiteSmoke'
    }
  },
  {
    selector: '.Green',
    style: {
      'background-color': '#cfe2cf'
    }
  },
  {
    selector: '.Plum',
    style: {
      'background-color': 'Plum'
    }
  },
  {
    selector: '.Red',
    style: {
      'background-color': '#ff6666'
    }
  },
  {
    selector: '.RoyalBlue',
    style: {
      'background-color': 'RoyalBlue'
    }
  },
  {
    selector: '.SkyBlue',
    style: {
      'background-color': '#d3edf8'
    }
  },
  {
    selector: '.Tan',
    style: {
      'background-color': 'Tan'
    }
  },
  {
    selector: '.BurlyWood',
    style: {
      'background-color': 'BurlyWood'
    }
  },
  {
    selector: '.Wheat',
    style: {
      'background-color': 'Wheat'
    }
  },
  {
    selector: '.LightSkyBlue',
    style: {
      'background-color': 'LightSkyBlue'
    }
  },
  {
    selector: '.DodgerBlue',
    style: {
      'background-color': 'DodgerBlue'
    }
  },
  {
    selector: '.CornflowerBlue',
    style: {
      'background-color': 'CornflowerBlue'
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