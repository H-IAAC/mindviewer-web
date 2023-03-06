import { useReducer } from 'react';
import {useTranslation} from "react-i18next";
import HeaderProps from '../../@types/HeaderProps';
import HeaderViewProps from '../../@types/HeaderViewProps';
import HeaderModel from './model';
import HeaderView from './view';

const initialHeaderState = { 
  menuView: false,
  languageMenuView: false,
  languageActive: "pt-BR",
  layoutMenuView: false
};

const reducerHeader = (state: any, action: any) => {
  switch (action.type) {
    case 'OPEN_MENU':
      return { 
        ...state, 
        menuView: true,
        languageMenuView: false,
        layoutMenuView: false
      };
    case 'CLOSE_MENU':
      return { 
        ...state, 
        menuView: false,
        languageMenuView: false,
        layoutMenuView: false
      };
    case 'OPEN_LANGUAGE_MENU':
      return {
        ...state,
        languageMenuView: true
      };
    case 'CLOSE_LANGUAGE_MENU':
      return {
        ...state,
        languageMenuView: false
      };
    case 'OPEN_LAYOUT_MENU':
      return {
        ...state,
        layoutMenuView: true
      };
    case 'CLOSE_LAYOUT_MENU':
      return {
        ...state,
        layoutMenuView: false
      };
    case 'UPDATE_LANGUAGE':
      return {
        ...state,
        languageActive: action.language
      }
    default:
      return state;
  }
}

const HeaderController = (props: HeaderProps) => {
  const [headerState, dispatch] = useReducer(reducerHeader,initialHeaderState);
  const headerModel = new HeaderModel(headerState, dispatch);
  const { i18n } = useTranslation();

  const handleMenuView = () => {
    headerModel.updateMenuView();
  }

  const handleLanguageMenuView = (value?: boolean) => {
    headerModel.updateLanguageMenuView(value);
  }

  const handleLayoutMenuView = (value?: boolean) => {
    headerModel.updateLayoutMenuView(value);
  }

  const handleChangingLanguage = (lang: string) => {
    headerModel.setLanguage(i18n, lang);
  }

  const handleResetLocalStorage = () => {
    headerModel.resetLocalStorage();
  }

  const headerViewProps: HeaderViewProps = {
    headerState,
    handleMenuView,
    handleLanguageMenuView,
    handleLayoutMenuView,
    handleChangingLanguage,
    handleResetLocalStorage,
    headerProps: props
  }

  return(
    <HeaderView
      {...headerViewProps}
    />
  )
} 

export default HeaderController;