import React, { useEffect, useState } from "react";
import IdeasHistoryProps from "../../@types/IdeasHistoryProps";
import Chart from "react-apexcharts";
import ChartOptions from './apexChart';
import styles from './styles.module.css';

type GraphHistoryState = { 
  index: number;
  numberOfElements: number;
  time: string;
}
var isLive: boolean = true;
var selectedFrame = 1;

// HistoryMap stores all graph states, where the key, is period in time,
// so the values are sequential. And the values, are some graph state
// values related to that period.
const historyMap = new Map<number, GraphHistoryState>();
var lastMapKey = 0;

const IdeasHistoryController = (props: IdeasHistoryProps) => {

  const [isPaused, setPause] = useState(false);
  const [isChartShown, setIsChartShown] = useState(false);
  // Initial state must be and array with all 'numberOfElements' already stored in historyMap, it is
  // necessary to set all values because when user close and re-open the screen, this state is reset.
  const [chartSeries, setChartSeries] = useState<number[]>(Array.from(historyMap.values()).map(v => v.numberOfElements));

  useEffect(() => {
    // If the latest index is the same, but the number of elements are diferent, then update the historyMap with
    // the new value. It is necessary to avoid scenarios of same index with diferent number of elements.
    if (historyMap.get(lastMapKey)?.index === props.index &&
        historyMap.get(lastMapKey)?.numberOfElements !== props.numberOfElements) {
      historyMap.set(lastMapKey, {index: props.index, numberOfElements: props.numberOfElements, time: props.time});

      const newChartSeries = chartSeries.map((value, i) => {
        if (i === (lastMapKey - 1)) {
          return props.numberOfElements;
        } else {
          return value;
        }
      });
      setChartSeries(newChartSeries);

      // If the latest index is diferent from the new index, then
      // store the new state in the historyMap.
    } else if (historyMap.get(lastMapKey)?.index !== props.index) {

      lastMapKey++;
      historyMap.set(lastMapKey, {index: props.index, numberOfElements: props.numberOfElements, time: props.time});
      setChartSeries([...chartSeries, props.numberOfElements]);
      playNextFrame();
    }

  }, [props.index, props.numberOfElements]);

  useEffect(() => {
    if (isPaused && isLive) {
      selectedFrame = lastMapKey;
      props.handleUserIndex(historyMap.get(lastMapKey)!.index);
      isLive = false;

    } else if (isPaused && !isLive) {
      props.handleUserIndex(historyMap.get(selectedFrame)!.index);
    }
    
    return () => {
    };
  },[isPaused]);

  const playNextFrame = () => {
    if (!isLive && !isPaused) {
      selectedFrame++;
      props.handleUserIndex(historyMap.get(selectedFrame)!.index);
    }
  }

  const handleReset = () => {
    isLive = true;
    props.handleUserIndex(0);
  };

  const handlePlay = () => {
    setPause(!isPaused);
  };

  const handleIndexChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectedFrame = +event.currentTarget.value;
    props.handleUserIndex(historyMap.get(selectedFrame)!.index);
    isLive = false;
    setPause(true);
  };

  const handleMouseOverChart = () => { setIsChartShown(true); }
  
  const handleMouseOutChart= () => { setIsChartShown(false); }

  return(
    <div className={styles.timeControl}>
      {/* Pause button */}
      { isPaused ? <button className={styles.playButton} onClick={handlePlay}><b>&#9658;</b></button>
                 : <button className={styles.playButton} onClick={handlePlay}><b>||</b></button>
      }

      {/* Seek bar and Chart */}
      <div className={styles.seekbar}>
        { isChartShown &&
          <Chart options={ChartOptions} series={[{ data: chartSeries}]} type="area" height="90%" className={styles.chart}/>
        }
        <input type="range" min="1" max={lastMapKey}
              className={styles.historyProgressBar}
              onChange={handleIndexChanged}
              onMouseOver={handleMouseOverChart}
              value={(isLive) ? lastMapKey : selectedFrame}>
        </input>

      </div>

      {/* Live button */}
      { isLive ? <button className={styles.liveButton} onClick={handleReset}><b>Live</b></button>
               : <button className={styles.liveButton} onClick={handleReset}>Live</button>
      }
      <div className={styles.chartLimiter} onMouseOut={handleMouseOutChart}></div>
    </div>
  )
}

export default IdeasHistoryController;