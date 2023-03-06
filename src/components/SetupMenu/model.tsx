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

  public saveUrlOption = (url: string) => {
    localStorage.setItem("@visualizador/setupOption","0");
    localStorage.setItem("@visualizador/url",`${url}`);
  }

  public saveFileOption = async (files: FileList) => {
    let filesArray: Array<string> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let base64 = await this.getBase64FromFile(file);
      filesArray.push(base64);
    }
    
    localStorage.setItem("@visualizador/setupOption","1");
    localStorage.setItem("@visualizador/files", JSON.stringify(filesArray));

    return filesArray;
  }

  public getBase64FromFile = async (file: File) => {
    return new Promise<string>((resolve, reject) => {
      var reader = new FileReader();

      reader.onload = (f => (e: any) => {
        let base64: string = e.target.result;
        resolve(base64);          
      })(file);

      reader.readAsDataURL(file);
    });
  }
}

export default SetupMenuModel;