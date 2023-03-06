import styles from "./styles.module.css";
import { ColorPicker } from "material-ui-color";

const CategoricalColorEditView = (props: any) => {
  const colorIntervals: {min: number, max: number, color: string}[] = props.editControllerState.colorIntervals;
  const legendBar = props.editControllerState.legendBar;
  const {
    handleUpdateInterval,
    handleRemoveInterval,
    handleAddInterval
  } = props;

  return(
    <div className={styles.container}>
      <div className={styles.config}>
        <h1>
          Configuração:
        </h1>
        <div>
          {
            colorIntervals.map((item, index) => (
              <div className={styles.item}>
                <p>
                  {index+1}º
                </p>
                <div className={styles.interval}>
                  <label htmlFor={`interval${index}`}>
                    Intervalo:
                  </label>
                  <div className={styles.intervalInputs}>
                    <input 
                      id={`interval${index}`}
                      value={item.min}
                      onChange={e => handleUpdateInterval(index, {...item, min: e.target.value})}
                    />
                    <p>
                      à
                    </p>
                    <input 
                      id={`interval2_${index}`}
                      value={item.max}
                      onChange={e => handleUpdateInterval(index, {...item, max: e.target.value})}
                    />
                  </div>
                </div>
                <div className={styles.color}>
                  <label htmlFor={`color${index}`}>
                    Cor:
                  </label>
                  <ColorPicker 
                    value={item.color}
                    onChange={color => handleUpdateInterval(index, {...item, color: `#${color.hex}`})}
                    //hideTextfield
                  />
                </div>
                {index !== 0 &&
                  <div className={styles.removeButton}>
                    <button
                      onClick={() => handleRemoveInterval(index)}
                    >
                      X
                    </button>
                  </div>
                }
              </div>
            ))
          }
        </div>
        <div className={styles.addButton}>
          <button
            onClick={handleAddInterval}
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.preview}>
        <h1>
          Prévia:
        </h1>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '20px 0'
        }}>
          {legendBar}
        </div>
      </div>
    </div>
  )
}

export default CategoricalColorEditView;