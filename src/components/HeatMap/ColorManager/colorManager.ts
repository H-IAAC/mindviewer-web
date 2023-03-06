import IColorRange from "../../../interfaces/IColorRange";
import CategoricalColorRange from "./categoricalColorRange";
import GradientColorRange from "./gradientColorRange";

class ColorManager {
  private type: string;
  public categorical: IColorRange;
  public gradient: IColorRange;

  constructor () {
    this.type = "gradient";
    this.categorical = new CategoricalColorRange();
    this.gradient = new GradientColorRange();
  }

  public init = (values: number[]) => {
    this.categorical.init(values);
    this.gradient.init(values);
  }

  public saveEdit = (type: string) => {
    this.type = type;
    this.type === "gradient"
        ? this.gradient.saveEdit()
        : this.categorical.saveEdit()
  }

  public getType = () => this.type;
  
  public getColorFunction = () => {
    return(
      this.type === "gradient"
        ? this.gradient.getRule()
        : this.categorical.getRule()
    )
  }

  public getLegendBar = () => {
    return(
      this.type === "gradient"
        ? this.gradient.getLegendBar()
        : this.categorical.getLegendBar()
    )
  }
}

export default ColorManager;