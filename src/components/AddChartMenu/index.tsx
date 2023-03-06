import AddChartMenuProps from '../../@types/AddChartMenuProps';
import AddChartMenuController from './controller';

const AddChartMenu = (props: AddChartMenuProps) => {
  return(
    <AddChartMenuController 
      {...props}
    />
  )
}

export default AddChartMenu;