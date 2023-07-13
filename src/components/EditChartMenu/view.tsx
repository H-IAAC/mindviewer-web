import styles from './styles.module.css';
import './colorPickerStyles.css';

import DeleteIcon from '@mui/icons-material/Delete';
import { ColorPicker } from 'material-ui-color';

import ColorPalettes from '../../utils/ColorPalettes';
import { MenuItem, Select } from '@mui/material';
import EditChartMenuViewProps from '../../@types/EditChartMenuViewProps';

const EditChartMenuView = (props: EditChartMenuViewProps) => {
  const {
    type,
    tab,
    title,
    minXInterval,
    timeUnit,
    minY,
    maxY,
    autoRange,
    elements,
    elementsColors,
    selectedElements,
    palette,
    showYAxisGrid
  } = props.editChartMenuState;
  const {
    handleEditChartMenu
  } = props.chartActionsProps;
  const {
    handleSaveEdits,
    handleColor,
    handleConfirmPalette,
    handleUpdateInfo
  } = props;

  return(
    <div className={styles.container}>
      <div className={styles.background}></div>
      <div className={styles.modal}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${tab === 0? styles.tabButtonActive : styles.tabButtonDisable}`} 
            onClick={() => {tab !== 0 && handleUpdateInfo("tab", 0)}}
          >
            Parâmetros
          </button>
          <button 
            className={`${styles.tabButton} ${tab === 1? styles.tabButtonActive : styles.tabButtonDisable}`}
            onClick={() => {tab !== 1 && handleUpdateInfo("tab", 1)}}
          >
            Elementos
          </button>
        </div>
        <div className={styles.section} style={{display: tab !== 0? 'none':'flex'}}>
          <div className={styles.sectionDiv}>
            <label htmlFor="title">Título:</label>
            <input id="title" value={title} onChange={(e) => handleUpdateInfo("title", e.target.value)}/>
          </div>
          <div className={`${styles.xInterval} ${styles.sectionDiv}`} style={{display: type === 'bar'? 'none':'flex'}}>
            <label htmlFor="minInterval">Intervalo do eixo horizontal:</label>
            <input type="number" id="minInterval" min={1} value={minXInterval} onChange={(e) => handleUpdateInfo("minXInterval", e.target.value)}/>
            <select name="timeUnit" id="timeUnit" className={styles.timeUnit} value={timeUnit} onChange={(e) => handleUpdateInfo("timeUnit", e.target.value)}>
              <option value="second">s</option>
              <option value="minute">min</option>
              <option value="hour">h</option>
            </select>
          </div>
          <div className={`${styles.yInterval} ${styles.sectionDiv}`}>
            <label htmlFor="yRange">Intervalo do eixo vertical:</label>
            <div className={styles.sectionDiv} style={{opacity: autoRange? 0.5 : 1, pointerEvents: autoRange? 'none' : 'all'}}>
              <input type="number" id="yRange" value={minY} onChange={(e) => handleUpdateInfo("minY", e.target.value)}/>
              <p>a</p>
              <input type="number" value={maxY} onChange={(e) => handleUpdateInfo("maxY", e.target.value)}/>
            </div>
            <div className={`${styles.autoRange} ${styles.sectionDiv}`}>
              <input type="checkbox" id="autorange" checked={autoRange} onChange={() => handleUpdateInfo("autoRange", autoRange? false:true)}/>
              <label htmlFor="autorange">Auto range</label>
            </div>
          </div>
          <div className={`${styles.showAxisGrid} ${styles.sectionDiv}`}>
            <input type="checkbox" id="showAxisGrid" checked={showYAxisGrid} onChange={() => handleUpdateInfo("showYAxisGrid", showYAxisGrid? false:true)}/>
            <label htmlFor="showAxisGrid">Mostrar linhas do eixo y</label>
          </div>
        </div>
        <div className={styles.section} style={{display: tab !== 1? 'none':'flex'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <label htmlFor="palette">Selecione uma paleta de cores:</label>
            <div style={{margin: "5px"}}>
              <Select
                id="palette"
                onChange={e => handleUpdateInfo("palette", e.target.value as number < 0? undefined : ColorPalettes[e.target.value as number])}
                displayEmpty
                defaultValue={-1}
                style={{
                  border: '1px solid #999',
                  borderRadius: '9px',
                  padding: '5px 5px 0'
                }}
                // className={classes.selectEmpty}
                // inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={-1}>
                  <div style={{display: 'flex'}} >
                    Escolha uma opção
                  </div>
                  </MenuItem>
                {ColorPalettes.map((item, index) => (
                  <MenuItem value={index}>
                    <div style={{display: 'flex'}} >
                      {item.map(hex => (
                        <div style={{
                          backgroundColor: `#${hex}`,
                          width: "15px",
                          height: "15px"
                        }} />
                      ))}
                    </div>
                  </MenuItem>
                ))}
              </Select>
              <button 
                style={{
                  margin: "0 10px",
                  padding: "2px 10px",
                  borderRadius: "5px",
                  fontSize: "14px",
                  border: "solid 1px #999",
                  cursor: "pointer"
                }} 
                onClick={handleConfirmPalette} 
                disabled={palette === undefined}
              >
                Aplicar
              </button>
            </div>
          </div>
          <ul className={styles.elementsList}>
            {elements.map((item, index) => (
              <li key={index} style={{display: selectedElements.includes(index)? 'none':'flex'}}>
                <p>{index+1} - {item.label}</p>
                <ColorPicker 
                  value={`#${elementsColors[index]}`}
                  onChange={color => handleColor(color.hex, index)}
                  hideTextfield
                />
                <button onClick={() => {handleUpdateInfo("selectedElements", index)}}><DeleteIcon htmlColor={'#ff3030'}/></button>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.bottomButtons}>
          <button className={styles.cancelButton} onClick={() => handleEditChartMenu(false)}>Cancelar</button>
          <button className={styles.confirmButton} onClick={handleSaveEdits}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

export default EditChartMenuView;