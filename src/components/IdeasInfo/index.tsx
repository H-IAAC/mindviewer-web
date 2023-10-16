import NodeInfoProps from "../../@types/NodeInfoProps";
import IdeasInfoController from "./controller";

const IdeasInfo = (props: NodeInfoProps) => {
  return(
    <IdeasInfoController
      {...props}
    />
  )
}

export default IdeasInfo;