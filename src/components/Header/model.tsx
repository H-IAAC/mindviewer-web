import { i18n } from "i18next";
import HeaderModelType from "../../@types/HeaderModelType";

class HeaderModel {
  /*
    menuView -> Váriavel booleana que indica se o menu está sendo visualizado;
  */
  private menuView: boolean;
  private languageMenuView: boolean;
  private layoutMenuView: boolean;
  private languageActive: string;
  private dispatch: React.Dispatch<any>;

  constructor (initialState: HeaderModelType, dispatch: React.Dispatch<any>) {
    this.menuView = initialState.menuView;
    this.languageMenuView = initialState.languageMenuView;
    this.languageActive = initialState.languageActive;
    this.layoutMenuView = initialState.layoutMenuView;
    this.dispatch = dispatch;
  }

  public updateMenuView = () => {
    if (this.menuView) {
      this.menuView = false;
      this.dispatch({type: "CLOSE_MENU"});
    } else {
      this.menuView = true;
      this.dispatch({type: "OPEN_MENU"});
    }
  }

  public updateLanguageMenuView = (value=true) => {
    if (value) {
      if (this.languageMenuView) {
        this.languageMenuView = false;
        this.dispatch({type: "CLOSE_LANGUAGE_MENU"});
      } else {
        this.languageMenuView = true;
        this.dispatch({type: "OPEN_LANGUAGE_MENU"});
      }
    } else {
      if (this.languageMenuView) {
        this.languageMenuView = false;
        this.dispatch({type: "CLOSE_LANGUAGE_MENU"});
      }
    }
  }

  public updateLayoutMenuView = (value=true) => {
    if (value) {
      if (this.layoutMenuView) {
        this.layoutMenuView = false;
        this.dispatch({type: "CLOSE_LAYOUT_MENU"});
      } else {
        this.layoutMenuView = true;
        this.dispatch({type: "OPEN_LAYOUT_MENU"});
      }
    } else {
      if (this.layoutMenuView) {
        this.layoutMenuView = false;
        this.dispatch({type: "CLOSE_LAYOUT_MENU"});
      }
    }
  }

  public setLanguage = (i18n: i18n, lang: string) => {
    this.languageActive = lang;
    i18n.changeLanguage(lang);
  }

  public resetLocalStorage = () => {
    localStorage.removeItem("@visualizador/setupOption");
    localStorage.removeItem("@visualizador/url");
    localStorage.removeItem("@visualizador/files");
    window.location.reload();
  }
}

export default HeaderModel;