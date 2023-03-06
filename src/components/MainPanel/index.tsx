import MainPanelProps from '../../@types/MainPanelProps';
import MainPanelController from './controller';

//Componente container que encapsula a árvore de elementos e os gráficos
const MainPanel = (props: MainPanelProps) => {
  return(
    <MainPanelController 
      {...props}
    />
  )
}

export default MainPanel;