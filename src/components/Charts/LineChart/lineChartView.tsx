import styles from './styles.module.css';
import './styles.css';

import Paper from '@material-ui/core/Paper';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  ZoomAndPan,
  Title,
  Legend,
  Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale, EventTracker, SeriesRef, ValueScale, Viewport } from '@devexpress/dx-react-chart';
import { scaleTime } from 'd3-scale';
import { Plugin } from '@devexpress/dx-react-core';
import LineChartViewProps from '../../../@types/LineChartViewProps';

const LineChartView = (props: LineChartViewProps) => {
  const {
    data,
    dataChart,
    active,
    autoRange,
    xInterval,
    yInterval,
    showXAxisGrid,
    showYAxisGrid,
    colors,
    viewport,
    title,
    tooltipActive,
    loading
  } = props.lineChartState;
  const {chartId} = props;

  /*
    chartRootComponent -> Componente estilizado do gráfico;
    titleRootComponent -> Componente estilizado do título;
    legendRootComponent -> Componente estilizado da legenda;
    legendItemComponent -> Componente estilizado dos itens da legenda;
  */
  const chartRootComponent = (props: Chart.RootProps) => (<div className={styles.chartComponent}>{props.children}</div>);
  const titleRootComponent = (props: Title.TextProps) => (<div className={styles.chartTitle}>{props.text}</div>);
  const legendRootComponent = (props: Legend.RootProps) => (<div className={styles.legendComponent} >{props.children}</div>);
  const legendItemComponent = (props: Legend.ItemProps) => (<div className={styles.legendItemComponent} >{props.children}</div>);
  const tooltipContentComponent = (props: Tooltip.ContentProps) => {
    const xValue: Date = dataChart[props.targetItem.point]["time"];
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
          </p>
        </div>
        <p>
          {props.targetItem.series}: {parseFloat(props.text).toFixed(2)}
        </p>
      </div>
    )
  };

  return(
    <>
    <Paper className={styles.chartPaper} id={`paper${chartId}`}>
      {(data.length !== 0 && dataChart.length !== 0 && xInterval.length !== 0 && active) ?
        <>
          <Chart
            data={[...dataChart]}
            rootComponent={chartRootComponent}
          >
            {/*Parte que gerencia as escalas*/}
            
            <ArgumentScale 
              factory={scaleTime}
              modifyDomain={() => xInterval}
            /> 

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

            <Plugin>
              {
                data.map((item: any, index: number) => (
                  <LineSeries 
                    name={item.labelChart}
                    valueField={`y${index}`}
                    argumentField="time" 
                    color={index < colors.length? `#${colors[index]}` : undefined}
                  />
                ))
              }
            </Plugin>
          
            {/*Parte que gerencia interações com o gráfico*/}
            
            <ZoomAndPan 
              viewport={viewport}
              interactionWithArguments={'none'}
              interactionWithValues={'none'}
            />
            
            
            {/*Parte que gerencia legenda e titulo*/}
            
            <Legend
              position="bottom"
              rootComponent={legendRootComponent}
              itemComponent={legendItemComponent}
            />
              
            <Title 
              text={title} 
              textComponent={titleRootComponent}
            />

            <EventTracker />
            {tooltipActive &&
              <>                  
                <Tooltip 
                  contentComponent={tooltipContentComponent}
                  //arrowComponent={tooltipArrowComponent}
                />
              </>
            }
            
          </Chart>
          <p className={styles.xAxis}>Time</p>
          <p className={styles.yAxis}>Activation</p>
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
    </>
  )
}

export default LineChartView;