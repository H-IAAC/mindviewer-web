import React, { useState } from 'react';
import styles from './styles.module.css';
import './styles.css';

import Paper from '@mui/material/Paper';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  LineSeries,
  ZoomAndPan,
  Title,
  Legend,
  Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { ArgumentScale, EventTracker, SeriesRef, ValueScale, Viewport } from '@devexpress/dx-react-chart';
import { scaleTime } from 'd3-scale';

import IDataTree from '../../../interfaces/IDataTree';

import ColorPalettes from '../../../utils/ColorPalettes';

const randomColor = () => {
  const hex = (Math.random()*0xFFFFFF<<0).toString(16);
  return `#${hex}`;
}

const roundDecimal = (num: number, places: number) => {
	return +(num.toFixed(places));
}

//Classe do gráfico de linhas
class LineChart {
  /*
    data -> Dados de um certo nó da árvore de elementos;
    dataChart -> Dados que serão lidos para montagem do gráfico. Obtido após um processamento de 'data';
    previousDataChart -> Possui o mesmo formato de 'dataChart' e serve para auxiliar na atualização de 'dataChart';
    elementRef -> Elemento de referência para definição do range dos eixos do gráfico;
    enableRefresh -> Variável que sinaliza se o gráfico deve ser atualizado;
    defaultInterval -> Intervalo mínimo padrão de visualização em x;
    range -> Intervalo total em x que pode ser visualizado;
    viewport -> Intervalo em x que está sendo visualizado;
    objAux -> Objeto auxiliar para montagem de 'dataChart';
    timeMultiplier -> Armazena o multiplicador do tempo, em milissegundos (util para os modais de edição)
    yInterval -> Intervalo do eixo y
    autoRange -> Variável que indica se gráfico está com range automático no eixo y
    title -> Título do gráfico
    active -> Indica se o gráfico está ativo (ou seja, se ele permite atualizações)
  */
  private data: IDataTree[] = [];
  private dataChart: any;
  private previousDataChart: any;
  private elementRef: any;
  private viewport: Viewport;
  private enableRefresh: boolean;
  private defaultInterval = 10000;
  private timeMultiplier: number;
  private yInterval = [0,1];
  private autoRange: boolean;
  private title: string = "";
  private range = 0;
  //private sliderValue = 0;
  private objAux: any;
  private active: boolean = false;
  private colors: Array<string> = ColorPalettes[0];
  private loading: boolean = true;
  private id: number = 0;
  private time: number | undefined;
  private tooltipActive: boolean = false;
  private showAxisGrid = false;
  
  /*
    chartRootComponent -> Componente estilizado do gráfico;
    titleRootComponent -> Componente estilizado do título;
    legendRootComponent -> Componente estilizado da legenda;
    legendItemComponent -> Componente estilizado dos itens da legenda;
  */
  private chartRootComponent = (props: Chart.RootProps) => (<div className={styles.chartComponent}>{props.children}</div>);
  private titleRootComponent = (props: Title.TextProps) => (<div className={styles.chartTitle}>{props.text}</div>);
  private legendRootComponent = (props: Legend.RootProps) => (<div className={styles.legendComponent} >{props.children}</div>);
  private legendItemComponent = (props: Legend.ItemProps) => (<div className={styles.legendItemComponent} >{props.children}</div>);
  private tooltipContentComponent = (props: Tooltip.ContentProps) => {
    const xValue: Date = this.dataChart[props.targetItem.point]["time"];
    return(
      <div>
        <div 
          style={{
            borderBottom: "1px solid #bbb",
            marginBottom: "5px"
          }}
        >
          <p>
          {xValue.toLocaleString()}.{xValue.getMilliseconds()}
          </p>
        </div>
        <p>
          {props.targetItem.series}: {parseFloat(props.text).toFixed(2)}
        </p>
      </div>
    )
  };
  private tooltipArrowComponent = (props: Tooltip.ArrowProps) => (
    <div style={{height: '3px'}}>
      <div 
        style={{
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            width: 0, 
            height: 0,
            borderLeft: '10px solid transparent',
            borderRight: '10px solid transparent',
            borderTop: '10px solid #11118a'
          }}
        />
        <div
          style={{
            width: '8px',
            height: '8px',
            background: '#11118a',
            borderRadius: '10px',
          }}
      />
      </div>
    </div>
  )

