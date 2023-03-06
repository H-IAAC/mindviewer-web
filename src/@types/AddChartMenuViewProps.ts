import AddChartMenuModelType from "../@types/AddChartMenuModelType";
import AddChartMenuProps from "./AddChartMenuProps";

type AddChartMenuViewProps = {
  addChartMenuState: AddChartMenuModelType,
  handleSubmit: () => void,
  handleUpdateInfo: (idInfo: string, value: any) => void,
  addChartMenuProps: AddChartMenuProps
}

export default AddChartMenuViewProps;