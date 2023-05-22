import React, { useRef, useEffect, useState, useReducer } from "react";
import NodeInfoProps from "../../@types/NodeInfoProps";
import IdeasViewProps from "../../@types/IdeasViewProps";
import IdeasInfoModel from "./model";
import IdeasView from "./view";
import cytoscape from 'cytoscape';
import popper from 'cytoscape-popper';
import tippy from 'tippy.js';

cytoscape.use(popper);

const initialNodeInfoState = { 
  pathList: [],
  nodeData: undefined,
  nodeJsonData: undefined,
  nodeDataType: "Undefined",
  time: "",
  index: 0,
  inputTimeModal: false 
};

const CytoNode = (id: string, name: string, value: string, type: string, category: string, scope: string, classes: string, posX = 0, posY = 0) => ({
  data: {
    id,
    name,
    value,
    type,
    category,
    scope
  },
  position: {
    x: posX,
    y: posY
  },
  classes
});

const CytoEdge = (source: string, target: string, label = '') => ({
  data: { source, target, label }
});

const elementsJson : any = {
  nodes: [],
  edges: []
};

/*** CODE TO PARSE JSON *
const parseIdeas = (idea : any, edge = false, edgeSource = '0') => {

  if (idea.hasOwnProperty('l') && idea.l) {
      //console.log(JSON.stringify(idea));
      idea.l.forEach(function (l : any) {
          //console.log(JSON.stringify(l.l.length));

          if (edge)
            elementsJson.edges.push(CytoEdge(edgeSource, l.id));

          if (l.hasOwnProperty('l') && l.l.length > 0) {
              parseIdeas(l, true, l.id);
          }

          let name = l.name;
          name += (l.value) ? ' (' + l.value + ')' : '';
          elementsJson.nodes.push(CytoNode(l.id, name));

      });
  }
};

const getElements = (c) => {

  fetch("http://localhost:5000")
        .then((res) => res.text())
        .then((data) => {
            //console.log(JSON.stringify(json));

            var json = JSON.parse(data);
            //console.log("DATA: " + JSON.stringify(json));
      
            if(json.hasOwnProperty('memories')) {
              var memories = json.memories;
          
              memories.forEach(function (element : any) {
                  if (element.hasOwnProperty('I')) {
                      if (typeof element.I === "object") {
                          parseIdeas(element.I);
                      }
                  }
              });
              }              
              setElements(elementsJson);
              setLoading(false);
        })
}
*/

const getNodeDataElements = (values: any, edgeId: any) => {
  values.info.forEach(function (value: any) {

    //var type = getIdeaType(value);
    var type = (value.info[4] == null || value.info[4].info == null) ? '' : 'type' + value.info[4].info;
    elementsJson.nodes.push(CytoNode(value.info[0].info, // id
                                     value.info[1].info, // name
                                     parseFloat(value.info[2].info).toFixed(2).toString(), // value
                                     value.info[4].info, // type
                                     value.info[5].info, // category
                                     value.info[6].info, // scope
                                     "ellipse " + type));
    elementsJson.edges.push(CytoEdge(edgeId, value.info[0].info,));

    if (value.info[3].info.length > 0 ) {
      getNodeDataElements(value.info[3], value.info[0].info);
    }
  });
}

const parseNodeData = (nodeData: any, setLoading: any, setElements: any) => {
  if (nodeData && nodeData.values[0] && nodeData.values[0].y && nodeData.values[0].y.info)
    nodeData.values[0].y.info.forEach(function (value: any) {
      if (value.hasChildren) {
        var type = (value.info[4] == null || value.info[4].info == null) ? '' : 'type' + value.info[4].info;
        elementsJson.nodes.push(CytoNode(nodeData.values[0].y.info[0].info, // id
                                         nodeData.values[0].y.info[1].info, // name
                                         nodeData.values[0].y.info[2].info ?
                                              parseFloat(nodeData.values[0].y.info[2].info).toFixed(2).toString() :
                                              '',
                                         nodeData.values[0].y.info[4].info, // type
                                         nodeData.values[0].y.info[5].info, // category
                                         nodeData.values[0].y.info[6].info, // scope
                                "ellipse-double " + type));
        getNodeDataElements(value, nodeData.values[0].y.info[0].info);
      }
  });

  setElements(elementsJson);
  setLoading(false);
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
        index: action.index,
        time: action.time
      };
    default:
      return state;
  }
}

function makePopper(ele: cytoscape.NodeSingular | any, showInfo: boolean) {
  let ref = ele.popperRef();
  let tippysDiv = document.getElementById('tippys');
  let bodyDiv = document.getElementById('ideasModal');

  if (ele.tippy) ele.tippy.destroy();

  ele.tippy = tippy(document.createElement('div'), {
    content: () => {
      let content = document.createElement("div");
      (!showInfo) ?
        content.innerHTML = "Name: " + ele.data('name') + '<br>' +
                          "Value: " + ele.data('value') + '<br>' +
                          "Type: " + ele.data('type') + '<br>' +
                          "Category: " + ele.data('category') + '<br>' +
                          "Scope: " + ele.data('scope')
                          :
                          content.innerHTML = ele.data('name') +
                                              '<br>' +
                                              ele.data('value');
      if (showInfo) content.style.fontSize = "11px";
      if (showInfo) content.style.textAlign = "center"
      if (!showInfo) content.style.backgroundColor = "lightgray";
      content.style.padding = '5px 5px 5px 5px';
      return content;
    },
    hideOnClick: (showInfo) ? false : true,
    placement: (showInfo) ? "bottom" : 'right',
    //boundary: bodyDiv!,
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
      instance.popperInstance!.reference = ref;
    },
  });

  if (showInfo) ele.tippy!.show();
}

