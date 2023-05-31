import NodeInfoModelType from "./NodeInfoModelType";
import NodeInfoProps from "./NodeInfoProps";

type NodeInfoViewProps = {
  nodeInfoState: NodeInfoModelType,
  handleIdTree: (idTree: string) => void,
  handleZoomIn: () => void,
  handleZoomOut: () => void,
  handleShowInfo: () => void,
  handleSaveAsPng: () => void,
  handleFullscreen: () => void,
  cyRef: React.MutableRefObject<any>,
  elements: any,
  isLoading: boolean,
  zoom: number,
  showInfo: boolean,
  nodeInfoProps: NodeInfoProps;
}

export default NodeInfoViewProps;