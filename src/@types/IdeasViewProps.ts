import NodeInfoModelType from "./NodeInfoModelType";
import NodeInfoProps from "./NodeInfoProps";

type NodeInfoViewProps = {
  nodeInfoState: NodeInfoModelType,
  handleIdTree: (idTree: string) => void,
  cyRef: React.MutableRefObject<any>,
  elements: any,
  isLoading: boolean,
  nodeInfoProps: NodeInfoProps;
}

export default NodeInfoViewProps;