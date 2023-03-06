import { useReducer } from 'react';
import SetupMenuProps from '../../@types/SetupMenuProps';
import SetupMenuViewProps from '../../@types/SetupMenuViewProps';
import SetupMenuModel from './model';
import SetupMenuView from './view';

const initialSetupMenuState = { 
  selectedOption: 0,
  stage: 0
};

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

const SetupMenuController = (props: SetupMenuProps) => {
  const [setupMenuState, dispatch] = useReducer(reducerSetupMenu,initialSetupMenuState);
  const setupMenuModel = new SetupMenuModel(setupMenuState, dispatch);

  const handleSelectedOption = (option: number) => {
    setupMenuModel.setSelectedOption(option);
  }

  const handleStage = (stage: number) => {
    setupMenuModel.setStage(stage);
  }

  const handleUrlOption = (url: string) => {
    if (url.length !== 0) {
      setupMenuModel.saveUrlOption(url);
      props.handleSetup({
        setupOption: 0,
        url: url
      })
    }
  }

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