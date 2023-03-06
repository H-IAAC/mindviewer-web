import IDataTree from "../interfaces/IDataTree";

type MainPanelModelType = {
  data: IDataTree[],
  chartList: any[],
  chartComponentList: ((index: number) => JSX.Element)[],
  updateVariable: boolean,
  noConnection: boolean,
}

export default MainPanelModelType;