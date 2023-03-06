import SetupMenuProps from '../../@types/SetupMenuProps';
import SetupMenuController from './controller';

const SetupMenu = (props: SetupMenuProps) => {
  return(
    <SetupMenuController 
      {...props}
    /> 
  )
}

export default SetupMenu