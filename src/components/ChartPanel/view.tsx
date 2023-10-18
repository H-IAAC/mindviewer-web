import styles from './styles.module.css';
import ChartPanelViewProps from '../../@types/ChartPanelViewProps';

const ChartPanelView = (props: ChartPanelViewProps) => {
  const {
    tab
  } = props.chartPanelState
  const {
    handleTab
  } = props
  const {
    charts,
    dragFunctions
  } = props.chartPanelProps
  
  return(
    // <div className={styles.chartPanel}>
      <div className={styles.chartContainer}>
        <div className={styles.tabs}>
          {
            charts.chartList.map((item: any, index: number) => (
              <button 
                className={`${styles.tabButton} ${tab === index? styles.tabButtonActive : styles.tabButtonDisable}`} 
                onClick={() => {tab !== index && handleTab(index)}}
                key={index}
                draggable
                onDragStart={() => dragFunctions.dragStart(item)}
                onDragEnd={() => dragFunctions.dragEnd()}
              >
                {item.getTitle()}
              </button>
            ))
          }
        </div>
        {
          charts.chartComponentList.map((item, index: number) => (
            <div key={index} className={styles.section} style={{display: tab !== index? 'none':'contents', height: '100%'}}>
              {item(charts.chartIds[index])}
            </div>
          ))
        }
      </div>
    // </div>
  )
}

export default ChartPanelView;