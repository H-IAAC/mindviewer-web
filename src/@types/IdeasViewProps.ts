import IdeasInfoModelType from "./IdeasInfoModelType";
import Elements from "../@types/IdeasGraphElements";

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
  jsonElements: Elements,
  isLoading: boolean,
  showInfo: boolean
  isLoadingFileData: boolean,
  indexSelectedToBeDisplayed: number
}

export default NodeInfoViewProps;