  constructor (/*data: IDataTree,*/ defaultInterval: number, yInterval: number[], autoRange: boolean, timeMultiplier: number, title: string) {
    //this.data.push(data);
    this.dataChart = [];
    this.previousDataChart = [];
    this.objAux = {};
    this.defaultInterval = defaultInterval;
    this.timeMultiplier = timeMultiplier;
    this.yInterval = yInterval;
    this.autoRange = autoRange;
    this.title = title;

    // this.constructDataChart();
    // if (data.children && data.type !== 'codelet') {
    //   this.elementRef = data.children[0].values
    // } else {
    //   this.elementRef = data.values
    // }
    
    this.enableRefresh = true;
    this.viewport = {
      argumentStart: 0,
      argumentEnd: 10
    }
  }

  /*
    setData: Recebe os novos dados para atualizar o gráfico. Se o auto-refresh estiver ativado,
    ele insere os novos dados no gráfico. Caso contrário, só salva as novas informações sem plotar
    no gráfico.
  */
  public setData (data: any) { 
    if (this.active) {
      this.data = [...data];

      if (this.colors.length < this.data.length) {
        while (this.colors.length !== this.data.length) {
          this.colors.push(randomColor());
        }
      }

      if (this.data.length === 0) {
        this.loading = false;
        return;
      } else {
        this.loading = true;
      }

      this.constructDataChart();
      if (this.enableRefresh) {
        // if (data.children && data.type !== 'codelet') {
        //   this.elementRef = data.children[0].values
        // } else {
        //   this.elementRef = data.values
        // }
        this.elementRef = [...data[0].values];
        this.time = this.elementRef[this.elementRef.length-1].x.getTime();
        this.setViewPort();
      }
      // console.log(this.viewport);
      // console.log(this.data);
      // console.log(this.viewport);
      // console.log(this.dataChart);
    }
  };

  /*
    defineRange: calcula o novo 'range', quando auto-refresh é desativado
  */
  public defineRange () {
    this.range = Math.max(this.elementRef[this.elementRef.length-1].x.getTime()-this.elementRef[0].x.getTime()-this.defaultInterval,0);
    //console.log(this.range);
  }

