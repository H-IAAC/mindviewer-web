import React, { useRef, useEffect, useState, useReducer } from "react";
import NodeInfoProps from "../../@types/NodeInfoProps";
import IdeasViewProps from "../../@types/IdeasViewProps";
import IdeasInfoModel from "./model";
import IdeasView from "./view";
import { get } from "lodash";

const initialNodeInfoState = { 
  pathList: [],
  nodeData: undefined,
  nodeJsonData: undefined,
  nodeDataType: "Undefined",
  time: "",
  index: 0,
  inputTimeModal: false 
};

const CytoNode = (id: string, label: string, posX = 0, posY = 0) => ({
  data: {
    id,
    label
  },
  position: {
    x: posX,
    y: posY
  }
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
    //console.log("id: " + value.info[0].info);
    //console.log("name: " + value.info[1].info);
    //console.log("value: " + value.info[2].info);
    elementsJson.nodes.push(CytoNode(value.info[0].info, value.info[1].info));
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
        elementsJson.nodes.push(CytoNode(nodeData.values[0].y.info[0].info, // id
                                nodeData.values[0].y.info[1].info));        // name
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

const IdeasInfoController = (props: NodeInfoProps) => {

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

  const [isLoading, setLoading] = useState(true);
  const [elements, setElements] = useState({ nodes: [], edges: []});
  const cyRef = useRef<any>();

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

    if (cyRef.current) {
      cyRef.current.on("tap", (event: any) => {
        //clearRefs(popperRef, contextMenuRef);
        console.log(event);
        const label = get(event, "target._private.data.label");
        /*if (label) {
          popperRef.current = event.target.popper({
            content: () => {
              const div = document.createElement("div");
              div.innerHTML = `<p>${label}</p><div class="popper__arrow" x-arrow=""></div>`;
              div.setAttribute("class", "popper");
              document.body.appendChild(div);
              return div;
            },
            popper: { removeOnDestroy: true }
          });
        }*/
      });
      /* cyRef.current.on("pan zoom resize position", () => {
        clearRefs(popperRef, contextMenuRef);
      });*/
      /*cyRef.current.on("cxttap", (event) => {
        clearRefs(popperRef, contextMenuRef);
        const label = get(event, "target._private.data.label");
        if (label) {
          contextMenuRef.current = event.target.popper({
            content: () => {
              const div = document.createElement("div");
              div.innerHTML = `
              <div>option1</div>
              <div>option2</div>
              <div>option3</div>
            `;
              document.body.appendChild(div);
              return div;
            },
            popper: { removeOnDestroy: true }
          });
        }
      });*/
      cyRef.current.on("cxttap", (e: any) => {
        if (e.target === cyRef.current) {
          console.log("cxttap on background");
        } else if (e.target.isEdge()) {
          console.log("cxttap on edge");
          cyRef.current.remove(e.target);
        } else {
          console.log("cxttap on node"); // e.target.isNode()
        }
      });
      //const eh = cyRef.current.edgehandles(edgehandlesOptions);
      //eh.enableDrawMode();
    }
    //return () => {
    //  clearRefs(cyRef/*, contextMenuRef*/);
    //};
  },[nodeInfoState])













  const handleIdTree = (idTree: string) => {
    ideasModel.handleNewInfo(idTree, mainPanelState.data, tabActive);
  }

  const ideasViewProps: IdeasViewProps = {
    nodeInfoState,
    handleIdTree,
    cyRef,
    elements,
    isLoading,
    nodeInfoProps: props
  }

  return(
    <IdeasView
      {...ideasViewProps}
    />
  )
}

export default IdeasInfoController;