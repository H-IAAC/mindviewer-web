import React, { useRef, useEffect, useState, useReducer } from "react";
import IdeasHistoryProps from "../../@types/IdeasHistoryProps";

const indexHistory = new Set<number>();

const IdeasHistoryController = (props: IdeasHistoryProps) => {

  indexHistory.add(props.index);

  const [test, setTest] = useState('test');

  useEffect(() => {

    
    return () => {

    };
  },[]);

  let hist = '';
  indexHistory.forEach((index) => {
    hist += ' | ' + index;
  });

  return(
    <div>
      <div>
        <p>Index: {props.index} Elements: {props.numberOfElements} - Timestamp: {props.time}</p>
      </div>
      <div>
        <p>{hist}</p>
      </div>
    </div>
  )
}

export default IdeasHistoryController;