import TreeProps from '../../@types/TreeProps';
import TreeNodeInfoController from './controller';

const TreeNodeInfo = (props: any) => {
  return(
    <TreeNodeInfoController
      {...props}
    />
  )
}

export default TreeNodeInfo;