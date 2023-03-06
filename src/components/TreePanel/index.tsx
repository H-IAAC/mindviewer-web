import TreePanelProps from '../../@types/TreePanelProps';
import TreePanelController from './controller';

const TreePanel = (props: TreePanelProps) => {
  return(
    <TreePanelController 
      {...props}
    />
  )
}

export default TreePanel;