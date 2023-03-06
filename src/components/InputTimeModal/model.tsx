import { getDaysInMonth } from "date-fns";

class InputTimeModalModel {
  private static instance: InputTimeModalModel;
  private day: number;
  private month: number;
  private year: number;
  private hour: number;
  private minute: number;
  private second: number;
  private milissecond: number;
  private warning: boolean;
  private dispatch: React.Dispatch<any>;

  public static getInstance = () => {
    if (InputTimeModalModel.instance == null)
      InputTimeModalModel.instance = new InputTimeModalModel()
    return InputTimeModalModel.instance
  }

  constructor () {
    this.day = 0;
    this.month = 0;
    this.year = 0;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
    this.milissecond = 0;
    this.warning = false;
    this.dispatch = ()=>null;
  }

  public init = (dispatch: React.Dispatch<any>) => {
    this.dispatch = dispatch;
    this.setWarning(false);
  }

  public getTime = () => {
    this.setWarning(false);

    if (this.validateValues()) {
      const date = new Date(this.year,this.month-1);
      if (this.day <= getDaysInMonth(date)) {
        date.setDate(this.day);
        date.setHours(this.hour,this.minute,this.second,this.milissecond)
        // props.handleInputTime(date);
        // props.setModal(false);
        return date;
      }
    }

    this.setWarning(true);
  }

  public validateValues = () => {
    return(
      this.month > 0 && this.month <= 12 &&
      this.day > 0 && this.day <= 31 &&
      this.hour >= 0 && this.hour < 24 &&
      this.minute >= 0 && this.minute < 60 &&
      this.second >= 0 && this.second < 60 &&
      this.milissecond >= 0 && this.milissecond < 1000
    )
  }

  public setDay = (value: number) => {
    this.day = value;
    this.dispatch({
      type: "UPDATE_DAY",
      value: this.day
    })
  }

  public setMonth = (value: number) => {
    this.month = value;
    this.dispatch({
      type: "UPDATE_MONTH",
      value: this.month
    })
  }

  public setYear = (value: number) => {
    this.year = value;
    this.dispatch({
      type: "UPDATE_YEAR",
      value: this.year
    })
  }

  public setHour = (value: number) => {
    this.hour = value;
    this.dispatch({
      type: "UPDATE_HOUR",
      value: this.hour
    })
  }

  public setMinute = (value: number) => {
    this.minute = value;
    this.dispatch({
      type: "UPDATE_MINUTE",
      value: this.minute
    })
  }

  public setSecond = (value: number) => {
    this.second = value;
    this.dispatch({
      type: "UPDATE_SECOND",
      value: this.second
    })
  }

  public setMilissecond = (value: number) => {
    this.milissecond = value;
    this.dispatch({
      type: "UPDATE_MILISSECOND",
      value: this.milissecond
    })
  }

  public setWarning = (value: boolean) => {
    this.warning = value;
    this.dispatch({
      type: "UPDATE_WARNING",
      value: this.warning
    })
  }
}

export default InputTimeModalModel;