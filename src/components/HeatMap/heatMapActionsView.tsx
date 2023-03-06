import styles from './styles1.module.css';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import HeatMapController from './heatMapController';
import InputTimeModal from '../InputTimeModal';
import EditHeatMapMenu from './EditHeatMapMenu';

const HeatMapActionsView = (props: any) => {
  const {
    enableRefresh,
    sliderValue,
    //sliderXAxisValue,
    editHeatMapMenu,
    time,
    inputTimeModal
  } = props.heatMapActionsState;
  const {
    handleEditHeatMapMenu,
    handleInputTimeModal,
    handleEnableRefresh,
    handleSlider,
    handleSliderStep,
    handleInputTime,
    handleXAxisChanged,
    handleScreenshot
  } = props;
  const {
    chart,
    chartId,
    removeChart,
    removeDataFromChart
  } = props.heatMapProps;

  return(
    <div className={styles.container}>
      <div className={styles.head}>
        <div className={styles.refreshButton}>
          <input id={`refresh${chartId}`} type="checkbox" checked={enableRefresh} onChange={() => handleEnableRefresh(!enableRefresh)}/>
          <label htmlFor={`refresh${chartId}`}>Auto-refresh</label>
        </div>
        <div className={styles.editButton}>
          <button onClick={() => handleEditHeatMapMenu(true)}>
            <EditIcon />
          </button>
        </div>
        <div className={styles.editButton}>
          <button onClick={() => handleScreenshot(`chart${chartId}`, chart.getTitle())}>
            Screen
          </button>
        </div>
        <div className={styles.closeButton}>
          <button onClick={() => removeChart(chartId)}>
            <CloseIcon />
          </button>
        </div>
      </div>
      <div 
        id={`chart${chartId}`} 
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <HeatMapController 
          {...props.heatMapProps}
        />
      </div>
      <div style={{display: 'flex'}}>
        <div className={styles.timeDisplay}>
          <input
            type="text"
            value={enableRefresh? chart.getTime(): time}
            onClick={() => handleInputTimeModal(true)}
            disabled={enableRefresh}
          />
        </div>
        <input
          type="range"
          value={sliderValue}
          onChange={(e) => handleSlider(e.target.value)}
          onKeyDown={e => handleSliderStep(e)}
          className={styles.slider}
          step={1}
          title={"Utilize as setas do teclado para um passo mais preciso."}
          disabled={enableRefresh}
        />
      </div>
      {editHeatMapMenu &&
        <EditHeatMapMenu
          chart={chart}
          chartId={chartId}
          handleEditHeatMapMenu={handleEditHeatMapMenu}
          removeDataFromChart={removeDataFromChart}
          handleXAxisChanged={handleXAxisChanged}
        />
      }
      {inputTimeModal &&
        <InputTimeModal
          handleInputTimeModal={handleInputTimeModal} 
          time={time}
          handleInputTime={handleInputTime}
        />
      }
    </div>
  )
}

export default HeatMapActionsView;