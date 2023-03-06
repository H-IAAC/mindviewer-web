import ChartPanelProps from '../../@types/ChartPanelProps';
import ChartPanelController from './controller';

const ChartPanel = (props: ChartPanelProps) => {
  return(
    <ChartPanelController 
      {...props}
    />
  )
}

export default ChartPanel;