import AppModelType from "../../@types/AppModelType";
import SetupConfigType from "../../@types/SetupConfigType";

class AppModel {
  /*
    connectionActive -> Variável booleana que indica se a conexão está ativa;
    initialTime -> Tempo inicial da aplicação;
  */
  private connectionActive: boolean;
  private initialTime: number;
  private inSetup: boolean;
  private setupOption: number;
  private url: string;
  private files: string[];
  private layout: string;
  private dispatch: React.Dispatch<any>

  constructor (initialState: AppModelType, dispatch: React.Dispatch<any>) {
    this.connectionActive = initialState.connectionActive;
    this.initialTime = initialState.initialTime;
    this.inSetup = initialState.inSetup;
    this.setupOption = initialState.setupOption;
    this.url = initialState.url;
    this.files = initialState.files;
    this.layout = initialState.layout;
    this.dispatch = dispatch;
  }

  public initApp = () => {
    const setupOptionFromStorage = localStorage.getItem("@visualizador/setupOption");
    if (setupOptionFromStorage) {
      if (setupOptionFromStorage === "0") {
        const urlFromStorage = localStorage.getItem("@visualizador/url");
        if (urlFromStorage) {
          this.dispatch({
            type: "UPDATE_URL",
            url: urlFromStorage
          })
        }
      } else {
        const filesFromStorage = localStorage.getItem("@visualizador/files");
        if (filesFromStorage) {
          const convertedFiles: Array<string> = JSON.parse(filesFromStorage)
          this.dispatch({
            type: "UPDATE_FILE",
            files: convertedFiles
          })
        }
      }
    }
  }

  public setConnectionActive = (value: boolean) => {
    this.connectionActive = value
    this.dispatch({
      type: "UPDATE_CONNECTION",
      connectionActive: value
    })
  }

  public setSetup = (setupConfig: SetupConfigType) => {
    const {setupOption, url, files} = setupConfig;
    this.setupOption = setupOption;
    
    if (this.setupOption === 0) {
      if (url) {this.url = url}
      this.dispatch({
        type: "UPDATE_URL",
        url: this.url
      })
    } else {
      if (files) {this.files = files}
      this.dispatch({
        type: "UPDATE_FILE",
        files: this.files
      })
    }
  }

  public setLayout = (value: string) => {
    this.layout = value;
    this.dispatch({
      type: "UPDATE_LAYOUT",
      layout: this.layout
    })
  }
}

export default AppModel;