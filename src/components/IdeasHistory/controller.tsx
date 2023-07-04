import React, { useRef, useEffect, useState, useReducer } from "react";
import IdeasHistoryProps from "../../@types/IdeasHistoryProps";
import styles from './styles.module.css';

type HistoryMapType = { 
  [id: number]: number; 
}

const historyMap: HistoryMapType = {};

const IdeasHistoryController = (props: IdeasHistoryProps) => {

  historyMap[props.index] = props.numberOfElements;

  /*const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIndex(+event.target.value);
  };

  const handleClick = () => {
    props.handleUserIndex(+selectedIndex);
  };*/

  const handleSelectIndex = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    console.log('selected: ' + event.currentTarget.id);
    props.handleUserIndex(+event.currentTarget.id);
  };

  const handleReset = () => {
    props.handleUserIndex(0);
  };

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {

    
    return () => {

    };
  },[]);

  const renderTD = () => {
    let td = [];
    for (let i in historyMap) {
      td.push(<span id={i} onClick={(event) => handleSelectIndex(event)} className={styles.dot2}></span>);
    }
    return td;
  };

  return(
    <div>
      <div>
        <p>Index: {props.index} Elements: {props.numberOfElements} - Timestamp: {props.time}</p>
      </div>
      <div className={styles.container}>
        <div className={styles.timeframe}>
          {renderTD()}
        </div>
        <div className={styles.options}>
          <button className={styles.histButton} onClick={handleReset}>Live</button>
        </div>
      </div>
    </div>
  )
}

export default IdeasHistoryController;