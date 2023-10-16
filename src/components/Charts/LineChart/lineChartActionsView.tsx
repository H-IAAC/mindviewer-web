import styles from './styles1.module.css';
import './styles.css';

import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import EditChartMenu from '../../EditChartMenu';
import InputTimeModal from '../../InputTimeModal';
import LineChartController from './lineChartController';
import LineChartActionsViewProps from '../../../@types/LineChartActionsViewProps';

const LineChartActionsView = (props: LineChartActionsViewProps) => {
  const {
    enableRefresh,
    sliderValue,
    sliderXAxisValue,
    editChartMenu,
    chartTime,
    inputTimeModal
  } = props.lineChartActionsState;
  const {
    handleEditChartMenu,
    handleInputTimeModal,
    handleEnableRefresh,
    handleSlider,
    handleSliderXAxis,
    handleInputTime,
    handleXAxisChanged,
    handleScreenshot
  } = props;
  const {
    chart,
    chartId,
    removeChart,
    removeDataFromChart
  } = props.lineChartProps;

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
        <input
          type="range"
          value={sliderXAxisValue}
          onChange={(e) => handleSliderXAxis(e.target.value)}
          step={1}
          disabled={enableRefresh}
          style={{
            width: "200px",
            margin: "0 25px"
          }}
        />
        <div className={styles.closeButton}>
          <button onClick={() => removeChart(chartId)}>
            <CloseIcon />
          </button>
        </div>
      </div>
      <div id={`chart${chartId}`} style={{height: '100%'}}>
        <LineChartController 
          {...props.lineChartProps}
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
          className={styles.slider}
          step={1}
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

export default LineChartActionsView;