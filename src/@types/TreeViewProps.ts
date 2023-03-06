import TreeModelType from "../@types/TreeModelType";
import TreeProps from "./TreeProps";

type TreeViewProps = {
  treeState: TreeModelType,
  handleContextMenu: (e: any, key: string) => void,
  treeProps: TreeProps
}

export default TreeViewProps;