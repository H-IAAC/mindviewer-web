import { useEffect, useReducer } from "react";
import CategoricalColorEditView from "./categoricalColorEditView";
import CategoricalColorRange from "./categoricalColorRange";

const initialEditControllerState = {
  colorIntervals: [],
  legendBar: undefined
}

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

const CategoricalColorEditController = (props: any) => {
  
  const [editControllerState, dispatch] = useReducer(reducerEditController,initialEditControllerState);
  const colorModel: CategoricalColorRange = props.model;

  useEffect(() => {
    colorModel.setDispatch(dispatch);
  },[])

  const handleUpdateInterval = (index: number, info: { min: string; max: string; color: string;}) => {
    colorModel.update(index, info);
  }

  const handleRemoveInterval = (index: number) => {
    colorModel.remove(index);
  }

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