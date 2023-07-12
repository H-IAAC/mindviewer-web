import styles from './styles.module.css';
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