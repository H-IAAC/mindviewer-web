import EditChartMenuProps from '../../@types/EditChartMenuProps';
import EditChartMenuController from './controller';

const EditChartMenu = (props: EditChartMenuProps) => {
  return(
    <EditChartMenuController
      {...props}
    />
  )
}

export default EditChartMenu;