  public setViewPort () {
    if (this.elementRef)
      this.viewport = {
        argumentStart: Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x.getTime())-this.defaultInterval,
        argumentEnd: Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x.getTime())
      }
  }

  /*
    setViewPortWithSlider: define o novo 'viewport', quando o slider é mudado
  */
  public setViewPortWithSlider (value: number) {
    if (this.range === 0) return;

    this.viewport = {
      argumentStart: this.elementRef[0].x.getTime()+(value*0.01)*this.range,
      argumentEnd: (this.elementRef[0].x.getTime()+(value*0.01)*this.range)+this.defaultInterval
    }
    this.time = Math.trunc((this.elementRef[0].x.getTime()+(value*0.01)*this.range)+this.defaultInterval);
  }

  public setViewPortWithXAxisSlider (value: number) {
    if (this.range === 0) return;

    const range = this.elementRef[this.elementRef.length-1].x.getTime()-this.elementRef[0].x.getTime()
    const newDefaultInterval  = -((range-1000)/100)*value+range;
    // console.log(this.defaultInterval)
    // console.log(newDefaultInterval);
    this.defaultInterval = Math.round(newDefaultInterval);
    this.timeMultiplier = 1000;

    const argumentStartAux = this.viewport.argumentEnd-this.defaultInterval;
    const argumentEndAux = Math.min(this.viewport.argumentStart+this.defaultInterval,this.elementRef[this.elementRef.length-1].x.getTime());

    if (argumentStartAux >= this.elementRef[0].x.getTime()) {
      this.viewport = {
        argumentStart: argumentStartAux,
        argumentEnd: this.viewport.argumentEnd
      }
    } else {
      this.viewport = {
        argumentStart: this.viewport.argumentStart,
        argumentEnd: argumentEndAux
      }
      this.time = Math.round(argumentEndAux);
    }
    this.defineRange();
  }

  public findViewPortValueWithTime(time: number) {
    if (time) {
      const viewport = (time-this.defaultInterval-this.elementRef[0].x.getTime())*100/this.range

      if (viewport<0) return 0;
      if (viewport>100) return 100;
      return viewport
    }
    return 100;
  }

  /*
    getDomain: Devolve o intervalo atual de visualização do gráfico
  */
  public getDomain () {
    if (this.elementRef.length === 0) {
      return([0,this.defaultInterval])
    }
    return ([this.elementRef[0].x.getTime(), Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x.getTime())])
  }

  public fixColors () {return}

  public deleteColors (items: number[]) {
    let index: number | undefined;
    while (items.length !== 0) {
      index = items.pop();
      index !== undefined && this.colors.splice(index,1);
    }
  }

  /*
    getters e setters
  */
  public setEnableRefresh (value: boolean) { this.enableRefresh = value }
  public setDefaultInterval (value: number) { this.defaultInterval = value }
  public setTimeMultiplier (value: number) { this.timeMultiplier = value }
  public setYInterval (value: Array<number>) { this.yInterval = value }
  public setAutoRange (value: boolean) { this.autoRange = value }
  public setTitle (value: string) { this.title = value }
  public setActive (value: boolean) { this.active = value }
  public setId (value: number) {this.id = value}
  public setColors (value: string[]) {this.colors = value}
  public setTooltipActive (value: boolean) {this.tooltipActive = value}
  public setShowAxisGrid(value: boolean) {this.showAxisGrid = value}

  public getDefaultInterval() { return this.defaultInterval }
  public getTimeMultiplier() { return this.timeMultiplier }
  public getYInterval() { return this.yInterval }
  public getAutoRange() { return this.autoRange }
  public getTitle() { return this.title }
  public getShowAxisGrid() {return this.showAxisGrid}

  public getTime(formatted=true) { 
    if (this.time) {
      if (formatted)
        return `${new Date(this.time).toLocaleString()}.${(this.time%1000).toString().padStart(3,"0")}`;
      return this.time;
    }
    else
      return ""
  }

  public getXAxisViewPortValue () {
    const value = 100*(-this.range)/(1000-this.range-this.defaultInterval);
    if (value<0) return 0;
    if (value>100) return 100;
    return value;
  }
  

  // getElements: Retorna os elementos atuais do gráfico
  public getElements() {
    const elements = this.data.map((item, index) => ({label: item.labelChart, color: this.colors[index]}));
    return elements;
  }

  /*
    constructDataChart: Constroi os novos 'previousDataChart' e 'dataChart'
  */
  public constructDataChart () {
    if (this.dataChart.length === 0) {
      // if (this.data.children && this.data.children[0].values && this.data.type !== 'codelet') {
      //   for (let j = 0; j < this.data.children[0].values.length; j++) {
      //     this.objAux = {};
      //     this.objAux["time"] = this.data.children[0].values[j].x;
         
      //     for (let i = 0; i < this.data.children.length; i++) {
      //       const element = this.data.children[i];
      //       if (element.values) this.objAux[`y${i}`] = element.values[j].y;
      //     }
      //     this.previousDataChart.push(this.objAux);
      //     this.dataChart.push(this.objAux);
      //   }
      // }
      //else 
      if (this.data[0].values) {
        for (let j = 0; j < this.data[0].values.length; j++) {
          this.objAux = {};
          this.objAux["time"] = this.data[0].values[j].x;
          for (let i = 0; i < this.data.length; i++) {
            const element = this.data[i];
            if (element.values) this.objAux[`y${i}`] = element.values[j].y;
            
          }
          //this.objAux["y0"] = this.data.values[j].y;
          
          this.previousDataChart.push(this.objAux);
          this.dataChart.push(this.objAux);
        }
      }
    }
    else {
      // if (this.data.children && this.data.children[0].values && this.data.type !== 'codelet') {
        
      //   this.objAux = {};
      //   let len = this.data.children[0].values.length;
      //   this.objAux["time"] = this.data.children[0].values[len-1].x;
        
      //   for (let i = 0; i < this.data.children.length; i++) {
      //     const element = this.data.children[i];
      //     if (element.values) this.objAux[`y${i}`] = element.values[len-1].y;
      //   }        
      // }
      //else 
      if (this.data[0].values) {

        this.objAux = {};
        let len = this.data[0].values.length;
        this.objAux["time"] = this.data[0].values[len-1].x;
        for (let i = 0; i < this.data.length; i++) {
          const element = this.data[i];
          if (element.values) this.objAux[`y${i}`] = element.values[len-1].y;
        }
        //this.objAux["y0"] = this.data.values[len-1].y;
      }

      this.previousDataChart.push(this.objAux);
      if (this.enableRefresh) this.dataChart = [...this.previousDataChart];
    }
  }

  /*
    reset: reinicializa os dados do gráfico
  */
  public reset() {
    this.active = false;
    this.previousDataChart = [];
    this.dataChart = [];
  }

  private targetItem: any = {point: 1, series: "Motor1"};
  private changeTargetItem = (targetItem: SeriesRef) => {
      // this.targetItem = {
      //   point: this.dataChart[targetItem.point]["time"],
      //   series: targetItem.series
      // }
      this.targetItem = targetItem;
  }
  /*
    getView: retorna a visualização do gráfico
  */
  public getView () {
    return (
      <>
      <Paper className={styles.chartPaper} id={`paper${this.id}`}>
        {(this.dataChart.length !== 0 && this.active) ?
          <>
            <Chart
              data={[...this.dataChart]}
              rootComponent={this.chartRootComponent}
            >
              {/*Parte que gerencia as escalas*/}
              
              <ArgumentScale 
                factory={scaleTime}
                modifyDomain={() => this.getDomain()}
              /> 

              {!this.autoRange &&
                <ValueScale 
                  modifyDomain={() => this.yInterval}
                />
              }
                
              <ArgumentAxis />
              <ValueAxis 
                showLine={true} 
                showTicks={true}
                showGrid={this.showAxisGrid}
              />

              {/*Parte que gerencia o tipo de visualização*/}
                
              {
                // (this.data.children && this.data.type !== 'codelet')?
                //   (
                //     this.data.children.map((item, index) => (
                //       <LineSeries 
                //         name={item.labelChart}
                //         valueField={`y${index}`}
                //         argumentField="time" 
                //       />
                //     ))
                //   ) : (
                //     <LineSeries 
                //       name={this.data.labelChart}
                //       valueField="y0" 
                //       argumentField="time" 
                //     />
                //   )
              }
              {
                this.data.map((item, index) => (
                  <LineSeries 
                    name={item.labelChart}
                    valueField={`y${index}`}
                    argumentField="time" 
                    color={index < this.colors.length? `#${this.colors[index]}` : undefined}
                  />
                ))
              }
            
              {/*Parte que gerencia interações com o gráfico*/}
              
              <ZoomAndPan 
                viewport={this.viewport}
                interactionWithArguments={'none'}
                interactionWithValues={'none'}
              />
              
              
              {/*Parte que gerencia legenda e titulo*/}
              
              <Legend
                position="bottom"
                rootComponent={this.legendRootComponent}
                itemComponent={this.legendItemComponent}
              />
                
              <Title 
                text={this.title} 
                textComponent={this.titleRootComponent}
              />

              <EventTracker />
              {this.tooltipActive &&
                <>                  
                  <Tooltip 
                    contentComponent={this.tooltipContentComponent}
                    //arrowComponent={this.tooltipArrowComponent}
                  />
                </>
              }
              
            </Chart>
            <p className={styles.xAxis}>Tempo</p>
            <p className={styles.yAxis}>Activation</p>
          </>
          :
          this.loading
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
                  Gráfico sem dados!
                </h1>
              </div>
            )

          
        }
        
      </Paper>
      </>
    )
  }
}

export default LineChart;