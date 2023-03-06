import InputTimeModalViewProps from "../../@types/InputTimeModalViewProps";
import styles from "./styles.module.css";

const InputTimeModalView = (props: InputTimeModalViewProps) => {
  const {
    day,
    month,
    year,
    hour,
    minute,
    second,
    milissecond,
    warning
  } = props.inputTimeModalState;
  const {
    handleTime,
    handleUpdateInfo,
    handleCloseModal
  } = props;

  return(
    <div className={styles.inputTimeModalContainer}>
      <div className={styles.background}></div>
      <div className={styles.modal}>
        <div className={styles.title}>
          <h1>Insira o tempo desejado</h1>
        </div>
        <div className={styles.inputSection}>
          <label>Dia:</label>
          <input type="number" min={1} max={31} value={day} onChange={e => handleUpdateInfo("day", e.target.valueAsNumber)}/>
          <p>/</p>
          <input type="number" min={1} max={12} value={month} onChange={e => handleUpdateInfo("month", e.target.valueAsNumber)}/>
          <p>/</p>
          <input type="number" value={year} onChange={e => handleUpdateInfo("year", e.target.valueAsNumber)}/>
        </div>
        <div className={styles.inputSection}>
          <label>Hora:</label>
          <input type="number" min={0} max={23} value={hour} onChange={e => handleUpdateInfo("hour", e.target.valueAsNumber)}/>
          <p>:</p>
          <input type="number" min={0} max={59} value={minute} onChange={e => handleUpdateInfo("minute", e.target.valueAsNumber)}/>
          <p>:</p>
          <input type="number" min={0} max={59} value={second} onChange={e => handleUpdateInfo("second", e.target.valueAsNumber)}/>
        </div>
        <div className={styles.inputSection}>
          <label style={{width: "115px"}}>Milissegundos:</label>
          <input type="number" min={0} max={999} value={milissecond} onChange={e => handleUpdateInfo("milissecond", e.target.valueAsNumber)}/>
        </div>
        <div className={styles.warning}>
          {warning &&
            <span>
              Insira uma data válida!
            </span>
          }
        </div>
        <div className={styles.bottomButtons}>
          <button className={styles.cancelButton} onClick={handleCloseModal}>Cancelar</button>
          <button className={styles.confirmButton} onClick={handleTime}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

export default InputTimeModalView;