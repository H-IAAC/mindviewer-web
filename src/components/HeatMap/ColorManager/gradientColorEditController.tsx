import { useEffect, useReducer } from "react";
import GradientColorEditView from "./gradientColorEditView";
import GradientColorRange from "./gradientColorRange";

// Initial state for EditController
const initialEditControllerState = {
  breakPoints: [],
  legendBar: undefined
}

// Reducer for EditController
const reducerEditController = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_BREAKPOINTS':
      return {
        ...state,
        breakPoints: action.breakPoints,
        legendBar: action.legendBar
      }
    default:
      return state;
  }
}

// Controller for GradientColorEdit
const GradientColorEditController = (props: any) => {
  // Use of hooks
  const [editControllerState, dispatch] = useReducer(reducerEditController,initialEditControllerState);

  // Getting model
  const colorModel: GradientColorRange = props.model;

  // Initializing model
  useEffect(() => {
    colorModel.setDispatch(dispatch);
  },[])
  
  // Function that handle updating breakpoint action
  const handleUpdateBreakpoint= (index: number, info: {value: string, color: string}) => {
    colorModel.update(index, info);
  }

  // Function that handle removing breakpoint action
  const handleRemoveBreakpoint= (index: number) => {
    colorModel.remove(index);
  }

  // Function that handle adding breakpoint action
  const handleAddBreakpoint= () => {
    colorModel.add();
  }

  const gradientColorEditViewProps = {
    editControllerState,
    handleUpdateBreakpoint,
    handleRemoveBreakpoint,
    handleAddBreakpoint
  }

  return(
    <GradientColorEditView
      {...gradientColorEditViewProps}
    />
  )
}

export default GradientColorEditController;