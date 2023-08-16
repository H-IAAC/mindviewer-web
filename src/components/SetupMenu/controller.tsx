import { useReducer } from 'react';
import SetupMenuProps from '../../@types/SetupMenuProps';
import SetupMenuViewProps from '../../@types/SetupMenuViewProps';
import SetupMenuModel from './model';
import SetupMenuView from './view';
import SetupMenuUtils from './utils';

// Initial state for SetupMenu
const initialSetupMenuState = { 
  selectedOption: 0,
  stage: 0,
  errorMessage: null
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
    case 'UPDATE_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: action.errorMessage
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

  const setupMenuUtils = new SetupMenuUtils();

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
      // Push all files together
      const filesArray: Array<string> = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file size limit
        if (file.size > 5000000) {
          setupMenuModel.setErrorMessage("Error uploading file larger than 5Mb. (" + (file.size / 1000000).toFixed(2) + "Mb)");
          return;
        }

        // Validate files as JSON and convert to base64
        try {
          const content = await setupMenuUtils.readFile(file);
          JSON.parse(content);

          const base64 = await setupMenuUtils.getBase64FromFile(file);
          filesArray.push(base64);

        } catch (e: any) {
          setupMenuModel.setErrorMessage(e.message);
          // Stop process
          return;
        }
      }

      // Store file in the localStorage
      if (await setupMenuModel.saveFileOption(filesArray)) {
        props.handleSetup({
          setupOption: 1,
          files: filesArray
        })
      }
    }
  }

  const setupMenuViewProps: SetupMenuViewProps = {
    setupMenuState: setupMenuState,
    handleSelectedOption: handleSelectedOption,
    handleStage: handleStage,
    handleUrlOption: handleUrlOption,
    handleFileOption: handleFileOption,
    setErrorMsg: setupMenuModel.setErrorMessage
  }
  
  return(
    <SetupMenuView 
      {...setupMenuViewProps}
    />
  )
}

export default SetupMenuController;