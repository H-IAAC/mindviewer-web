import EditChartMenuModel from "../components/EditChartMenu/model";

interface IChart {
  setData: (data: any) => void,
  defineRange: () => void,
  setViewport: () => void,
  setViewportWithSlider: (value: number) => void,
  setViewportWithXAxisSlider: (value: number) => void,
  findViewportValueWithTime: (time: number) => number,
  handleStep: (step: number) => number,
  getDomain: () => number[],
  fixColors: () => void,
  deleteColors: (items: number[]) => void,
  constructDataChart: () => void,
  reset: () => void,
  setEnableRefresh: (value: boolean) => void, 
  setDefaultInterval: (value: number) => void,
  setTimeMultiplier: (value: number) => void,
  setYInterval: (value: Array<number>) => void,
  setAutoRange: (value: boolean) => void, 
  setTitle: (value: string) => void, 
  setActive: (value: boolean) => void,
  setId: (value: number) => void,
  setIdTree: (value: string[][]) => void,
  setColors: (value: string[]) => void, 
  setTooltipActive: (value: boolean) => void, 
  setShowXAxisGrid: (value: boolean) => void, 
  setShowYAxisGrid: (value: boolean) => void,
  getIdTree: () => string[][], 
  getDefaultInterval:() => number,
  getTimeMultiplier: () => number,
  getYInterval: () => number[],
  getAutoRange: () => boolean,
  getTitle: () => string,
  getShowXAxisGrid: () => boolean,
  getShowYAxisGrid: () => boolean,
  getTime: (formatted?: boolean) => number | string,
  getXAxisViewPortValue: () => number,
  getElements: () => {
    label: string | undefined;
    color: string;
  }[]
  getEditChartMenuModel: () => EditChartMenuModel
}

export default IChart;