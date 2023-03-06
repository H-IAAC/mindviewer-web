import NodeInfoProps from "../../@types/NodeInfoProps";
import NodeInfoController from "./controller";

const NodeInfo = (props: NodeInfoProps) => {
  return(
    <NodeInfoController
      {...props}
    />
  )
}

export default NodeInfo;