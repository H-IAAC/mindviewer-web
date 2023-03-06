import styles from "./styles.module.css";
import { ColorPicker } from "material-ui-color";

const GradientColorEditView = (props: any) => {
  const breakPoints: {value: number, color: string}[] = props.editControllerState.breakPoints;
  const legendBar = props.editControllerState.legendBar;
  const {
    handleUpdateBreakpoint,
    handleRemoveBreakpoint,
    handleAddBreakpoint
  } = props;
  
  return(
    <div className={styles.container}>
      <div className={styles.config}>
        <h1>
          Configuração:
        </h1>
        <div>
          {
            breakPoints.map((item, index) => (
              <div className={styles.item}>
                <p>
                  {index === 0
                      ? "MIN"
                      : index === breakPoints.length-1
                        ? "MAX"
                        : ""
                  }
                </p>
                <div className={styles.value}>
                  <label htmlFor={`value${index}`}>
                    Valor:
                  </label>
                  <input 
                    id={`value${index}`}
                    value={item.value}
                    onChange={e => handleUpdateBreakpoint(index, {...item, value: e.target.value})}
                  />
                </div>
                <div className={styles.color}>
                  <label htmlFor={`color${index}`}>
                    Cor:
                  </label>
                  <ColorPicker 
                    value={item.color}
                    onChange={color => handleUpdateBreakpoint(index, {...item, color: `#${color.hex}`})}
                    //hideTextfield
                  />
                </div>
                {index !== 0 && index !== breakPoints.length-1 &&
                  <div className={styles.removeButton}>
                    <button
                      onClick={() => handleRemoveBreakpoint(index)}
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
            onClick={handleAddBreakpoint}
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.preview}>
        <h1>
          Prévia:
        </h1>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px 0'
          }}
        >
          {legendBar}
        </div>
      </div>
    </div>
  )
}

export default GradientColorEditView;