import HeaderModelType from "../@types/HeaderModelType";
import HeaderProps from "./HeaderProps";

type HeaderViewProps = {
  headerState: HeaderModelType,
  handleMenuView: () => void,
  handleLanguageMenuView: (value?: boolean) => void,
  handleLayoutMenuView: (value?: boolean) => void,
  handleChangingLanguage: (lang: string) => void,
  handleResetLocalStorage: () => void,
  headerProps: HeaderProps
}

export default HeaderViewProps;