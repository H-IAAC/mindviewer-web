import TreeProps from '../../@types/TreeProps';
import TreeController from './controller';

const Tree = (props: TreeProps) => {
  return(
    <TreeController 
      {...props}
    />
  )
}

export default Tree;