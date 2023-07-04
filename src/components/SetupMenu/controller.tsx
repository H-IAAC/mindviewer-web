import { useReducer } from 'react';
import SetupMenuProps from '../../@types/SetupMenuProps';
import SetupMenuViewProps from '../../@types/SetupMenuViewProps';
import SetupMenuModel from './model';
import SetupMenuView from './view';

// Initial state for SetupMenu
const initialSetupMenuState = { 
  selectedOption: 0,
  stage: 0
};

// Reducer for SetupMenu
const reducerSetupMenu = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_SELECTED_OPTION':
      return { 
        ...state, 
        selectedOption: action.selectedOption
      };
    case 'UPDATE_STAGE':
      return { 
        ...state, 
        stage: action.stage
      };
    default:
      return state;
  }
}

// Controller for SetupMenu
const SetupMenuController = (props: SetupMenuProps) => {
  // Use of hooks
  const [setupMenuState, dispatch] = useReducer(reducerSetupMenu,initialSetupMenuState);

  // Creating instance of SetupMenu model
  const setupMenuModel = new SetupMenuModel(setupMenuState, dispatch);

  // Function that handle selected option action
  const handleSelectedOption = (option: number) => {
    setupMenuModel.setSelectedOption(option);
  }

  // Function that handle changing stage action
  const handleStage = (stage: number) => {
    setupMenuModel.setStage(stage);
  }

  // Function that handle url option action
  const handleUrlOption = (url: string) => {
    if (url.length !== 0) {
      setupMenuModel.saveUrlOption(url);
      props.handleSetup({
        setupOption: 0,
        url: url
      })
    }
  }

  // Function that handle file option action
  const handleFileOption = async (files: FileList|undefined) => {
    if (files) {
      const filesProcessed = await setupMenuModel.saveFileOption(files);
      props.handleSetup({
        setupOption: 1,
        files: filesProcessed
      })
    }
  }

  const setupMenuViewProps: SetupMenuViewProps = {
    setupMenuState: setupMenuState,
    handleSelectedOption: handleSelectedOption,
    handleStage: handleStage,
    handleUrlOption: handleUrlOption,
    handleFileOption: handleFileOption
  }
  
  return(
    <SetupMenuView 
      {...setupMenuViewProps}
    />
  )
}

export default SetupMenuController;