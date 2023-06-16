import React, { useRef, useEffect, useState, useReducer } from "react";
import NodeInfoProps from "../../@types/NodeInfoProps";
import IdeasViewProps from "../../@types/IdeasViewProps";
import Elements from "../../@types/IdeasGraphElements";
import IdeasInfoModel from "./model";
import IdeasView from "./view";
import cytoscapeLayout from './cytoscapeLayout';
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import tippy from 'tippy.js';
import html2canvas from "html2canvas";
import styles from './styles.module.css';
import IDataTree from "../../interfaces/IDataTree";
import graph from './cytoscapeClasses';

cytoscape.use(popper);

const initialNodeInfoState = { 
  pathList: [],
  nodeData: undefined,
  nodeJsonData: undefined,
  nodeDataType: "Undefined",
  index: 0
};

const elemsGrabbed = new Set<string>();

const jsonElements : Elements = {
  nodes: new Map<string, cytoscape.ElementDefinition>(),
  edges: new Map<string, cytoscape.ElementDefinition>()
};

const removeNodeDataElements = (ids: Set<string>, parsedElements: Elements) => {

  parsedElements.nodes.forEach(function (value: any, key: string) {
    if (!ids.has(key)) {
      parsedElements.nodes.delete(key);
    }
  });

  parsedElements.edges.forEach(function (value: any, key: string) {
    if (!ids.has(value.data.source) || !ids.has(value.data.target)) {
      parsedElements.edges.delete(key);
    }
  });

}

const parseNodeDataSubElement = (values: any, edgeId: string, ids: Set<string>, parsedElements: Elements) => {
  values.info.forEach(function (value: any) {

    var type = (value.info[4] == null || value.info[4].info == null) ? '' : 'type' + value.info[4].info;
    ids.add(value.info[0].info);
    // Get sub nodes
    parsedElements.nodes.set(value.info[0].info, graph.Node(value.info[0].info, // id
                                     value.info[1].info, // name
                                     parseFloat(value.info[2].info).toFixed(2).toString(), // value
                                     value.info[4].info, // type
                                     value.info[5].info, // category
                                     value.info[6].info, // scope
                                     "ellipse " + type));
    // Get node edge
    parsedElements.edges.set(edgeId + '_' + value.info[0].info, graph.Edge(edgeId, value.info[0].info, ''));

    if (value.info[3].info.length > 0 ) {
      parseNodeDataSubElement(value.info[3], value.info[0].info, ids, parsedElements);
    }
  });
}

const parseNodeData = (nodeData: IDataTree | undefined, index: number) : Elements=> {

  let ids = new Set<string>();
  let parsedElements: Elements = {
    nodes: new Map<string, cytoscape.ElementDefinition>(jsonElements.nodes),
    edges: new Map<string, cytoscape.ElementDefinition>(jsonElements.edges)
  }

  if (nodeData && nodeData.values && nodeData.values[index] && nodeData.values[index].y && nodeData.values[index].y.info) {
    const node = nodeData.values[index];
    
    node.y.info.forEach(function (value: any) {
      if (value.hasChildren) {
        // This children node refers to the root node.
        var type = (value.info[4] == null || value.info[4].info == null) ? '' : 'type' + value.info[4].info;
        ids.add(node.y.info[0].info);
        parsedElements.nodes.set(node.y.info[0].info, graph.Node(node.y.info[0].info, // id
                                              node.y.info[1].info, // name
                                              node.y.info[2].info ?
                                                parseFloat(node.y.info[2].info).toFixed(2).toString() :
                                                '',
                                              node.y.info[4].info, // type
                                              node.y.info[5].info, // category
                                              node.y.info[6].info, // scope
                                              "ellipse-double " + type));

        // Every other node related to this root is identified by the function below
        parseNodeDataSubElement(value, node.y.info[0].info, ids, parsedElements);
      }
    });
  }

  removeNodeDataElements(ids, parsedElements);

  return parsedElements;
}

