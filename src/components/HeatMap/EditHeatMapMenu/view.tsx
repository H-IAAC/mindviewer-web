import styles from './styles.module.css';
import './colorPickerStyles.css';

import DeleteIcon from '@mui/icons-material/Delete';
import { ColorPicker } from 'material-ui-color';

import { MenuItem, Select } from '@mui/material';
import GradientColorEditController from '../ColorManager/gradientColorEditController';
import CategoricalColorEditController from '../ColorManager/categoricalColorEditController';

const EditHeatMapMenuView = (props: any) => {
  const {
    tab,
    title,
    xLabelsEnabled,
    yLabelsEnabled,
    valueLabelEnabled,
    panZoomEnabled,
    tooltipEnabled,
    xCrossHairEnabled,
    yCrossHairEnabled,
    backgroundImageEnabled,
    markerShape,
    markerSize,
    colorRangeType
  } = props.editHeatMapMenuState;
  const {
    handleEditHeatMapMenu
  } = props.chartActionsProps;
  const {
    handleSaveEdits,
    handleUpdateInfo,
    colorManager
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
            Cores
          </button>
        </div>
        <div className={styles.section} style={{display: tab !== 0? 'none':'flex'}}>
          <div className={styles.sectionDiv}>
            <label htmlFor="title">Título:</label>
            <input id="title" value={title} onChange={(e) => handleUpdateInfo("title", e.target.value)}/>
          </div>
          <div className={styles.sectionDiv}>
            <input type="checkbox" id="xLabelsEnabled" checked={xLabelsEnabled} onChange={() => handleUpdateInfo("xLabelsEnabled", xLabelsEnabled? false:true)}/>
            <label htmlFor="xLabelsEnabled">Mostrar eixo X</label>
          </div>
          <div className={styles.sectionDiv}>
            <input type="checkbox" id="yLabelsEnabled" checked={yLabelsEnabled} onChange={() => handleUpdateInfo("yLabelsEnabled", yLabelsEnabled? false:true)}/>
            <label htmlFor="yLabelsEnabled">Mostrar eixo Y</label>
          </div>
          <div className={styles.sectionDiv}>
            <input type="checkbox" id="valueLabelEnabled" checked={valueLabelEnabled} onChange={() => handleUpdateInfo("valueLabelEnabled", valueLabelEnabled? false:true)}/>
            <label htmlFor="valueLabelEnabled">Mostrar valor da célula</label>
          </div>
          <div className={styles.sectionDiv}>
            <input type="checkbox" id="panZoomEnabled" checked={panZoomEnabled} onChange={() => handleUpdateInfo("panZoomEnabled", panZoomEnabled? false:true)}/>
            <label htmlFor="panZoomEnabled">Habilitar zoom e pan</label>
          </div>
          <div className={styles.sectionDiv}>
            <input type="checkbox" id="tooltipEnabled" checked={tooltipEnabled} onChange={() => handleUpdateInfo("tooltipEnabled", tooltipEnabled? false:true)}/>
            <label htmlFor="tooltipEnabled">Habilitar tooltip</label>
          </div>
          <div className={styles.sectionDiv}>
            <input type="checkbox" id="xCrossHairEnabled" checked={xCrossHairEnabled} onChange={() => handleUpdateInfo("xCrossHairEnabled", xCrossHairEnabled? false:true)}/>
            <label htmlFor="xCrossHairEnabled">Habilitar crosshair no eixo X</label>
          </div>
          <div className={styles.sectionDiv}>
            <input type="checkbox" id="yCrossHairEnabled" checked={yCrossHairEnabled} onChange={() => handleUpdateInfo("yCrossHairEnabled", yCrossHairEnabled? false:true)}/>
            <label htmlFor="yCrossHairEnabled">Habilitar crosshair no eixo Y</label>
          </div>
          <div className={styles.sectionDiv}>
            <input type="checkbox" id="backgroundImageEnabled" checked={backgroundImageEnabled} onChange={() => handleUpdateInfo("backgroundImageEnabled", backgroundImageEnabled? false:true)}/>
            <label htmlFor="backgroundImageEnabled">Habilitar imagem de fundo</label>
          </div>
          <div className={styles.sectionDiv}>
            <label htmlFor="markerShape">Formato da célula:</label>
            <select name="markerShape" id="markerShape" className={styles.timeUnit} value={markerShape} onChange={(e) => handleUpdateInfo("markerShape", e.target.value)}>
              <option value="rect">Retângulo</option>
              <option value="roundedRect">Arredondado</option>
              <option value="circle">Círculo</option>
              <option value="triangle">Triângulo</option>
            </select>
          </div>
          <div className={styles.sectionDiv}>
            <label htmlFor="markerSize">Tamanho da célula:</label>
            <input id="markerSize" value={markerSize ?? ""} onChange={(e) => handleUpdateInfo("markerSize", e.target.value)}/>
            <p>pixels</p>
          </div>
          {/* <div className={`${styles.xInterval} ${styles.sectionDiv}`} style={{display: type === 'bar'? 'none':'flex'}}>
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
          </div> */}
        </div>
        <div className={styles.section} style={{display: tab !== 1? 'none':'flex'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
            <div className={styles.sectionDiv}>
              <h1>Tipo de range:</h1>
              <input 
                type="checkbox" 
                id="gradient" 
                checked={colorRangeType==="gradient"} 
                onChange={() => handleUpdateInfo("colorRangeType", "gradient")}
                style={{marginLeft: '15px'}}
              />
              <label htmlFor="gradient">Gradiente</label>
              <input 
                type="checkbox" 
                id="categorical" 
                checked={colorRangeType==="categorical"} 
                onChange={() => handleUpdateInfo("colorRangeType", "categorical")}
                style={{marginLeft: '15px'}}
              />
              <label htmlFor="categorical">Categórico</label>
            </div>
          </div>
          {colorRangeType==="gradient"
            ? <GradientColorEditController model={colorManager.gradient}/>
            : <CategoricalColorEditController model={colorManager.categorical}/>
          }
          {/* <div style={{display: 'flex', alignItems: 'center'}}>
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
          </ul> */}
        </div>
        <div className={styles.bottomButtons}>
          <button className={styles.cancelButton} onClick={() => handleEditHeatMapMenu(false)}>Cancelar</button>
          <button className={styles.confirmButton} onClick={handleSaveEdits}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

export default EditHeatMapMenuView;