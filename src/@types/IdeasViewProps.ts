import NodeInfoModelType from "./NodeInfoModelType";
import NodeInfoProps from "./NodeInfoProps";

type NodeInfoViewProps = {
  nodeInfoState: NodeInfoModelType,
  handleIdTree: (idTree: string) => void,
  handleZoomIn: () => void,
  handleZoomOut: () => void,
  cyRef: React.MutableRefObject<any>,
  elements: any,
  isLoading: boolean,
  zoom: number,
  nodeInfoProps: NodeInfoProps;
}

export default NodeInfoViewProps;