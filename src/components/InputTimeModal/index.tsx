import InputTimeModalProps from "../../@types/InputTimeModalProps";
import InputTimeModalController from "./controller";

const InputTimeModal = (props: InputTimeModalProps) => {
  return(
    <InputTimeModalController
      {...props}
    />
  )
}

export default InputTimeModal;