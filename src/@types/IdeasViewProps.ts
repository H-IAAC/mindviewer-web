import IdeasInfoModelType from "./IdeasInfoModelType";
import NodeInfoProps from "./NodeInfoProps";

type NodeInfoViewProps = {
  nodeInfoState: IdeasInfoModelType,
  handleIdTree: (idTree: string) => void,
  handleZoomIn: () => void,
  handleZoomOut: () => void,
  handleShowInfo: () => void,
  handleSaveImage: () => void,
  handleFullScreen: () => void,
  handleResetLayout: () => void,
  handleClose: () => void,
  handleUserIndex: (customIndex: number) => void,
  cyRef: React.MutableRefObject<any>,
  jsonElements: any,
  isLoading: boolean,
  showInfo: boolean,
}

export default NodeInfoViewProps;