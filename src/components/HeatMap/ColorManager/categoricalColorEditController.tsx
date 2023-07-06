import { useEffect, useReducer } from "react";
import CategoricalColorEditView from "./categoricalColorEditView";
import CategoricalColorRange from "./categoricalColorRange";

// Initial state for EditController
const initialEditControllerState = {
  colorIntervals: [],
  legendBar: undefined
}

// Reducer for EditController
const reducerEditController = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_COLORINTERVALS':
      return {
        ...state,
        colorIntervals: action.intervals,
        legendBar: action.legendBar
      }
    default:
      return state;
  }
}  

// Controller for CategoricalColorEdit
const CategoricalColorEditController = (props: any) => {
  // Use of hooks
  const [editControllerState, dispatch] = useReducer(reducerEditController,initialEditControllerState);

  // Getting model
  const colorModel: CategoricalColorRange = props.model;

  // Initializing model
  useEffect(() => {
    colorModel.setDispatch(dispatch);
  },[])

  // Function that handle updating interval action
  const handleUpdateInterval = (index: number, info: { min: string; max: string; color: string;}) => {
    colorModel.update(index, info);
  }

  // Function that handle removing interval action
  const handleRemoveInterval = (index: number) => {
    colorModel.remove(index);
  }

  // Function that handle adding interval action
  const handleAddInterval = () => {
    colorModel.add();
  }

  const categoricalColorEditViewProps = {
    editControllerState,
    handleUpdateInterval,
    handleRemoveInterval,
    handleAddInterval
  }

  return(
    <CategoricalColorEditView
      {...categoricalColorEditViewProps}
    />
  )
}

export default CategoricalColorEditController;