const reducerNodeInfo = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_INFO':
      return { 
        ...state, 
        pathList: action.pathList,
        nodeData: action.nodeData,
        nodeJsonData: action.nodeJsonData,
        nodeDataType: action.nodeDataType,
        index: action.index
      };
    default:
      return state;
  }
}

function refreshGraphLayout(cyRef : any) {
  // Save pan and zoom values
  const pan = cyRef.current?.pan();
  const zoomLevel = cyRef.current?.zoom();

  // Lock all elements that were move by the user, so then they will
  // keep at same position after refresh.
  elemsGrabbed.forEach(id => {
    cyRef.current?.getElementById(id).lock();
  });

  // Perform the refresh
  cyRef.current?.makeLayout(cytoscapeLayout).run();

  // Unlock all elements, so then user can move it again
  elemsGrabbed.forEach(id => {
    cyRef.current?.getElementById(id).unlock();
  });

  // Restore pan and zoom values
  cyRef.current?.zoom(zoomLevel);
  cyRef.current?.pan(pan);
}

function destroyPopper (cyRef : any) {
  cyRef.current!.elements().nodes().forEach(function(ele : any) {
    ele.tippy?.destroy();
    ele.tippy = undefined;
  });
}

function makePopper(ele: cytoscape.NodeSingular | any, showInfo: boolean, fullScreen: boolean) {
  let tippysDiv = document.getElementById('tippys');
  (fullScreen) ? tippysDiv!.className = styles.tippysFullscreen : tippysDiv!.className = styles.tippys;

  ele.tippy?.destroy();

  ele.tippy = tippy(document.createElement('div'), {
    content: () => {
      let content = document.createElement("div");
      content.style.padding = '5px 5px 5px 5px';

      if (showInfo) {
        content.innerHTML = ele.data('name') +
                            '<br>' +
                            ele.data('value');
        content.style.fontSize = "11px";
        content.style.textAlign = "center"
      } else {
        content.innerHTML = "Name: " + ele.data('name') + '<br>' +
                            "Value: " + ele.data('value') + '<br>' +
                            "Type: " + ele.data('type') + '<br>' +
                            "Category: " + ele.data('category') + '<br>' +
                            "Scope: " + ele.data('scope');
        content.style.backgroundColor = "#e9e9e9";
        content.style.border = "1px solid black";
      }
      
      return content;
    },
    hideOnClick: (showInfo) ? false : true,
    placement: (showInfo) ? "bottom" : 'right',
    zIndex: 2,
    flip: true,
    appendTo: () =>  tippysDiv!,
    popperOptions: {
      modifiers: {
        flip: {
          boundariesElement: 'scrollParent',
        },
      }
    },
    onShow(instance) {
      instance.popperInstance!.reference = ele.popperRef();;
    },
  });

  if (showInfo) ele.tippy?.show();
}

