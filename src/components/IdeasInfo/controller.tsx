import React, { useEffect, useState, useReducer } from "react";
import NodeInfoProps from "../../@types/NodeInfoProps";
import IdeasViewProps from "../../@types/IdeasViewProps";
import IdeasInfoModel from "./model";
import IdeasView from "./view";
import cytoscapeLayout from './cytoscapeLayout';
import CytoscapeElements from './cytoscapeElements';
import CytoscapePopper from './cytoscapePopper';
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import styles from './styles.module.css';
import getScreenshot from '../../utils/ScreenShot/getScreenshot';

cytoscape.use(popper);

const maxZoom = 1.3;
const minZoom = 0.2;
const cyElements = new CytoscapeElements();
const cyPopper = new CytoscapePopper();
const elemsGrabbed = new Set<string>();
let indexToDisplay: number = 0;
let isLoadingData: boolean = true;
elemsGrabbed.add('0');

const initialNodeInfoState = { 
  pathList: [],
  nodeData: undefined,
  nodeJsonData: undefined,
  nodeDataType: "Undefined",
  lastIndex: 0,
  indexBeenDisplayed: -1,
  numberOfElements: 0,
  setupOption: -1
};

const reducerNodeInfo = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_INFO':
      return { 
        ...state, 
        pathList: action.pathList,
        nodeData: action.nodeData,
        nodeJsonData: action.nodeJsonData,
        nodeDataType: action.nodeDataType,
        lastIndex: action.index,
        time: action.time,
        setupOption: action.setupOption
      };
    default:
      return state;
  }
}

function refreshGraphLayout(cyRef : any) {
  // Save pan and zoom values
  const pan = cyRef.current?.pan();
  const zoomLevel = (cyRef.current?.zoom() > maxZoom) ? maxZoom : cyRef.current?.zoom();

  // Lock all elements that were move by the user, so then they will
  // keep at same position after refresh.
  elemsGrabbed.forEach(id => {
    cyRef.current?.elements().$id(id).lock();
  });

  // Perform the refresh
  cyRef.current?.makeLayout(cytoscapeLayout).run();

  // Unlock all elements, so then user can move it again
  elemsGrabbed.forEach(id => {
    cyRef.current?.elements().$id(id).unlock();
  });

  // Restore pan and zoom values
  cyRef.current?.zoom(zoomLevel);
  cyRef.current?.pan(pan);

  //cyRef.current?.fit();
}

