import { useEffect, useReducer } from "react";
import GradientColorEditView from "./gradientColorEditView";
import GradientColorRange from "./gradientColorRange";

const initialEditControllerState = {
  breakPoints: [],
  legendBar: undefined
}

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

const GradientColorEditController = (props: any) => {

  const [editControllerState, dispatch] = useReducer(reducerEditController,initialEditControllerState);
  const colorModel: GradientColorRange = props.model;

  useEffect(() => {
    colorModel.setDispatch(dispatch);
  },[])
  
  const handleUpdateBreakpoint= (index: number, info: {value: string, color: string}) => {
    colorModel.update(index, info);
  }

  const handleRemoveBreakpoint= (index: number) => {
    colorModel.remove(index);
  }

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