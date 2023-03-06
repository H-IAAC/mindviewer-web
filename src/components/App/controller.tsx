import { useEffect, useReducer } from 'react';
import AppModel from './model';
import AppView from './view';
import SetupConfigType from '../../@types/SetupConfigType';
import AppViewProps from '../../@types/AppViewProps';

const initialAppState = { 
  connectionActive: false,
  initialTime: (new Date()).getTime(),
  inSetup: true,
  setupOption: 0,
  url: "",
  files: [],
  layout: "default"
};

const reducerApp = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_URL':
      return { 
        ...state, 
        setupOption: 0, 
        url: action.url,
        inSetup: false 
      };
    case 'UPDATE_FILE':
      return { 
        ...state, 
        setupOption: 1, 
        files: action.files,
        inSetup: false 
      };
    case 'UPDATE_CONNECTION':
      return {
        ...state,
        connectionActive: action.connectionActive
      };
    case 'UPDATE_LAYOUT':
      return {
        ...state,
        layout: action.layout
      }
    default:
      return state;
  }
}

const AppController = () => {
  const [appState, dispatch] = useReducer(reducerApp,initialAppState);
  const appModel = new AppModel(appState, dispatch);

  useEffect(() => {
    appModel.initApp();
  },[])

  const handleConnectionActive = (value: boolean) => {
    appModel.setConnectionActive(value)
  }

  const handleSetup = (setupConfig: SetupConfigType) => {
    appModel.setSetup(setupConfig);
  }

  const handleLayout = (newLayout: string) => {
    appModel.setLayout(newLayout);
  }

  const appViewProps: AppViewProps = {
    appState,
    handleConnectionActive,
    handleSetup,
    handleLayout
  }
  
  return(
    <AppView 
      {...appViewProps}
    />
  )
}

export default AppController;