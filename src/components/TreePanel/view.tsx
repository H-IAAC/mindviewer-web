import styles from './styles.module.css';
import Tree from '../Tree';
import AddChartMenu from '../AddChartMenu';
import TreePanelViewProps from '../../@types/TreePanelViewProps';
import NodeInfo from '../NodeInfo';
import IdeasInfo from '../IdeasInfo';

const TreePanelView = (props: TreePanelViewProps) => {
  const {
    handleTabActive
  } = props;
  const {
    tabActive,
    addChartMenu,
    nodeInfoModal,
    ideasModal,

  } = props.treePanelState;
  const {
    data,
    noConnection
  } = props.treePanelProps.mainPanelState;

  return(
    <div className={styles.treePanel}>
      <div className={styles.tabs}>
        <div className={styles.tabItem} style={{opacity: tabActive !== 0 ? 0.5 : 1}} onClick={() => handleTabActive(0)}>
          <p>Memories</p>
        </div>
        <div className={styles.tabItem} style={{opacity: tabActive !== 1 ? 0.5 : 1}} onClick={() => handleTabActive(1)}>
          <p>Codelets</p>
        </div>
      </div>
      {(data.length === 0 || noConnection)?
          noConnection
            ? <div className={styles.container}><p>Sem conexão!</p></div>
            : <div className={styles.container}><p>Carregando...</p></div>
        :
          <Tree
            {...props}
          />
      }
      {addChartMenu && 
        <AddChartMenu
          {...props}
        />
      }
      {nodeInfoModal &&
        <NodeInfo
          {...props}
        />
      }
      {ideasModal &&
        <IdeasInfo
          {...props}
        />
      }
    </div>
  )
}

export default TreePanelView;