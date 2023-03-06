import EditChartMenuModelType from "../@types/EditChartMenuModelType";
import EditChartMenuProps from "./EditChartMenuProps";

type EditChartMenuViewProps = {
  editChartMenuState: EditChartMenuModelType,
  handleSaveEdits: () => void,
  handleColor: (color: string, index: number) => void,
  handleConfirmPalette: () => void,
  handleUpdateInfo: (idInfo: string, value: any) => void,
  chartActionsProps: EditChartMenuProps
}

export default EditChartMenuViewProps;