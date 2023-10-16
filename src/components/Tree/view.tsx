import styles from './styles.module.css';
import './styles.css';

import TreeContainer from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';

import IDataTree from '../../interfaces/IDataTree';
import TreeViewProps from '../../@types/TreeViewProps';

const TreeView = (props: TreeViewProps) => {
  const {
    treeState,
    handleContextMenu
  } = props
  const {
    treePanelState,
    handleToggle,
    handleSelect,
    handleOpenAddChartMenu,
    handleOpenNodeInfoModal,
    handleIdeaModal,
    handleAddChartNewTab
  } = props.treeProps
  const {
    mainPanelState
  } = props.treeProps.treePanelProps

  //Componente de nó da árvore estilizado
  const StyledTreeItem = (props: any) => {
    const {idTree, labelIcon, labelText, children, ...others} = props;

    return (
      <TreeItem
        label={
          <div className={styles.treeItemLabel}>
            <img className="" src={labelIcon} alt="icon"/>
            <p className="">
              {labelText}
            </p>
          </div>
        }
        classes={{
          root: styles.root,
          content: styles.content,
          group: styles.group,
          label: styles.label,
          iconContainer: styles.iconContainer
        }}

        onContextMenu={(e) => handleContextMenu(e, idTree)}
        
        {...others}
      >
        {children}
      </TreeItem>
    )
  }

  /*
    renderTree: Realiza a construção da visualização em árvore de modo recursivo;
  */
  const renderTree = (nodes: IDataTree) => (
    <StyledTreeItem key={nodes.id} nodeId={nodes.id} labelText={nodes.name} labelIcon={nodes.icon} idTree={nodes.id}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </StyledTreeItem>
  );

  return(
    <div className={styles.container}>
      <TreeContainer
        className=""
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={treePanelState.expandedNodes[treePanelState.tabActive] ?? []}
        selected={treePanelState.selectedNodes[treePanelState.tabActive] ?? []}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        multiSelect
      >
        {renderTree(mainPanelState.data[treePanelState.tabActive])}
      </TreeContainer>
      {treeState.showMenu &&
        <div
          className={styles.menuPaper}
          style={{top: treeState.yPos, left: treeState.xPos}}
        >
          <MenuList className={styles.menuList}>
            <MenuItem className={styles.menuItemText} onClick={() => handleOpenNodeInfoModal(treeState.idTree)}>Ver detalhes</MenuItem>
            <MenuItem className={styles.menuItemText} onClick={() => handleOpenAddChartMenu(treeState.idTree)}>Inserir gráfico</MenuItem>
            <MenuItem className={styles.menuItemText} onClick={() => handleAddChartNewTab(treeState.idTree)}>Inserir gráfico em uma nova guia</MenuItem>
            <MenuItem className={styles.menuItemText}>Opção 3</MenuItem>
            <MenuItem className={styles.menuItemText} onClick={() => handleIdeaModal(treeState.idTree)}>Ideas</MenuItem>
          </MenuList>
        </div>
      }
    </div>
  )
}

export default TreeView;