/*
  Esse componente não está mais sendo usado
*/

import React, { useState } from 'react';
import styles from './styles.module.css';
import Paper from '@material-ui/core/Paper';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  BarSeries, 
  ZoomAndPan,
  Title,
  Legend
} from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale, ValueScale, Viewport } from '@devexpress/dx-react-chart';
import IData from '../../interfaces/IData';

class ChartObject {
  private data: IData[];
  private viewport: Viewport;
  private enableRefresh: boolean;
  private defaultInterval = 10000;
  private range = 0;
  private sliderValue = 0;
  private type: string;
  
  private chartRootComponent = (props: Chart.RootProps) => (<div className={styles.chartComponent} >{props.children}</div>);
  private titleRootComponent = (props: Title.TextProps) => (<div className={styles.chartTitle}>{props.text}</div>);
  private legendRootComponent = (props: Legend.RootProps) => (<div className={styles.legendComponent} >{props.children}</div>);
  private legendItemComponent = (props: Legend.ItemProps) => (<div className={styles.legendItemComponent} >{props.children}</div>);

  constructor (data: IData[], type: string) {
    this.data = data;
    this.type = type;
    this.enableRefresh = true;
    this.viewport = {
      argumentStart: 0,
      argumentEnd: this.defaultInterval
    }
  }

  public setData (data: any) { 
    if (this.enableRefresh) {
      this.data = data;
      this.viewport = {
        argumentStart: Math.max(this.defaultInterval, data[data.length-1].argument)-this.defaultInterval,
        argumentEnd: Math.max(this.defaultInterval, data[data.length-1].argument)
      }
    }
  };

  public defineRange () {
    this.range = Math.max(this.data[this.data.length-1].argument-this.data[0].argument-this.defaultInterval,0);
    console.log(this.range);
  }

  public setViewPortWithSlider (value: number) {
    if (this.range === 0) return;

    this.viewport = {
      argumentStart: this.data[0].argument+(value*0.01)*this.range,
      argumentEnd: (this.data[0].argument+(value*0.01)*this.range)+this.defaultInterval
    }
  }

  public getDomain () {
    if (this.data.length === 0) {
      return([0,this.defaultInterval])
    }
    return ([this.data[0].argument, Math.max(this.defaultInterval, this.data[this.data.length-1].argument)])
  }

  public setEnableRefresh (value: boolean) { this.enableRefresh = value }

  public getView () {
    return (
      
      <Paper className={styles.chartPaper}>
        <Chart
          data={this.data}
          rootComponent={this.chartRootComponent}
        >
          {/*Parte que gerencia as escalas*/}
          {
            this.type === 'line'?
            (
              <ArgumentScale 
                modifyDomain={() => this.getDomain()}
              /> 
            ) : (
              <ValueScale 
                modifyDomain={() => [0,1]} 
              />
            )
          }
          <ArgumentAxis />
          <ValueAxis 
            showLine={true} 
            showTicks={true}
          />

          {/*Parte que gerencia o tipo de visualização*/}
          {
            this.type === 'line'?
            (
              <LineSeries 
                name={this.data.length !== 0 ? this.data[0].name : undefined}
                valueField="value" 
                argumentField="argument" 
              />
            )
            :
            (
              <BarSeries
                valueField="value"
                argumentField="name"
              />
            )
          }
        
          {/*Parte que gerencia interações com o gráfico*/}
          {/* <EventTracker />
          <Tooltip /> */}
          {
            this.type === 'line'?
            (
              <ZoomAndPan 
                viewport={this.viewport}
                interactionWithArguments={'none'}
                interactionWithValues={'none'}
              />
            )
            :null
          }
          
          {/*Parte que gerencia legenda e titulo*/}
          {
            this.type === 'line'?
            (
              <Legend
                position="bottom"
                rootComponent={this.legendRootComponent}
                itemComponent={this.legendItemComponent}
              />
            )
            :null
          }
          <Title 
            text="Teste" 
            textComponent={this.titleRootComponent}
          />
        </Chart>
      </Paper>
    
    )
  }
}

export default ChartObject;