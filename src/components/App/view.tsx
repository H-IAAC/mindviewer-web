import styles from './styles.module.css';
import MainPanel from '../MainPanel';
import Header from '../Header';
import SetupMenu from '../SetupMenu';
import AppViewProps from '../../@types/AppViewProps';

const AppView = (props: AppViewProps) => {
  const { inSetup } = props.appState;

  return(
    <div className={styles.app}>
      <Header 
        {...props}
      />
      {inSetup?
        <SetupMenu 
          {...props}
        />
        :
        <MainPanel 
          {...props}
        />
      }
      
    </div>
  )
} 

export default AppView;