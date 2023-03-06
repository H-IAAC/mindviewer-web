import styles from "./styles.module.css"
import {useEffect, useRef, useState} from "react";
import { renderer } from "./renderer";

type PropType = {
  data: { 
    x: string, 
    y: string, 
    value: number
  }[],
  color: (e: any) => string,
  title: string,
  valueLabelEnabled: boolean,
  tooltipEnabled: boolean,
  panZoomEnabled: boolean,
  xLabelsEnabled: boolean,
  yLabelsEnabled: boolean,
  markerShape: string,
  backgroundImageEnabled: boolean,
  backgroundImage: string | undefined
}

const HeatMapComponent = (props: PropType) => {
  const { 
    data, 
    color, 
    title,
    valueLabelEnabled,
    tooltipEnabled,
    panZoomEnabled,
    xLabelsEnabled,
    yLabelsEnabled,
    markerShape,
    backgroundImageEnabled,
    backgroundImage
  } = props;

  let windowAux: any = window;

  const [instance, setInstance] = useState<any>();
  const [hasZoomPan, setHasZoomPan] = useState(false);
  const [minMaxNumbers, setMinMaxNumbers] = useState<any>();
  const [xAxis, setXAxis] = useState<number[]>([]);
  const [yAxis, setYAxis] = useState<number[]>([]);

  const tableRef = useRef<any>();
  const xAxisRef = useRef<any>();
  const yAxisRef = useRef<any>();
  const [xLength, setXLength] = useState<number>();
  const [yLength, setYLength] = useState<number>();
  const [clientWidth, setClientWidth] = useState<number>();
  const [clientHeight, setClientHeight] = useState<number>();
  const [limits, setLimits] = useState<DOMRect>();
  const [tooltip, setTooltip] = useState<{
    x: string, 
    y: string, 
    value: number,
    top: number,
    left: number
  }>();

  useEffect(() => {
    windowAux.mouseDown = false;
    document.onmousedown = () => {
      windowAux.mouseDown = true;
    }
    document.onmouseup = () => {
      windowAux.mouseDown = false;
    }

    const minmax = defineMinMax();
    const table = document.getElementById("table");
    if (table) {
      defineDimensions(table, minmax);
      defineInstance(table);
    }
  },[])

  useEffect(() => {
    window.addEventListener("resize", defineAll);
    return(() => window.removeEventListener("resize", defineAll));
  });

  useEffect(() => {
    if (instance) {
      tableRef.current.addEventListener("wheel", handleZoom, {passive: false});
      return(() => tableRef.current && tableRef.current.removeEventListener("wheel", handleZoom))
    }
  })

  useEffect(() => {
    if (tableRef.current.children[0].children.length === 0 && minMaxNumbers) {
      defineAll()
    }
  })

  useEffect(() => {
    if (tableRef.current && minMaxNumbers)
      defineAll();
  }, [xLabelsEnabled, yLabelsEnabled])

  useEffect(() => {
    if (!panZoomEnabled && hasZoomPan)
      defineAll();
  }, [panZoomEnabled])

  const defineAll = () => {
    defineInstance(tableRef.current);
    defineDimensions(tableRef.current);
  }

  const defineMinMax = () => {
    let minX = parseInt(data[0].x);
    let maxX = parseInt(data[0].x);
    let minY = parseInt(data[0].y);
    let maxY = parseInt(data[0].y);

    for (let i = 0; i < data.length; i++) {
      if (parseInt(data[i].x) < minX) minX = parseInt(data[i].x);
      else if (parseInt(data[i].x) > maxX) maxX = parseInt(data[i].x);

      if (parseInt(data[i].y) < minY) minY = parseInt(data[i].y);
      else if (parseInt(data[i].y) > maxY) maxY = parseInt(data[i].y);
    }

    let listX = [];
    let listY = [];

    for (let i = minX; i <= maxX; i++) {
      listX.push(i);      
    }
    for (let i = minY; i <= maxY; i++) {
      listY.push(i);      
    }

    setXAxis([...listX]);
    setYAxis([...listY]);

    let aux = {minX, maxX, minY, maxY}
    //console.log(aux);
    setMinMaxNumbers(aux);
    return aux;
  }

  const defineDimensions = (table: Element, minMax: any = minMaxNumbers) => {
    const clientWidth = table.clientWidth;
    const clientHeight = table.clientHeight;
    const limits = table.getBoundingClientRect();

    setXLength(clientWidth/(minMax.maxX-minMax.minX+1));
    setYLength(clientHeight/(minMax.maxY-minMax.minY+1));
    setClientWidth(clientWidth);
    setClientHeight(clientHeight);
    setLimits(limits);
  }

  const defineInstance = (table: HTMLElement) => {
    if (instance && hasZoomPan) {
      instance.panTo({
        originX: 0,
        originY: 0,
        scale: 1
      })
      setHasZoomPan(false);
      resetAxis();
    }

    const instanceAux = renderer({minScale: 1, maxScale: 30, element: table});
    setInstance(instanceAux);
    return instanceAux;
  }

  const handleZoom = (event: any/*, instance: any*/) => {
    if (!panZoomEnabled) return;

    instance.zoom({
      deltaScale: Math.sign(event.deltaY) > 0 ? 1 : -1,
      x: event.pageX,
      y: event.pageY
    });

    setHasZoomPan(true);
    handleAxis();
  }

  const handlePan = (event: any, instance: any) => {
    if (!panZoomEnabled) return;

    event.preventDefault();
    if (!windowAux.mouseDown) return;
    instance.panBy({
      originX: event.movementX,
      originY: event.movementY
    })

    setHasZoomPan(true);
    handleAxis();
  }

  const handleResetZoom = (event: any, instance: any) => {
    if (!panZoomEnabled) return;

    event.preventDefault();
    instance.panTo({
      originX: 0,
      originY: 0,
      scale: 1
    })

    setHasZoomPan(false);
    resetAxis();
  }

  const handleAxis = () => {
    const { left, top, width, height } = tableRef.current.getBoundingClientRect();

    if (limits) {
      xAxisRef.current.style.width = `${width}px`;
      xAxisRef.current.style.left = `${left-limits.left}px`;

      yAxisRef.current.style.height = `${height}px`;
      yAxisRef.current.style.top = `${top-limits.top}px`;
    }
  }

  const resetAxis = () => {
    xAxisRef.current.style.width = `100%`;
    xAxisRef.current.style.left = `0`;

    yAxisRef.current.style.height = `100%`;
    yAxisRef.current.style.top = `0`;
  }

  return(
    <>
      <div style={{width: '100%', height: "30px", paddingLeft: "30px", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <h1
          style={{fontSize: "20px"}}
        >{title}</h1>
      </div>
      <div style={{width: '100%', height: `calc(100% - ${xLabelsEnabled? 55: 30}px)`, display: "flex", overflow: 'hidden', paddingLeft: `${yLabelsEnabled? 0: 10}px`, paddingBottom: `${xLabelsEnabled? 0: 10}px`}}>
        <div
          style={{width: `${yLabelsEnabled? 30: 0}px`, height: "100%", overflow: "hidden", position: "relative"}}
        >
          <div
            id="yAxis"
            ref={yAxisRef}
            style={{width: "100%", height: "100%", display: "flex", flexDirection: "column-reverse", position: "absolute"}}
          >
            {
              yAxis.map(item => (
                <div 
                  style={{height: "inherit", display: "flex", justifyContent: "center", alignItems: "center"}}
                >
                  <p
                    style={{fontSize: "14px"}}
                  >{item}</p>
                </div>
              ))
            }
          </div>
        </div>
        <div
          style={{
            width: `calc(100% - ${yLabelsEnabled? 30: 0}px)`, 
            height: '100%', 
            overflow: 'hidden', 
          }}
          onMouseLeave={() => setTooltip(undefined)}
        >
          <div
            id="table"
            ref={tableRef}
            style={{
              width: "100%", 
              height: "100%", 
              backgroundImage: backgroundImageEnabled? `url(${backgroundImage})` : undefined,
              backgroundSize: "100% 100%"
            }}
            onMouseMove={evt => handlePan(evt, instance)}
            onDoubleClick={evt => handleResetZoom(evt, instance)}
          >
            <svg
              style={{width: '100%', height: '100%', opacity: backgroundImageEnabled? "0.8" : "1"}}
            >
              { xLength && yLength && clientHeight && clientWidth &&
                data.map((item, index) => (
                  <g
                    id={`cell${index}`}
                    key={index}
                    className={styles.cell}
                    onMouseEnter={(e) => {
                      const docDimensions = document.getElementById(`cell${index}`)?.getBoundingClientRect();
                      docDimensions && setTooltip({
                        ...item,
                        top: docDimensions.top - 60,
                        left: ((docDimensions.left + docDimensions.right)/2) - 50
                      })
                    }}
                  >
                    {(markerShape === "rect" || markerShape === "roundedRect")
                      ? <rect
                          x={`${xLength*(parseInt(item.x)-minMaxNumbers.minX)}`}
                          y={`${clientHeight-yLength*(parseInt(item.y)-minMaxNumbers.minY+1)}`}
                          width={xLength}
                          height={yLength}
                          stroke="none"
                          fill={color(item)}
                          fillOpacity={1}
                          rx={markerShape === "roundedRect"? 15 : 0}
                        ></rect>

                      : markerShape === "circle"
                      ? <circle
                          cx={`${xLength*(parseInt(item.x)-minMaxNumbers.minX) + (xLength/2)}`}
                          cy={`${clientHeight-yLength*(parseInt(item.y)-minMaxNumbers.minY) - (yLength/2)}`}
                          r={Math.min(xLength, yLength)/2}
                          stroke="none"
                          fill={color(item)}
                          fillOpacity={1}
                        ></circle>

                      : markerShape === "triangle"
                      ? <path
                          d={`M ${xLength*(parseInt(item.x)-minMaxNumbers.minX)} ${clientHeight-yLength*(parseInt(item.y)-minMaxNumbers.minY)} l ${xLength} 0 -${xLength/2} -${yLength} Z`}
                          stroke="none"
                          fill={color(item)}
                          fillOpacity={1}
                        ></path>
                      : <div/>
                    }
                    {
                      valueLabelEnabled &&
                      <text
                        style={{fontSize: '12px', color: "#fff", fontFamily: "sans-serif"}}
                        x={`${xLength*(parseInt(item.x)-minMaxNumbers.minX) + xLength/2}`}
                        y={`${clientHeight-yLength*(parseInt(item.y)-minMaxNumbers.minY) - yLength/3}`}
                        fill="#fff"
                        textAnchor="middle"
                      >
                        {item.value}
                      </text>
                    }
                  </g>
                ))
              }
            </svg>
          </div>
        </div>
      </div>
      
      <div
        style={{width: "calc(100% - 30px)", height: `${xLabelsEnabled? 25: 0}px`, overflow: "hidden", position: "relative", marginLeft: "30px"}}
      >
        <div
          id="xAxis"
          ref={xAxisRef}
          style={{width: "100%", height: "100%", display: "flex", position: "absolute"}}
        >
          {
            xAxis.map(item => (
              <div 
                style={{width: "inherit", display: "flex", justifyContent: "center", alignItems: "center"}}
              >
                <p
                  style={{fontSize: "14px"}}
                >{item}</p>
              </div>
            ))
          }
        </div>
      </div>
      {
        tooltip && tooltipEnabled &&
        <div
          style={{
            width: "100px",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: `${tooltip.top}px`,
            left: `${tooltip.left}px`,
            backgroundColor: "#fff",
            zIndex: 10,
            borderRadius: "5px"
          }}
        >
          <p>
            {tooltip.value}
          </p>
        </div>
      }
    </>
  )
}

export default HeatMapComponent;