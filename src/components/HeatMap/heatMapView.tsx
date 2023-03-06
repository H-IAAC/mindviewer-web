import styles from './styles.module.css';
import "hammerjs";
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartTitle,
  ChartTooltip,
  ChartXAxis,
  ChartXAxisCrosshair,
  ChartXAxisCrosshairTooltip,
  ChartXAxisItem,
  ChartYAxis,
  ChartYAxisCrosshair,
  ChartYAxisCrosshairTooltip,
  ChartYAxisItem,
} from "@progress/kendo-react-charts";
import '@progress/kendo-theme-default/dist/all.css';
import { Paper } from '@material-ui/core';
import React from 'react';
import HeatMapComponent from './HeatMapComponent';
import imgExample from '../../assets/quarto.jpg';

const HeatMapView = React.memo((props: any) => {
  const {
    processedData,
    active,
    viewport,
    title,
    loading,
    panZoomEnabled,
    markerShape,
    markerSize,
    xLabelsEnabled,
    yLabelsEnabled,
    valueLabelEnabled,
    tooltipEnabled,
    xCrossHairEnabled,
    yCrossHairEnabled,
    backgroundImageEnabled,
    //colorFunction,
    legendBar
  } = props.heatMapState;
  const {chartId, colorFunction} = props;

  //console.log(legendBar)

  return(
    <>
      <Paper className={styles.chartPaper} id={`paper${chartId}`}>
        {(processedData.length !== 0 && active)?
          <HeatMapComponent
            data={processedData[viewport]}
            color={colorFunction}
            title={title}
            valueLabelEnabled={valueLabelEnabled}
            tooltipEnabled={tooltipEnabled}
            panZoomEnabled={panZoomEnabled}
            xLabelsEnabled={xLabelsEnabled}
            yLabelsEnabled={yLabelsEnabled}
            markerShape={markerShape}
            backgroundImageEnabled={backgroundImageEnabled}
            backgroundImage={imgExample}
          />
          // <Chart
          //   style={{
          //     //width: "1200px",
          //     height: "100%"
          //   }}
          //   pannable={panZoomEnabled}
          //   zoomable={panZoomEnabled}
          //   renderAs='svg'
          // >
          //   <ChartTitle
          //     text={title}
          //     // margin={{
          //     //   left: 40,
          //     // }}
          //   />

          //   <ChartTooltip
          //     visible={tooltipEnabled}
          //   />
            
          //   <ChartSeries>
          //     <ChartSeriesItem
          //       type="heatmap"
          //       data={processedData[viewport]}
          //       xField="x"
          //       yField="y"
          //       field="value"
          //       color={colorFunction}
          //       markers={{
          //         type: markerShape,
          //         //border: { width: 1 },
          //         borderRadius: 15,
          //         size: markerSize
          //       }}
          //       labels={{
          //         visible: valueLabelEnabled
          //       }}
          //     />
          //   </ChartSeries>

          //   <ChartXAxis>
          //     <ChartXAxisItem
          //       labels={{visible: xLabelsEnabled}}
          //     >
          //       <ChartXAxisCrosshair visible={xCrossHairEnabled} width={1} color="#f00">
          //         <ChartXAxisCrosshairTooltip/>
          //       </ChartXAxisCrosshair>
          //     </ChartXAxisItem>
          //   </ChartXAxis>

          //   <ChartYAxis>
          //     <ChartYAxisItem
          //       labels={{visible: yLabelsEnabled}}
          //     >
          //       <ChartYAxisCrosshair visible={yCrossHairEnabled} width={1} color="#f00">
          //         <ChartYAxisCrosshairTooltip/>
          //       </ChartYAxisCrosshair>
          //     </ChartYAxisItem>
          //   </ChartYAxis>
          // </Chart>
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
                  Sem dados!
                </h1>
              </div>
            )
        }
        
      </Paper>
      <div
        style={{
          width: '142px',
          display: 'flex',
          alignItems: 'center',
          height: '100%',
          padding: '20px 0 0 20px'
        }}
      >
        {legendBar}
      </div>
    </>
  )
})

export default HeatMapView;