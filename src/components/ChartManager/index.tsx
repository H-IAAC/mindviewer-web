import { useEffect, useState } from "react";
import styles from './styles.module.css';
import ChartPanel from "../ChartPanel";
import ChartManagerProps from "../../@types/ChartManagerProps";

const ChartManager = (props: ChartManagerProps) => {
  const {mainPanelState, layout, handleUpdateChartLocation} = props;

  const [locations, setLocations] = useState<any>({
    default: undefined,
    vertical: undefined,
    horizontal: undefined,
    fourPanels: undefined
  });
  const [draggingElement, setDraggingElement] = useState<any>();

  const dragStart = (chart: any) => {
    setDraggingElement(chart);
    console.log("Começou")
  }

  const dragEnd = () => {
    arrangeCharts();
    setDraggingElement(undefined);
    console.log("Terminou")
  }

  const dragFunctions = {
    dragStart,
    dragEnd
  }

  const dragOver = (location: string) =>  {
    draggingElement.setLocation(location);
    console.log("Está em cima!")
  }

  useEffect(() => {
    arrangeCharts();
  },[mainPanelState, layout])

  const arrangeCharts = () => {
    switch (layout) {
      case "default":
        setLocations({
          ...locations,
          default: {
            chartList: mainPanelState.chartList,
            chartComponentList: mainPanelState.chartComponentList,
            chartIds: mainPanelState.chartList.map((_:any, id: number) => id)
          }
        })
        break;
    
      case "vertical":
        const v1: number[] = [];
        const v2: number[] = [];

        mainPanelState.chartList.forEach((item: any, index: number) => {
          if (item.getLocation() === "vert2") {
            v2.push(index);
          } else {
            v1.push(index)
          }
        })

        setLocations({
          ...locations,
          vertical: {
            vert1: {
              chartList: mainPanelState.chartList.filter((_:any, index:number) => v1.includes(index)),
              chartComponentList: mainPanelState.chartComponentList.filter((_:any, index:number) => v1.includes(index)),
              chartIds: [...v1]
            },
            vert2: {
              chartList: mainPanelState.chartList.filter((_:any, index:number) => v2.includes(index)),
              chartComponentList: mainPanelState.chartComponentList.filter((_:any, index:number) => v2.includes(index)),
              chartIds: [...v2]
            }
          }
        })
        break;

      case "horizontal": 
        const h1: number[] = [];
        const h2: number[] = [];

        mainPanelState.chartList.forEach((item: any, index: number) => {
          if (item.getLocation() === "horiz2") {
            h2.push(index);
          } else {
            h1.push(index)
          }
        })

        setLocations({
          ...locations,
          horizontal: {
            horiz1: {
              chartList: mainPanelState.chartList.filter((_:any, index:number) => h1.includes(index)),
              chartComponentList: mainPanelState.chartComponentList.filter((_:any, index:number) => h1.includes(index)),
              chartIds: [...h1]
            },
            horiz2: {
              chartList: mainPanelState.chartList.filter((_:any, index:number) => h2.includes(index)),
              chartComponentList: mainPanelState.chartComponentList.filter((_:any, index:number) => h2.includes(index)),
              chartIds: [...h2]
            }
          }
        })
        break;

      case "fourPanels":
        const f1: number[] = [];
        const f2: number[] = [];
        const f3: number[] = [];
        const f4: number[] = [];

        mainPanelState.chartList.forEach((item: any, index: number) => {
          if (item.getLocation() === "f2") {
            f2.push(index);
          } 
          else if (item.getLocation() === "f3") {
            f3.push(index);
          }
          else if (item.getLocation() === "f4") {
            f4.push(index);
          } 
          else {
            f1.push(index)
          }
        })

        setLocations({
          ...locations,
          fourPanels: {
            f1: {
              chartList: mainPanelState.chartList.filter((_:any, index:number) => f1.includes(index)),
              chartComponentList: mainPanelState.chartComponentList.filter((_:any, index:number) => f1.includes(index)),
              chartIds: [...f1]
            },
            f2: {
              chartList: mainPanelState.chartList.filter((_:any, index:number) => f2.includes(index)),
              chartComponentList: mainPanelState.chartComponentList.filter((_:any, index:number) => f2.includes(index)),
              chartIds: [...f2]
            },
            f3: {
              chartList: mainPanelState.chartList.filter((_:any, index:number) => f3.includes(index)),
              chartComponentList: mainPanelState.chartComponentList.filter((_:any, index:number) => f3.includes(index)),
              chartIds: [...f3]
            },
            f4: {
              chartList: mainPanelState.chartList.filter((_:any, index:number) => f4.includes(index)),
              chartComponentList: mainPanelState.chartComponentList.filter((_:any, index:number) => f4.includes(index)),
              chartIds: [...f4]
            }
          }
        })
        break;

      default:
        break;
    }
  }

  if (layout === "default" && locations.default)
    return(
      <div className={styles.chartPanelDefault}>
        <ChartPanel 
          charts={locations.default}
          dragFunctions={dragFunctions}
        />
      </div>
    )

  if (layout === "vertical" && locations.vertical)
    return(
      <div className={styles.chartPanelVertical}>
        <div 
          className={styles.vert1}
          onDragOver={() => dragOver("vert1")} 
        >
          <ChartPanel 
            charts={locations.vertical.vert1}
            dragFunctions={dragFunctions}
          />
        </div>
        <div 
          className={styles.vert2}
          onDragOver={() => dragOver("vert2")}
        >
          <ChartPanel 
            charts={locations.vertical.vert2}
            dragFunctions={dragFunctions}
          />
        </div>
      </div>
    )

  if (layout === "horizontal" && locations.horizontal)
    return(
      <div className={styles.chartPanelHorizontal}>
        <div 
          className={styles.horiz1}
          onDragOver={() => dragOver("horiz1")}
        >
          <ChartPanel 
            charts={locations.horizontal.horiz1}
            dragFunctions={dragFunctions}
          />
        </div>
        <div 
          className={styles.horiz2}
          onDragOver={() => dragOver("horiz2")}
        >
          <ChartPanel 
            charts={locations.horizontal.horiz2}
            dragFunctions={dragFunctions}
          />
        </div>
      </div>
    )

  if (layout === "fourPanels" && locations.fourPanels)
    return(
      <div className={styles.chartPanelFour}>
        <div className={styles.fourTop}>
          <div 
            className={styles.f1}
            onDragOver={() => dragOver("f1")}
          >
            <ChartPanel 
              charts={locations.fourPanels.f1}
              dragFunctions={dragFunctions}
            />
          </div>
          <div 
            className={styles.f2}
            onDragOver={() => dragOver("f2")}
          >
            <ChartPanel 
              charts={locations.fourPanels.f2}
              dragFunctions={dragFunctions}
            />
          </div>
        </div>
        <div className={styles.fourBottom}>
          <div 
            className={styles.f3}
            onDragOver={() => dragOver("f3")}
          >
            <ChartPanel 
              charts={locations.fourPanels.f3}
              dragFunctions={dragFunctions}
            />
          </div>
          <div 
            className={styles.f4}
            onDragOver={() => dragOver("f4")}
          >
            <ChartPanel 
              charts={locations.fourPanels.f4}
              dragFunctions={dragFunctions}
            />
          </div>
        </div>
      </div>
    )

  return null;
}

export default ChartManager;