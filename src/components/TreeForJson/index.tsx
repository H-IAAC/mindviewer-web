import TreeProps from '../../@types/TreeProps';
import TreeForJsonController from './controller';

const TreeForJson = (props: any) => {
  return(
    <TreeForJsonController 
      {...props}
    />
  )
}

export default TreeForJson;