import styles from './styles.module.css';
import './styles.css';

import Paper from '@material-ui/core/Paper';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
  ZoomAndPan,
  Title,
  Legend,
  Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale, EventTracker, SeriesRef, ValueScale, Viewport } from '@devexpress/dx-react-chart';
import { scaleTime } from 'd3-scale';
import { Plugin } from '@devexpress/dx-react-core';
import BarChartViewProps from '../../../@types/BarChartViewProps';

const BarChartView = (props: BarChartViewProps) => {
  const {
    //data,
    dataChart,
    active,
    autoRange,
    //xInterval,
    yInterval,
    showXAxisGrid,
    showYAxisGrid,
    //colors,
    colorsFixed,
    viewport,
    title,
    tooltipActive,
    loading
  } = props.barChartState;
  const {chartId} = props;

  /*
    chartRootComponent -> Componente estilizado do gráfico;
    titleRootComponent -> Componente estilizado do título;
  */
  const chartRootComponent = (props: Chart.RootProps) => (<div className={styles.chartComponent}>{props.children}</div>);
  const titleRootComponent = (props: Title.TextProps) => (<div className={styles.chartTitle}>{props.text}</div>);
  //const legendRootComponent = (props: Legend.RootProps) => (<div className={styles.legendComponent} >{props.children}</div>);
  //const legendItemComponent = (props: Legend.ItemProps) => (<div className={styles.legendItemComponent} >{props.children}</div>);
  const tooltipContentComponent = (props: Tooltip.ContentProps) => {
    const xValue: Date = dataChart[viewport][props.targetItem.point]["x"];
    return(
      <div>
        <div 
          style={{
            borderBottom: "1px solid #bbb",
            marginBottom: "5px"
          }}
        >
          <p>
          {xValue.toLocaleString()}.{xValue.getMilliseconds()}
          {/* {props.targetItem.point} */}
          </p>
        </div>
        <p>
          {parseFloat(props.text).toFixed(2)}
        </p>
      </div>
    )
  };

  return(
    <Paper className={styles.chartPaper} id={`paper${chartId}`}>
      {(dataChart.length !== 0 && active)?
        <>
          <Chart
            data={dataChart[viewport]}
            rootComponent={chartRootComponent}
          >
            {/*Parte que gerencia as escalas*/}
            
            {!autoRange &&
              <ValueScale 
                modifyDomain={() => yInterval} 
              />
            }
              
            <ArgumentAxis />
            <ValueAxis 
              showLine={true} 
              showTicks={true}
              showGrid={showYAxisGrid}
            />

            {/*Parte que gerencia o tipo de visualização*/}
            
            <Plugin>
              <BarSeries
                valueField="y"
                argumentField="name"
                //color={colorsFixed? undefined:'#fff'}
              />
            </Plugin>
            
            
            {/*Parte que gerencia legenda e titulo*/}
            
            <Title 
              text={title} 
              textComponent={titleRootComponent}
            />

            <EventTracker />
            {tooltipActive &&                  
              <Tooltip 
                // targetItem={this.targetItem} 
                // onTargetItemChange={this.changeTargetItem}
                // sheetComponent={this.tooltipSheetComponent}
                contentComponent={tooltipContentComponent}
              />
            }
            
          </Chart>
        </>
        :
        loading
          ? (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <h1 style={{fontSize: "14px"}}>
                Carregando...
              </h1>
            </div>
          )
          : (
            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <h1 style={{fontSize: "14px"}}>
                Gráfico sem dados!
              </h1>
            </div>
          )
      }
    </Paper>
  )
}

export default BarChartView;