import TreePanelModelType from "../@types/TreePanelModelType";
import TreePanelProps from "./TreePanelProps";

type TreePanelViewProps = {
  treePanelState: TreePanelModelType,
  handleToggle: (event: React.ChangeEvent<{}>, nodeIds: string[]) => void,
  handleSelect: (event: React.ChangeEvent<{}>, nodeIds: string[]) => void,
  handleNewChart: (options: {
    idTree: string[];
    type: string;
    xInterval: number;
    timeMultiplier: number;
    yInterval: Array<number>;
    autoRange: boolean;
    title: string;
  }) => void,
  handleNewDataInChart: (idTree: string[], key: number) => void,
  handleOpenAddChartMenu: (idTree: string[]) => void,
  handleCloseAddChartMenu: () => void,
  handleOpenNodeInfoModal: (idTree: string[]) => void,
  handleCloseNodeInfoModal: () => void,
  handleAddChartNewTab: (idTree: string[]) => void,
  handleTabActive: (value: number) => void,
  treePanelProps: TreePanelProps;
}

export default TreePanelViewProps;