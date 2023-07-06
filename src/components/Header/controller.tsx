import { useReducer } from 'react';
import {useTranslation} from "react-i18next";
import HeaderProps from '../../@types/HeaderProps';
import HeaderViewProps from '../../@types/HeaderViewProps';
import HeaderModel from './model';
import HeaderView from './view';

// Initial state for Header
const initialHeaderState = { 
  menuView: false,
  languageMenuView: false,
  languageActive: "pt-BR",
  layoutMenuView: false
};

// Reducer for Header
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

// Controller for Header
const HeaderController = (props: HeaderProps) => {
  // Use of hooks
  const [headerState, dispatch] = useReducer(reducerHeader,initialHeaderState);

  // Creating instance of Header model
  const headerModel = new HeaderModel(headerState, dispatch);

  // Getting translation component
  const { i18n } = useTranslation();

  // Function that handle MenuView action
  const handleMenuView = () => {
    headerModel.updateMenuView();
  }

  // Function that handle LanguageMenuView action
  const handleLanguageMenuView = (value?: boolean) => {
    headerModel.updateLanguageMenuView(value);
  }

  // Function that handle LayoutMenuView action
  const handleLayoutMenuView = (value?: boolean) => {
    headerModel.updateLayoutMenuView(value);
  }

  // Function that handle changing language action
  const handleChangingLanguage = (lang: string) => {
    headerModel.setLanguage(i18n, lang);
  }

  // Function that handle resetting LocalStorage action
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