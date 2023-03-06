import styles from './styles.module.css';
import './colorPickerStyles.css';

import DeleteIcon from '@material-ui/icons/Delete';
import { ColorPicker } from 'material-ui-color';

import { MenuItem, Select } from '@material-ui/core';
import ColorPalettes from '../../../utils/ColorPalettes';

const EditMapMenuView = (props: any) => {
  const {
    tab,
    title,
    tooltipEnabled,
    elements,
    elementsColors,
    selectedElements,
    palette,
  } = props.editMapMenuState;
  const {
    handleEditMapMenu
  } = props.chartActionsProps;
  const {
    handleSaveEdits,
    handleUpdateInfo,
    handleColor,
    handleConfirmPalette
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
          <div className={styles.sectionDiv}>
            <input type="checkbox" id="tooltipEnabled" checked={tooltipEnabled} onChange={() => handleUpdateInfo("tooltipEnabled", tooltipEnabled? false:true)}/>
            <label htmlFor="tooltipEnabled">Habilitar tooltip</label>
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
            {elements.map((item: any, index: number) => (
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
          <button className={styles.cancelButton} onClick={() => handleEditMapMenu(false)}>Cancelar</button>
          <button className={styles.confirmButton} onClick={handleSaveEdits}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

export default EditMapMenuView;