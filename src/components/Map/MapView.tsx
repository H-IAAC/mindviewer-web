import styles from './styles.module.css';
import React from 'react';

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, useMap, Marker, Popup, FeatureGroup, Circle } from 'react-leaflet';
import Leaflet from "leaflet";

const MapView = React.memo((props: any) => {
  const {
    processedData,
    active,
    viewport,
    title,
    loading,
    tooltipEnabled,
    colors
  } = props.mapState;
  const {chartId} = props;

  const data = processedData[viewport];
  const keys = Object.keys(data ?? {});

  return(
    <>
      <div className={styles.chartPaper} id={`paper${chartId}`}>
        {(processedData.length !== 0 && active)?
          <MapContainer 
            center={data[keys[0]].positions[0].slice(0,2)} 
            zoom={20} 
            style={{ width: "100%", height: "100%" , zIndex: 0}}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {
              keys.map((key, index) => (
                <FeatureGroup 
                  pathOptions={
                    {
                      color: `#${colors[index]}`, 
                      fillOpacity: 0.6, 
                      stroke: false
                    }
                  } 
                  key={index}
                >
                  <Popup>
                    {data[key].group}
                    <br/>
                    {data[key].time.toLocaleString()}
                  </Popup>
                  {
                    data[key].positions.map((position: number[], index2: number) => (
                      <Circle
                        center={position.slice(0,2) as Leaflet.LatLngExpression}
                        radius={10}
                        key={index2}
                      />
                    ))
                  }
                </FeatureGroup>
              ))
            }
          
          </MapContainer>
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
      </div>
    </>
  )
})

export default MapView;