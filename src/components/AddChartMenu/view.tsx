
import AddChartMenuViewProps from '../../@types/AddChartMenuViewProps';
import styles from './styles.module.css';

const AddChartMenuView = (props: AddChartMenuViewProps) => {
  const {
    handleSubmit,
    handleUpdateInfo
  } = props;
  const {
    tab,
    type,
    title,
    minXInterval,
    timeUnit,
    minY,
    maxY,
    autoRange,
    selectedChart
  } = props.addChartMenuState;
  const {
    treePanelState,
    handleCloseAddChartMenu
  } = props.addChartMenuProps

  return(
    <div className={styles.container}>
      <div className={styles.background}></div>
      <div className={styles.modal}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${tab === 0? styles.tabButtonActive : styles.tabButtonDisable}`} 
            onClick={() => {tab !== 0 && handleUpdateInfo("tab",0)}}
          >
            Novo gráfico
          </button>
          <button 
            className={`${styles.tabButton} ${tab === 1? styles.tabButtonActive : styles.tabButtonDisable}`}
            onClick={() => {tab !== 1 && handleUpdateInfo("tab",1)}}
          >
            Adicionar em um gráfico existente
          </button>
        </div>
        <div className={styles.section} style={{display: tab !== 0? 'none':'flex'}}>
          <div>
            <label htmlFor="title">Título:</label>
            <input id="title" value={title} onChange={(e) => handleUpdateInfo("title", e.target.value)}/>
          </div>
          <div>
            <label htmlFor="type">Tipo:</label>
            <select name="type" id="type" value={type} onChange={(e) => handleUpdateInfo("type", e.target.value)}>
              <option value="line">Linha</option>
              <option value="bar">Barra</option>
              <option value="lineForVector">Linha para vetor</option>
              <option value="barForVector">Barra para vetor</option>
              <option value="scatter">Ponto</option>
              <option value="heatMap">HeatMap</option>
              <option value="map">Mapa</option>
            </select>
          </div>
          <div className={styles.xInterval} style={{display: type === 'bar'? 'none':'flex'}}>
            <label htmlFor="minInterval">Intervalo do eixo horizontal:</label>
            <input type="number" id="minInterval" min={1} value={minXInterval} onChange={(e) => handleUpdateInfo("minXInterval", e.target.value)}/>
            <select name="timeUnit" id="timeUnit" className={styles.timeUnit} value={timeUnit} onChange={(e) => handleUpdateInfo("timeUnit", e.target.value)}>
              <option value="second">s</option>
              <option value="minute">min</option>
              <option value="hour">h</option>
            </select>
          </div>
          <div className={styles.yInterval}>
            <label htmlFor="yRange">Intervalo do eixo vertical:</label>
            <div style={{opacity: autoRange? 0.5 : 1, pointerEvents: autoRange? 'none' : 'all'}}>
              <input type="number" id="yRange" value={minY} onChange={(e) => handleUpdateInfo("minY", e.target.value)}/>
              <p>a</p>
              <input type="number" value={maxY} onChange={(e) => handleUpdateInfo("maxY", e.target.value)}/>
            </div>
            <div className={styles.autoRange}>
              <input type="checkbox" id="autorange" checked={autoRange} onChange={() => handleUpdateInfo("autoRange", autoRange? false:true)}/>
              <label htmlFor="autorange">Auto range</label>
            </div>
          </div>
        </div>
        <div className={styles.section} style={{display: tab !== 1? 'none':'flex'}}>
          {treePanelState.allCharts.map((item, index) => (
            <div key={index}>
              <input type="checkbox" id={`graph${index}`} checked={selectedChart === index} onChange={() => handleUpdateInfo("selectedChart", index)}/>
              <label htmlFor={`graph${index}`}>{item}</label>
            </div>
          ))}
        </div>
        <div className={styles.bottomButtons}>
          <button className={styles.cancelButton} onClick={handleCloseAddChartMenu}>Cancelar</button>
          <button className={styles.confirmButton} onClick={handleSubmit}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

export default AddChartMenuView;