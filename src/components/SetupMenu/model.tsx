import SetupMenuModelType from "../../@types/SetupMenuModelType";

class SetupMenuModel {
  private selectedOption: number;
  private stage: number;
  private dispatch: React.Dispatch<any>;

  constructor (initialState: SetupMenuModelType, dispatch: React.Dispatch<any>) {
    this.selectedOption = initialState.selectedOption;
    this.stage = initialState.stage;
    this.dispatch = dispatch;
  }

  public setStage = (stage: number) => {
    this.stage = stage;
    this.dispatch({
      type: "UPDATE_STAGE",
      stage: stage
    })
  }

  public setSelectedOption = (option: number) => {
    this.selectedOption = option;
    this.dispatch({
      type: "UPDATE_SELECTED_OPTION",
      selectedOption: option
    })
  }

  public setErrorMessage = (msg: string) => {
    this.dispatch({
      type: "UPDATE_ERROR_MESSAGE",
      errorMessage: msg
    })
  }

  public saveUrlOption = (url: string) => {
    localStorage.setItem("@visualizador/setupOption","0");
    localStorage.setItem("@visualizador/url",`${url}`);
  }

  public saveFileOption = async (filesArray: Array<string>) => {
    try {
      localStorage.setItem("@visualizador/setupOption","1");
      localStorage.setItem("@visualizador/files", JSON.stringify(filesArray));
    } catch (e: any) {
      if (e.message.includes("exceeded the quota"))
        this.setErrorMessage("Import Failed! File size is limited to 5 Mb.");
      else
        this.setErrorMessage(e.message);
      return false;
    }

    return true;
  }


}

export default SetupMenuModel;