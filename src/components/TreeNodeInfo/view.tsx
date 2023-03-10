import styles from './styles.module.css';
import './styles.css';

import TreeContainer from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import IDataTree from '../../interfaces/IDataTree';
import TreeViewProps from '../../@types/TreeViewProps';
import React, { useState } from 'react';

const TreeNodeInfoView = (props: any) => {
  const {
    treeNodeInfoState,
    handleContextMenu,
    handleToggle,
    handleSelect,
  } = props
  const {
    data,
    handleIdTree
  } = props.treeNodeInfoProps

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
    <StyledTreeItem key={nodes.id} nodeId={nodes.id} labelText={nodes.labelChart} labelIcon={nodes.icon} idTree={nodes.id}>
      {Array.isArray(nodes.children) ? nodes.children.map((node) => renderTree(node)) : null}
    </StyledTreeItem>
  );

  return(
    <div className={styles.container}>
      <TreeContainer
        className=""
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={treeNodeInfoState.expandedNodes ?? []}
        selected={treeNodeInfoState.selectedNodes ?? []}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
        //multiSelect
      >
        {renderTree(data)}
      </TreeContainer>
      {treeNodeInfoState.showMenu &&
        <div
          className={styles.menuPaper}
          style={{top: treeNodeInfoState.yPos, left: treeNodeInfoState.xPos}}
        >
          <MenuList className={styles.menuList}>
            <MenuItem className={styles.menuItemText} onClick={() => handleIdTree(treeNodeInfoState.idTree[0])}>Ver detalhes</MenuItem>
          </MenuList>
        </div>
      }
    </div>
  )
}

export default TreeNodeInfoView;