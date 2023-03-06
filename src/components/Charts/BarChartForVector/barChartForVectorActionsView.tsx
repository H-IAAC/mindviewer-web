import styles from './styles1.module.css';
import './styles.css';

import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';

import EditChartMenu from '../../EditChartMenu';
import InputTimeModal from '../../InputTimeModal';
import BarChartController from './barChartForVectorController';
import BarChartForVectorActionsViewProps from '../../../@types/BarChartForVectorActionsViewProps';

const BarChartForVectorActionsView = (props: BarChartForVectorActionsViewProps) => {
  const {
    enableRefresh,
    sliderValue,
    //sliderXAxisValue,
    editChartMenu,
    chartTime,
    inputTimeModal
  } = props.barChartForVectorActionsState;
  const {
    handleEditChartMenu,
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
  } = props.barChartForVectorProps;

  return(
    <div className={styles.container}>
      <div className={styles.head}>
        <div className={styles.refreshButton}>
          <input id={`refresh${chartId}`} type="checkbox" checked={enableRefresh} onChange={() => handleEnableRefresh(!enableRefresh)}/>
          <label htmlFor={`refresh${chartId}`}>Auto-refresh</label>
        </div>
        <div className={styles.editButton}>
          <button onClick={() => handleEditChartMenu(true)}>
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
      <div id={`chart${chartId}`} style={{height: '100%'}}>
        <BarChartController 
          {...props.barChartForVectorProps}
        />
      </div>
      <div style={{display: 'flex'}}>
        <div className={styles.timeDisplay}>
          <input
            type="text"
            value={enableRefresh? chart.getTime(): chartTime}
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
      {editChartMenu &&
        <EditChartMenu
          chart={chart}
          chartId={chartId}
          handleEditChartMenu={handleEditChartMenu}
          removeDataFromChart={removeDataFromChart}
          handleXAxisChanged={handleXAxisChanged}
        />
      }
      {inputTimeModal &&
        <InputTimeModal
          handleInputTimeModal={handleInputTimeModal} 
          time={chartTime}
          handleInputTime={handleInputTime}
        />
      }
    </div>
  )
}

export default BarChartForVectorActionsView;