const IdeasInfoController = (props: NodeInfoProps) => {

  const handleResetLayout = () => {
    elemsGrabbed.clear();
    refreshGraphLayout(cyRef);
  }

  const handleZoomIn = () => {
    let currentZoom = (cyRef?.current?.zoom()) ? cyRef?.current?.zoom() : 0;
    setZoom(currentZoom + 0.1);
  }
  
  const handleZoomOut = () => {
    let currentZoom = (cyRef?.current?.zoom()) ? cyRef?.current?.zoom() : 0;
    setZoom(currentZoom - 0.1);
  }

  const handleShowInfo = () => { (showInfo) ? setShowInfo(false) : setShowInfo(true); }

  const handleFullScreen = () => { (fullScreen) ? setFullscreen(false) : setFullscreen(true); }

  const handleSaveImage = async () => {
    const element = document.getElementById('body')
    const canvas = await html2canvas(element!);

    const data = canvas.toDataURL('image/png');
    const link = document.createElement('a');

    if (typeof link.download === 'string') {
      link.href = data;
      link.download = 'image.png';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  }

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

  const [zoom, setZoom] = useState(0.55);
  const [fullScreen, setFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [elements, setElements] = useState(jsonElements);

  const cyRef = React.useRef<cytoscape.Core | undefined>();

  const clearRefs = (...refs: any[]) =>
    refs.forEach(
      (ref) =>
        ref.current && ref.current.state && !ref.current.state.isDestroyed && ref.current.destroy()
    );

  const [nodeInfoState, dispatch] = useReducer(reducerNodeInfo, initialNodeInfoState);
  const ideasModel = IdeasInfoModel.getInstance();

  useEffect(() => {
    cyRef?.current?.zoom(zoom);

    if (showInfo) {
      cyRef.current!.elements().nodes().forEach(function(ele) {
        makePopper(ele, showInfo, fullScreen);
      });
    }
    return () => {
    };
},[zoom]);

  useEffect(() => {
    if (!nodeInfoState.nodeData) {
      setLoading(true);
      ideasModel.init(dispatch);
      //ideasModel.reset();
      ideasModel.handleNewInfo(idTree[0], mainPanelState.data, tabActive);

    } else {
      const parsedElements = parseNodeData(nodeInfoState.nodeData, nodeInfoState.index);

      if (jsonElements.nodes.size === 0) {
        jsonElements.nodes = parsedElements.nodes;
        jsonElements.edges = parsedElements.edges;
        setElements(jsonElements);
      } else {
        let hasChanged = false;
        // Remove nodes that are not present in the new nodeData
        for (let [key, value] of jsonElements.nodes) {        
          if (!parsedElements.nodes.has(key)) {
            jsonElements.nodes.delete(key);
            hasChanged = true;
          }
        }

        // Remove edges that are not present in the new nodeData
        for (let [key, value] of jsonElements.edges) {        
          if (!parsedElements.edges.has(key)) {
            jsonElements.edges.delete(key);
            hasChanged = true;
          }
        }

        // Add nodes that are not present in the current graph
        for (let [key, value] of parsedElements.nodes) {        
          if (!jsonElements.nodes.has(key)) {
            cyRef.current?.add(value);
            jsonElements.nodes.set(key, value);
            hasChanged = true;
          }
        }

        // Add edges that are not present in the current graph
        for (let [key, value] of parsedElements.edges) {
          if (!jsonElements.edges.has(key)) {
            cyRef.current?.add(value);
            jsonElements.edges.set(key, value);
            hasChanged = true;
          }
        }

        if (hasChanged) refreshGraphLayout(cyRef);
      }

      setLoading(false);

      setTimeout(() => {        
        ideasModel.handleNewInfo(idTree[0], mainPanelState.data, tabActive);
      }, 5000);
    }

    return () => {
    };
  },[nodeInfoState]);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.ready(function() {
        cyRef.current!.elements().nodes().forEach(function(ele) {
          makePopper(ele, showInfo, fullScreen);
        });
      });

      (fullScreen) ? document.getElementById('ideasModal')!.className = styles.modalFullscreen
                   : document.getElementById('ideasModal')!.className = styles.modal;

      cyRef.current.minZoom(0.2);
      cyRef.current.maxZoom(2);

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

      cyRef.current.unbind('scrollzoom');
      cyRef.current.on('scrollzoom', (event) => {
        if (showInfo) {
          setShowInfo(false);
          destroyPopper(cyRef);
        }
      });

      cyRef.current.unbind('dragpan');
      cyRef.current.on('dragpan', (event) => {
        setShowInfo(false);
      });

    }
    return () => {
      //clearRefs(cyRef);
    }
 }, [cyRef.current, showInfo, fullScreen]);

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
    cyRef,
    elements,
    isLoading,
    showInfo,
    nodeInfoProps: props
  }

  return(
    <IdeasView
      {...ideasViewProps}
    />
  )
}

export default IdeasInfoController;