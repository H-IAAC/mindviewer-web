import NodeInfoModelType from "./NodeInfoModelType";
import NodeInfoProps from "./NodeInfoProps";

type NodeInfoViewProps = {
  nodeInfoState: NodeInfoModelType,
  handleIdTree: (idTree: string) => void,
  handleZoomIn: () => void,
  handleZoomOut: () => void,
  handleShowInfo: () => void,
  handleSaveImage: () => void,
  handleFullScreen: () => void,
  handleResetLayout: () => void,
  handleClose: () => void,
  cyRef: React.MutableRefObject<any>,
  jsonElements: any,
  isLoading: boolean,
  showInfo: boolean,
  nodeInfoProps: NodeInfoProps;
}

export default NodeInfoViewProps;