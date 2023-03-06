import styles from './styles.module.css';
import TreePanel from '../TreePanel';
import MainPanelViewProps from '../../@types/MainPanelViewProps';
import ChartManager from '../ChartManager';

const MainPanelView = (props: MainPanelViewProps) => {
  return(
    <div className={styles.container}>
      <TreePanel 
        {...props}
      />
      <ChartManager 
        {...props}
      />
    </div>
  )
}

export default MainPanelView;