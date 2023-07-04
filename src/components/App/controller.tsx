import { useEffect, useReducer } from 'react';
import AppModel from './model';
import AppView from './view';
import SetupConfigType from '../../@types/SetupConfigType';
import AppViewProps from '../../@types/AppViewProps';

// Initial state for App
const initialAppState = { 
  connectionActive: false,
  initialTime: (new Date()).getTime(),
  inSetup: true,
  setupOption: 0,
  url: "",
  files: [],
  layout: "default"
};

// Reducer for App
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

// Controller for App
const AppController = () => {
  // Use of hooks
  const [appState, dispatch] = useReducer(reducerApp,initialAppState);

  // Creating AppModel instance
  const appModel = new AppModel(appState, dispatch);

  // Initiating AppModel
  useEffect(() => {
    appModel.initApp();
  },[])

  // Function that handle connection active action
  const handleConnectionActive = (value: boolean) => {
    appModel.setConnectionActive(value)
  }

  // Function that handle setup action
  const handleSetup = (setupConfig: SetupConfigType) => {
    appModel.setSetup(setupConfig);
  }

  // Function that handle layout action
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