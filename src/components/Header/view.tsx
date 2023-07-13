import styles from './styles.module.css';

import SettingsIcon from '@mui/icons-material/Settings';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import {Trans} from "react-i18next";
import HeaderViewProps from '../../@types/HeaderViewProps';

const HeaderView = (props: HeaderViewProps) => {
  const {
    menuView,
    languageMenuView,
    layoutMenuView
  } = props.headerState;
  const {
    handleMenuView,
    handleLanguageMenuView,
    handleLayoutMenuView,
    handleChangingLanguage,
    handleResetLocalStorage
  } = props;
  const {
    connectionActive,
    setupOption,
    inSetup
  } = props.headerProps.appState;
  const {
    handleConnectionActive,
    handleLayout
  } = props.headerProps;

  return(      
    <div className={styles.header}>
      <h1>
        <Trans i18nKey={"title"}>
          VisualizadorErro
        </Trans>
      </h1>
      <button onClick={handleMenuView}>
        <SettingsIcon style={{color: '#fff', fontSize: 30}} />
      </button>
      {menuView &&
        <>
          <div style={{position: 'absolute', width: '100%', height: '100vh', top:0,left:0}} onClick={handleMenuView}/>
          <div className={styles.menuPaper}>
            <MenuList className={styles.menuList}>
              {/* Dependendo do estado da conexão, o menu apresenta uma determinada ação (interromper ou ativar) */}
              {connectionActive?
                <MenuItem 
                  className={styles.menuItemText} 
                  onClick={() => {
                    handleLanguageMenuView(false);
                    handleConnectionActive(false)
                  }}
                  disabled={setupOption===1 || inSetup}
                >
                  <Trans i18nKey={"connection.stop"}>
                    Interromper conexão
                  </Trans>
                </MenuItem>
                :
                <MenuItem 
                  className={styles.menuItemText} 
                  onClick={() => {
                    handleLanguageMenuView(false);
                    handleConnectionActive(true)
                  }}
                  disabled={setupOption===1 || inSetup}
                >
                  <Trans i18nKey={"connection.start"}>
                    Ativar conexão
                  </Trans>
                </MenuItem>
              }
              <MenuItem 
                className={styles.menuItemText} 
                onClick={() => {
                  handleLanguageMenuView();
                }}
              >
                <Trans i18nKey={"language"}>
                  Idioma
                </Trans>
              </MenuItem>
              {languageMenuView &&
                <div className={styles.languageMenuPaper}>
                  <MenuList className={styles.menuList}>
                    <MenuItem 
                      className={styles.menuItemText} 
                      onClick={() => {
                        handleChangingLanguage("pt-BR");
                      }}
                    >
                      pt-BR
                    </MenuItem>
                    <MenuItem 
                      className={styles.menuItemText} 
                      onClick={() => {
                        handleChangingLanguage("en");
                      }}
                    >
                      en
                    </MenuItem>
                  </MenuList>
                </div>
              }
              <MenuItem 
                className={styles.menuItemText} 
                onClick={() => { 
                  handleLayoutMenuView();
                }}
              >
                Layout
              </MenuItem>
              {layoutMenuView &&
                <div className={styles.languageMenuPaper}>
                  <MenuList className={styles.menuList}>
                    <MenuItem 
                      className={styles.menuItemText} 
                      onClick={() => {
                        handleLayout("default");
                      }}
                    >
                      default
                    </MenuItem>
                    <MenuItem 
                      className={styles.menuItemText} 
                      onClick={() => {
                        handleLayout("vertical");
                      }}
                    >
                      vertical
                    </MenuItem>
                    <MenuItem 
                      className={styles.menuItemText} 
                      onClick={() => {
                        handleLayout("horizontal");
                      }}
                    >
                      horizontal
                    </MenuItem>
                    <MenuItem 
                      className={styles.menuItemText} 
                      onClick={() => {
                        handleLayout("fourPanels");
                      }}
                    >
                      grade
                    </MenuItem>
                  </MenuList>
                </div>
              }
              <MenuItem 
                className={styles.menuItemText} 
                onClick={() => { 
                  handleResetLocalStorage();
                }}
              >
                <Trans i18nKey={"reset"}>
                  Restaurar
                </Trans>
              </MenuItem>
            </MenuList>
          </div>
        </>
      }
    </div>
  )
}

export default HeaderView;