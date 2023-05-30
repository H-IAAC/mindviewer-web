import IdeasViewProps from '../../@types/IdeasViewProps';
import styles from './styles.module.css';
import CytoscapeComponent from 'react-cytoscapejs';
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import stylesheet from './stylesheet';

cytoscape.use(dagre);

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
    handleZoomIn,
    handleZoomOut,
    handleShowInfo,
    handleSaveAsPng,
    cyRef,
    elements,
    isLoading,
    zoom
  } = props

  const nodeDataAux = nodeJsonData ? nodeJsonData : nodeData;

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
                onClick={handleCloseNodeInfoModal}
              >
                X
              </button>
            </div>


            <div className={styles.body} id='body'>
              <div className={styles.buttons}>
                <button onClick={handleZoomIn}>Zoom in</button>
                <button onClick={handleZoomOut}>Zoom out</button>
                <button onClick={handleShowInfo}>Show Info</button>
                <button onClick={handleSaveAsPng}>Save PNG</button>
              </div>
              
              { isLoading && <div className="App">Loading...</div> }
              { elements.nodes.length == 0 && <div className="App">There is no idea to display.</div> }
              { !isLoading && <CytoscapeComponent
                  cy={(cy) => (cyRef.current = cy)}
                  stylesheet={stylesheet}
                  elements={CytoscapeComponent.normalizeElements(elements)}
                  layout={{ name: "dagre"}}
                  style={{ width: "auto", height: "-webkit-fill-available" }}
                  zoomingEnabled={true}
                  wheelSensitivity={0.05}
                  zoom={zoom}
                />
              }
              <div className={styles.tippys} id='tippys'></div>
            </div>
          </div>
        </div>
      </>
    )

  return(null);
}

export default IdeasView;