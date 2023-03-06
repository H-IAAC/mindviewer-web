import styles from './styles.module.css';
import './styles.css';

import Paper from '@material-ui/core/Paper';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  ScatterSeries,
  ZoomAndPan,
  Title,
  Legend,
  Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale, EventTracker, SeriesRef, ValueScale, Viewport } from '@devexpress/dx-react-chart';
import { scaleTime } from 'd3-scale';
import { Plugin } from '@devexpress/dx-react-core';
import LineChartViewProps from '../../../@types/LineChartViewProps';

const ScatterChartView = (props: any) => {
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
  } = props.scatterChartState;
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
    const key = Object.keys(dataChart[viewport][props.targetItem.point]).find(key => key[0]==="x");
    const xValue: string = dataChart[viewport][props.targetItem.point][`${key}`];
    return(
      <div>
        {/* <div 
          style={{
            borderBottom: "1px solid #bbb",
            marginBottom: "5px"
          }}
        >
          <p>
          {xValue.toLocaleString()}.{xValue.getMilliseconds()}
          </p>
        </div> */}
        <p>
          x: {parseFloat(xValue).toFixed(2)}
        </p>
        <p>
          y: {parseFloat(props.text).toFixed(2)}
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
            data={dataChart[viewport]}
            rootComponent={chartRootComponent}
          >
            {/*Parte que gerencia as escalas*/}
            
            <ArgumentScale 
              modifyDomain={() => [-5,5]}
            /> 

            {!autoRange &&
              <ValueScale 
                modifyDomain={() => yInterval}
              />
            }
              
            <ArgumentAxis
              showLine={true} 
              showTicks={true}
              showGrid={true/*showYAxisGrid*/}
            />
            <ValueAxis 
              showLine={true} 
              showTicks={true}
              showGrid={true/*showYAxisGrid*/}
            />

            <Plugin>
              {
                data.map((item: any, index: number) => (
                  <ScatterSeries
                    name={item.labelChart}
                    valueField={`y${index}`}
                    argumentField={`x${index}`}
                    color={index < colors.length? `#${colors[index]}` : undefined}
                  />
                  // <LineSeries 
                  //   name={item.labelChart}
                  //   valueField={`y${index}`}
                  //   argumentField="time" 
                  //   color={index < colors.length? `#${colors[index]}` : undefined}
                  // />
                ))
              }
            </Plugin>
          
            {/*Parte que gerencia interações com o gráfico*/}
            
            {tooltipActive && 
              <ZoomAndPan 
                // viewport={viewport}
                interactionWithArguments={'both'}
                interactionWithValues={'both'}
              />
            }
            
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
              <Tooltip 
                contentComponent={tooltipContentComponent}
                //arrowComponent={tooltipArrowComponent}
              />
            }
            
          </Chart>
          <p className={styles.xAxis}>X</p>
          <p className={styles.yAxis}>Y</p>
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

export default ScatterChartView;