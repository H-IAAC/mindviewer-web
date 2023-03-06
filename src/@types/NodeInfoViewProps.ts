import NodeInfoModelType from "./NodeInfoModelType";
import NodeInfoProps from "./NodeInfoProps";

type NodeInfoViewProps = {
  nodeInfoState: NodeInfoModelType,
  handleIdTree: (idTree: string) => void,
  handleAddChart: () => void,
  handleInputTimeModal: (value: boolean) => void,
  handleInputTime: (date: Date) => void,
  nodeInfoProps: NodeInfoProps;
}

export default NodeInfoViewProps;