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

const TreeForJsonView = (props: any) => {
  const {
    treeForJsonState,
    handleContextMenu,
    handleToggle,
    handleSelect,
  } = props;
  const {
    jsonTree,
    handleIdTree
  } = props.treeForJsonProps;

  //Componente de nó da árvore estilizado
  const StyledTreeItem = (props: any) => {
    const {idTree, labelIcon, labelText, children, ...others} = props;

    return (
      <TreeItem
        label={
          <div className={styles.treeItemLabel}>
            {/* <img className="" src={labelIcon} alt="icon"/> */}
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
  const renderTree = (nodes: any) => (
    <StyledTreeItem key={nodes.id} nodeId={nodes.id} labelText={nodes.labelForTree} labelIcon={nodes.icon} idTree={nodes.id}>
      {nodes.hasChildren ? nodes.info.map((node: any) => renderTree(node)) : null}
    </StyledTreeItem>
  );

  return(
    <div className={styles.container}>
      <TreeContainer
        className=""
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={treeForJsonState.expandedNodes ?? []}
        selected={treeForJsonState.selectedNodes ?? []}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        // multiSelect
      >
        {renderTree(jsonTree)}
      </TreeContainer>
      {treeForJsonState.showMenu &&
        <div
          className={styles.menuPaper}
          style={{top: treeForJsonState.yPos, left: treeForJsonState.xPos}}
        >
          <MenuList className={styles.menuList}>
            <MenuItem className={styles.menuItemText} onClick={() => handleIdTree(treeForJsonState.idTree[0])}>Ver detalhes</MenuItem>
            {/* <MenuItem className={styles.menuItemText} onClick={() => handleOpenAddChartMenu(treeForJsonState.idTree)}>Inserir gráfico</MenuItem>
            <MenuItem className={styles.menuItemText} onClick={() => handleAddChartNewTab(treeForJsonState.idTree)}>Inserir gráfico em uma nova guia</MenuItem> */}
            {/* <MenuItem className={styles.menuItemText}>Opção 3</MenuItem> */}
          </MenuList>
        </div>
      }
    </div>
  )
}

export default TreeForJsonView;