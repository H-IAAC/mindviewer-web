import IdeasViewProps from '../../@types/IdeasViewProps';
import styles from './styles.module.css';
import IdeasHistory from '../IdeasHistory';
import IdeasHistoryProps from '../../@types/IdeasHistoryProps';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import stylesheet from './stylesheet';
import cytoscapeLayout from './cytoscapeLayout';

cytoscape.use(dagre);

const IdeasView = (props: IdeasViewProps) => {
  const {
    lastIndex,
    indexBeenDisplayed,
    time,
    nodeData,
    nodeJsonData,
    pathList,
    numberOfElements,
    setupOption
  } = props.nodeInfoState
  const {
    handleIdTree,
    handleZoomIn,
    handleZoomOut,
    handleShowInfo,
    handleSaveImage,
    handleFullScreen,
    handleResetLayout,
    handleClose,
    handleUserIndex,
    cyRef,
    jsonElements,
    isLoading,
    showInfo,
    isLoadingData,
    indexToDisplay
  } = props

  const ideasHistoryProps: IdeasHistoryProps = {
    index: (isLoadingData) ? indexBeenDisplayed : lastIndex,
    time,
    numberOfElements,
    isLoadingData,
    fromFile: (setupOption == 1) ? true : false,
    currentTime: Date.now(),
    indexToDisplay: indexBeenDisplayed,
    handleUserIndex
  }

  const nodeDataAux = nodeJsonData ? nodeJsonData : nodeData;

  const cyElements : any =  {
    nodes: Array.from(jsonElements.nodes.values()),
    edges: Array.from(jsonElements.edges.values())
  };

  if (nodeDataAux)
    return(
      <>
        <div className={styles.container}>
          <div className={styles.background}></div>
          <div className={styles.modal} id='ideasModal'>
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
                onClick={handleClose}
              >
                X
              </button>
            </div>

            <div className={styles.body} id='body'>
              <div className={styles.bodyLeft}>
                <div>
                  <button onClick={handleFullScreen}>&#x26F6;</button>
                </div>
                <div>
                  <button onClick={handleZoomIn}>&#x002B;</button>
                <div>
                </div>
                  <button onClick={handleZoomOut}>&#x002D;</button>
                </div>
                <div>
                  <p>{indexBeenDisplayed}</p>
                </div>
                <div>
                  <p>{indexToDisplay}</p>
                </div>
                <div>
                  <p>{lastIndex}</p>
                </div>
              </div>
              <div className={styles.bodyRight}>
              <button onClick={handleResetLayout}>Reset</button>
                {showInfo ? <button onClick={handleShowInfo}><b>Show Info</b></button>
                          : <button onClick={handleShowInfo}>Show Info</button>
                }
                <button onClick={handleSaveImage}>Save PNG</button>
              </div>

              { isLoading && <div className="App">Loading...</div> }
              { cyElements.nodes.length === 0 && <div className="App">There is no idea to display.</div> }
              { !isLoading && <CytoscapeComponent
                  cy={(cy) => (cyRef.current = cy)}
                  stylesheet={stylesheet}
                  elements={CytoscapeComponent.normalizeElements(cyElements)}
                  layout={cytoscapeLayout}
                  style={{ width: "auto", height: "-webkit-fill-available" }}
                  userZoomingEnabled={true}
                  wheelSensitivity={0.05}
                  maxZoom={1.3}
                />
              }
              <div className={styles.tippys} id='tippys'></div>

              { cyElements.nodes.length > 0 &&
                <IdeasHistory
                  {...ideasHistoryProps}
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