const IdeasInfoController = (props: NodeInfoProps) => {

  const handleZoomIn = () => {
    setZoom(zoom + 0.1);
  }
  
  const handleZoomOut = () => {
    setZoom(zoom - 0.1);
  }

  const handleShowInfo = () => {
    (showInfo) ? setShowInfo(false) : setShowInfo(true);
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
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [elements, setElements] = useState({ nodes: [], edges: []});
  const cyRef = React.useRef<cytoscape.Core | undefined>();
  var popperRef: any;

  const clearRefs = (...refs: any[]) =>
    refs.forEach(
      (ref) =>
        ref.current && ref.current.state && !ref.current.state.isDestroyed && ref.current.destroy()
    );

  const [nodeInfoState, dispatch] = useReducer(reducerNodeInfo, initialNodeInfoState);
  const ideasModel = IdeasInfoModel.getInstance();

  useEffect(() => {
    // Get data from JSON
    //getElements(setLoading, setElements);

    if (!nodeInfoState.nodeData) {
      setLoading(true);

      elementsJson.nodes = [];
      elementsJson.edges = [];
      setElements(elementsJson);

      ideasModel.init(dispatch);
      ideasModel.reset();
      ideasModel.handleNewInfo(idTree[0], mainPanelState.data, tabActive);

    } else {
      parseNodeData(nodeInfoState.nodeData, setLoading, setElements);
    }

    return () => {
    };
  },[nodeInfoState]);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.ready(function() {
        cyRef.current!.elements().nodes().forEach(function(ele) {
          makePopper(ele, showInfo);
        });
      });

      cyRef.current.minZoom(0.2);
      cyRef.current.maxZoom(2);

      cyRef.current.elements().unbind('mouseover');
      cyRef.current.elements().bind('mouseover', (event) => {
                                      if (showInfo === true) return;
                                      popperRef = event.target;
                                      if (event.target.tippy) event.target.tippy.show();
                                    });

      cyRef.current.elements().unbind('mouseout');
      cyRef.current.elements().bind('mouseout', (event) => {
                                      if (showInfo === true) return;
                                      popperRef = event.target;
                                      if (event.target.tippy) event.target.tippy.hide();
                                    });

      cyRef.current.elements().unbind('drag');
      cyRef.current.elements().bind('drag', (event) => {
                                      popperRef = event.target;
                                      if (event.target.tippy.popperInstance) event.target.tippy.popperInstance.update();
                                    });

      cyRef.current.on('viewport', (event) => {
        if (showInfo === true) {
          setShowInfo(false);
          cyRef.current!.elements().nodes().forEach(function(ele : any) {
            if (ele.tippy) ele.tippy.destroy();
          });
        } else {
          if (popperRef && popperRef.tippy) popperRef.tippy.hide();
        }
      });

      /*cyRef.current.nodes().on('mouseover', (event: any) => {
        const id = get(event, "target._private.data.id");
        const label = get(event, "target._private.data.label");
        console.log("mouse over node id: " + id);

        cyPopperRef.current = event.target.popper({
          content: () => {
            const div = document.createElement("div");
            div.innerHTML = `<p id='popper'>${label}</p><div class="popper__arrow" x-arrow=""></div>`;
            div.setAttribute("class", "popper");

            var modal = document.getElementById("ideasModal");
            modal!.appendChild(div);
            return div;
          },
          popper: {
            placement: 'right',
            removeOnDestroy: true,
          },
        });
      });

      /*cyRef.current.nodes().on('mouseout', () => {
      });*/

      /*cyRef.current.on("cxttap", (e: any) => {
        if (e.target === cyRef.current) {
          console.log("cxttap on background");
        } else if (e.target.isEdge()) {
          console.log("cxttap on edge");
          cyRef.current!.remove(e.target);
        } else {
          console.log("cxttap on node"); // e.target.isNode()
        }
      });*/

    }
    return () => {
      clearRefs(cyRef);
    }
 }, [cyRef.current, showInfo]);

  const handleIdTree = (idTree: string) => {
    ideasModel.handleNewInfo(idTree, mainPanelState.data, tabActive);
  }

  const ideasViewProps: IdeasViewProps = {
    nodeInfoState,
    handleIdTree,
    handleZoomIn,
    handleZoomOut,
    handleShowInfo,
    cyRef,
    elements,
    isLoading,
    zoom,
    nodeInfoProps: props
  }

  return(
    <IdeasView
      {...ideasViewProps}
    />
  )
}

export default IdeasInfoController;