import React, { useRef, useEffect, useState, useReducer } from "react";
import IdeasHistoryProps from "../../@types/IdeasHistoryProps";
import styles from './styles.module.css';

type GraphHistoryState = { 
  index: number;
  numberOfElements: number;
  time: string;
}

var lastMapKey = 0;
// HistoryMap stores all graph states
// the key, is period in time, so the values are sequential
// and the values, are some graph state values related to that period
const historyMap = new Map<number, GraphHistoryState>();
historyMap.set(lastMapKey, {index: 0, numberOfElements: 0, time: '0'});

const IdeasHistoryController = (props: IdeasHistoryProps) => {

  const [isLive, setIsLive] = useState(true);
  const [isPlaying, setPlay] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // If the latest index is the same, but the number of elements are diferent, then update the historyMap with
  // the new value. It is necessary to avoid scenarios of same index with diferent number of elements.
  if (historyMap.get(lastMapKey)?.index === props.index &&
      historyMap.get(lastMapKey)?.numberOfElements !== props.numberOfElements) {
    historyMap.set(lastMapKey, {index: props.index, numberOfElements: props.numberOfElements, time: props.time});

    // If the latest index is diferent from the new index, then
    // store the new state in the historyMap.
  } else if (historyMap.get(lastMapKey)?.index !== props.index) {
    lastMapKey++;
    historyMap.set(lastMapKey, {index: props.index, numberOfElements: props.numberOfElements, time: props.time});
  }

  const handleReset = () => {
    setIsLive(true);
    props.handleUserIndex(0);
  };

  const handlePlay = () => {
    setPlay(!isPlaying);
  };


  const handleIndexChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    let selectedValue : number = +event.currentTarget.value;
    props.handleUserIndex(historyMap.get(selectedValue)!.index);

    setSelectedIndex(selectedValue);
    setIsLive(false);
  };

  useEffect(() => {
    
    return () => {
    };
  },[selectedIndex, isLive, isPlaying]);

  return(
    <div>
      <div>
        <p>SELECTED: Index: {historyMap.get(selectedIndex)?.index} Elements: {historyMap.get(selectedIndex)?.numberOfElements} Timestamp: {historyMap.get(selectedIndex)?.time} Position: {selectedIndex}</p>
        <p>LIVE:     Index: {historyMap.get(lastMapKey)?.index} Elements: {historyMap.get(lastMapKey)?.numberOfElements} Timestamp: {historyMap.get(lastMapKey)?.time}</p>
        <p>lastKey: {lastMapKey} selectedIndex: {selectedIndex}</p>
      </div>
      <div className={styles.container}>
        <div className={styles.timeframe}>
          { isPlaying ? <button className={styles.controlButton} onClick={handlePlay}><b>||</b></button>
                      : <button className={styles.controlButton} onClick={handlePlay}><b>&#9658;</b></button>
          }
          <input type="range" min="1" max={lastMapKey}
                 className={styles.seekbar}
                 onChange={handleIndexChanged}
                 value={(isLive) ? lastMapKey : selectedIndex}>
          </input>
        </div>
        <div className={styles.options}>
          { isLive ? <button className={styles.histButton} onClick={handleReset}><b>Live</b></button>
                   : <button className={styles.histButton} onClick={handleReset}>Live</button>
          }
        </div>
      </div>
    </div>
  )
}

export default IdeasHistoryController;