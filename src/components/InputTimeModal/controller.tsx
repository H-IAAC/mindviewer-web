import { useEffect, useReducer, useState } from "react";
import InputTimeModalProps from "../../@types/InputTimeModalProps";
import InputTimeModalViewProps from "../../@types/InputTimeModalViewProps";
import InputTimeModalModel from "./model";
import InputTimeModalView from "./view";

const initialInputTimeModalState = { 
  day: 0,
  month: 0,
  year: 0,
  hour: 0,
  minute: 0,
  second: 0,
  milissecond: 0,
  warning: false
};

const reducerInputTimeModal = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_DAY':
      return { 
        ...state, 
        day: action.value
      };
    case 'UPDATE_MONTH':
      return { 
        ...state, 
        month: action.value
      };
    case 'UPDATE_YEAR':
      return { 
        ...state, 
        year: action.value
      };
    case 'UPDATE_HOUR':
      return { 
        ...state, 
        hour: action.value
      };
    case 'UPDATE_MINUTE':
      return { 
        ...state, 
        minute: action.value
      };
    case 'UPDATE_SECOND':
      return { 
        ...state, 
        second: action.value
      };
    case 'UPDATE_MILISSECOND':
      return { 
        ...state, 
        milissecond: action.value
      };
    case 'UPDATE_WARNING':
      return { 
        ...state, 
        warning: action.value
      };
    default:
      return state;
  }
}

const InputTimeModalController = (props: InputTimeModalProps) => {
  const {
    time,
    handleInputTime,
    handleInputTimeModal
  } = props;

  const [inputTimeModalState, dispatch] = useReducer(reducerInputTimeModal,initialInputTimeModalState);
  const inputTimeModalModel = InputTimeModalModel.getInstance();

  useEffect(() => {
    inputTimeModalModel.init(dispatch);

    const [dateAux, hourAux] = time.split(" ");
    const [dayAux, monthAux, yearAux] = dateAux.split("/");
    const [hourAux1, minuteAux, secondAux] = hourAux.split(":");
    const [secondAux1, milissecondAux] = secondAux.split(".");

    inputTimeModalModel.setDay(parseInt(dayAux));
    inputTimeModalModel.setMonth(parseInt(monthAux));
    inputTimeModalModel.setYear(parseInt(yearAux));
    inputTimeModalModel.setHour(parseInt(hourAux1));
    inputTimeModalModel.setMinute(parseInt(minuteAux));
    inputTimeModalModel.setSecond(parseInt(secondAux1));
    inputTimeModalModel.setMilissecond(parseInt(milissecondAux));
  },[])

  const handleTime = () => {
    const date = inputTimeModalModel.getTime();

    if (date) {
      handleInputTime(date);
      handleCloseModal();
    }
  }

  const handleUpdateInfo = (idInfo: string, value: any) => {
    switch (idInfo) {
      case "day":
        inputTimeModalModel.setDay(value);
        break;
      case "month":
        inputTimeModalModel.setMonth(value);
        break;
      case "year":
        inputTimeModalModel.setYear(value);
        break;
      case "hour":
        inputTimeModalModel.setHour(value);
        break;
      case "minute":
        inputTimeModalModel.setMinute(value);
        break;
      case "second":
        inputTimeModalModel.setSecond(value);
        break;
      case "milissecond":
        inputTimeModalModel.setMilissecond(value);
        break;
      default:
        break;
    }
  }

  const handleCloseModal = () => {
    handleInputTimeModal(false);
  }

  const inputTimeModalViewProps: InputTimeModalViewProps = {
    inputTimeModalState,
    handleTime,
    handleUpdateInfo,
    handleCloseModal
  }

  return(
    <InputTimeModalView
      {...inputTimeModalViewProps}
    />
  )
}

export default InputTimeModalController;