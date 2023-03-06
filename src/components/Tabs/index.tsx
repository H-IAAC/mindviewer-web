import React from 'react';
import styles from './styles.module.css';

//Componente das tabs do TreePanel
const Tabs = (props: any) => {
  
  return(
    <div className={styles.tabs}>
      <div className={styles.tabItem} style={{opacity: props.tabActive !== 0 ? 0.5 : 1}} onClick={() => props.setTabActive(0)}>
        <p>Memories</p>
      </div>
      <div className={styles.tabItem} style={{opacity: props.tabActive !== 1 ? 0.5 : 1}} onClick={() => props.setTabActive(1)}>
        <p>Codelets</p>
      </div>
    </div>
  )
}

export default Tabs;