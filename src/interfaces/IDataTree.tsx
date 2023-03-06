export default interface IDataTree {
  id: string;
  type: string;
  name: string;
  icon: string;
  labelChart?: string;
  values?: {
    x: number| Date,
    y: any,
    evaluation: number
  }[],
  children?: IDataTree[];
}