const IdeasInfoController = (props: NodeInfoProps) => {

  const [zoom, setZoom] = useState(0.55);
  const [fullScreen, setFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [elementsChanged, setElementsChanged] = useState(false);
  const [nodeInfoState, dispatch] = useReducer(reducerNodeInfo, initialNodeInfoState);
  const ideasModel = IdeasInfoModel.getInstance();

  const cyRef = React.useRef<cytoscape.Core | undefined>();

  const {
    idTree,
    tabActive
  } = props.treePanelState;

  const {
    mainPanelState,
  } = props.treePanelProps;

  const {
    handleCloseNodeInfoModal,
  } = props;

  const handleResetLayout = () => {
    elemsGrabbed.clear();
    refreshGraphLayout(cyRef);
  }

  const handleZoomIn = () => {
    const currentZoom = (cyRef?.current?.zoom()) ? cyRef?.current?.zoom() : 0;
    setZoom(currentZoom + 0.1);
  }

  const handleZoomOut = () => {
    const currentZoom = (cyRef?.current?.zoom()) ? cyRef?.current?.zoom() : 0;
    setZoom(currentZoom - 0.1);
  }

  const handleShowInfo = () => { (showInfo) ? setShowInfo(false) : setShowInfo(true); }

  const handleFullScreen = () => { (fullScreen) ? setFullscreen(false) : setFullscreen(true); }

  const handleSaveImage = async () => { getScreenshot('body', 'ideas_screenshot'); }

  const handleClose = () => {
    cyElements.clear();
    handleCloseNodeInfoModal();
  }

  const handleUserIndex = (index: number) => {
    indexToDisplay = index;
  }

  // Initializing
  useEffect(() => {
    setLoading(true);
    ideasModel.init(dispatch);
    //ideasModel.reset();
    ideasModel.handleNewInfo(idTree[0], mainPanelState.data, tabActive);
  },[])

  // Cleanup mechanism for effects
  useEffect(() => {
    return () => {
      // Clean up when element is not used anymore.
      isLoadingData = true;
      indexToDisplay = 0;
      elemsGrabbed.clear();
      elemsGrabbed.add('0');
      cyElements.jsonElements.nodes = new Map<string, cytoscape.ElementDefinition>();
      cyElements.jsonElements.edges = new Map<string, cytoscape.ElementDefinition>();

      if (cyRef.current) {
        cyRef.current.removeAllListeners();
        cyRef.current = undefined;
      }
    }
  }, []);

  // Handle Zoom
  useEffect(() => {
    cyRef?.current?.zoom(zoom);

    if (showInfo) {
      cyRef.current!.elements().nodes().forEach(function(ele) {
        cyPopper.makePopper(ele, showInfo, fullScreen);
      });
    }
    return () => {
    };
  },[zoom]);

  // Handle 'nodeInfoState' changes
  useEffect(() => {
    let skipRender: boolean = false;
    let waitTime: number = 2000;

    if (!nodeInfoState.nodeData)
      return;

    let latestElements = nodeInfoState.numberOfElements; // <- to remove?

    // Load from file:
    // If 'setupOption' is equals to 1, then data was loaded from a File
    if (nodeInfoState.setupOption == 1) {
      if (isLoadingData) {
        // Index are created based on milisecond, not based on file content, so
        // it is possible to have too many repeated index, to avoid loading repeated content
        // we are only considering indexs stepping from 10 to 10.
        nodeInfoState.indexBeenDisplayed = ((nodeInfoState.indexBeenDisplayed + 10) < nodeInfoState.lastIndex)
                                                                         ? nodeInfoState.indexBeenDisplayed + 10
                                                                         : nodeInfoState.lastIndex;

        if (nodeInfoState.indexBeenDisplayed === nodeInfoState.lastIndex) {
          // When reached the lastIndex, then load is completed.
          isLoadingData = false;
        }
        latestElements = cyElements.parseNodeData(nodeInfoState.nodeData, nodeInfoState.indexBeenDisplayed);
        nodeInfoState.numberOfElements = latestElements.nodes.size;
        waitTime = 200;
      } else {
        // In here, the File content has been all loaded, and no parse is necessary anymore,
        // so just need to skip the Render as there is nothing else to load.
        skipRender = true;
      }
    
    // Load from URL:
    } else {
      // When loading data from URL, parse last index available.
      nodeInfoState.indexBeenDisplayed = nodeInfoState.lastIndex;
      latestElements = cyElements.parseNodeData(nodeInfoState.nodeData, nodeInfoState.lastIndex);
      isLoadingData = false;
      nodeInfoState.numberOfElements = latestElements.nodes.size;
    }
       

    // Parse the selected index
    if (indexToDisplay !== 0) {
      //console.log('SELECTION MODE index: ' + indexToDisplay);
      if (indexToDisplay === nodeInfoState.indexBeenDisplayed) {
        //console.log('SELECTION MODE same index, ignoring...');
        skipRender = true;
      } else {
        latestElements = cyElements.parseNodeData(nodeInfoState.nodeData, indexToDisplay);
        nodeInfoState.indexBeenDisplayed = indexToDisplay;
      }
    }

    if (!skipRender) {
      const hasChanged = cyElements.compareNodeData(cyRef, cyElements.jsonElements, latestElements);

      if (hasChanged) {
        // Refresh Graph to display added and removed nodes/edges.
        refreshGraphLayout(cyRef);

        // When graph changes, it is necessary to set tippy and events
        // to the new elements.
        setElementsChanged(!elementsChanged);
      }
    }

    setLoading(false);

    const timeoutExec: NodeJS.Timeout = setTimeout(() => {        
      ideasModel.handleNewInfo(idTree[0], mainPanelState.data, tabActive);
    }, waitTime);

    return () => { clearTimeout(timeoutExec); } ;
  },[nodeInfoState]);

  // Handle user interaction and changes on cytoscape graph
  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.ready(function() {
        cyRef.current!.elements().nodes().forEach(function(ele : any) {
          // Create popper only if it is undefined (to avoid re-creation) or
          // when showInfo/fullScreen options has changes.
          if ((ele.tippy === undefined) ||
              (ele.tippy.fullScreen !== fullScreen || ele.tippy.showInfo !== showInfo)) {
                cyPopper.makePopper(ele, showInfo, fullScreen);
          }
        });
      });

      (fullScreen) ? document.getElementById('ideasModal')!.className = styles.modalFullscreen
                   : document.getElementById('ideasModal')!.className = styles.modal;

      cyRef.current.minZoom(minZoom);
      cyRef.current.maxZoom(maxZoom);

      cyRef.current.elements().unbind('mouseover');
      cyRef.current.elements().bind('mouseover', (event) => {
                                      if (showInfo) return;
                                      event.target.tippy?.show();
                                    });

      cyRef.current.elements().unbind('mouseout');
      cyRef.current.elements().bind('mouseout', (event) => {
                                      if (showInfo) return;
                                      event.target.tippy?.hide();
                                    });

      cyRef.current.elements().unbind('drag');
      cyRef.current.elements().bind('drag', (event) => {
                                      elemsGrabbed.add(event.target.id());
                                      event.target.tippy?.popperInstance?.update();
                                    });

      // Position and Remove events are used when graph layout is updated by
      // layout.run command.
      cyRef.current.elements().unbind('position');
      cyRef.current.elements().bind('position', (event) => {
                                      event.target.tippy?.destroy();
                                      event.target.tippy = undefined;
                                      cyPopper.makePopper(event.target, showInfo, fullScreen);
                                    });

      cyRef.current.elements().unbind('remove');
      cyRef.current.elements().bind('remove', (event) => {
                                      event.target.tippy?.destroy();
                                      event.target.tippy = undefined;
                                    });

      cyRef.current.unbind('scrollzoom');
      cyRef.current.on('scrollzoom', () => {
        if (showInfo) {
          setShowInfo(false);
          cyPopper.destroyPopper(cyRef);
        }
      });

      cyRef.current.unbind('dragpan');
      cyRef.current.on('dragpan', () => {
        setShowInfo(false);
      });

    }
    return () => {
      
    }
  }, [cyRef.current, elementsChanged, showInfo, fullScreen]);

  // Screen modal needs to display the 'memory path'. It is only used to keep
  // same behaviour from other screens.
  const handleIdTree = (idTree: string) => {
    ideasModel.handleNewInfo(idTree, mainPanelState.data, tabActive);
  }

  const ideasViewProps: IdeasViewProps = {
    nodeInfoState,
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
    jsonElements: cyElements.jsonElements,
    isLoading,
    showInfo,
    isLoadingData,
    indexToDisplay
  }

  return(
    <IdeasView
      {...ideasViewProps}
    />
  )
}

export default IdeasInfoController;