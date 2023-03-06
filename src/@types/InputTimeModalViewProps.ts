import InputTimeModalModelType from "../@types/InputTimeModalModelType";

type InputTimeModalViewProps = {
  inputTimeModalState: InputTimeModalModelType,
  handleTime: () => void,
  handleUpdateInfo: (idInfo: string, value: any) => void,
  handleCloseModal: () => void
}

export default InputTimeModalViewProps;