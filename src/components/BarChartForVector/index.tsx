import React, { useState } from 'react';
import styles from './styles.module.css';

import Paper from '@material-ui/core/Paper';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  BarSeries,
  Title,
  Legend,
  Tooltip
} from '@devexpress/dx-react-chart-material-ui';
import { ValueScale, Viewport, EventTracker, Stack, ArgumentScale } from '@devexpress/dx-react-chart';
import { scaleBand } from '@devexpress/dx-chart-core';

import IDataTree from '../../interfaces/IDataTree';

import ColorPalettes from '../../utils/ColorPalettes';
import { addMinutes } from 'date-fns';

const randomColor = () => {
  const hex = (Math.random()*0xFFFFFF<<0).toString(16);
  return `#${hex}`;
}

const timeout = (delay: number) => {
  return new Promise((res) => setTimeout(res, delay));
}

const date = new Date(2021,10,20);
const testData: any = [
  {
    labelChart: "Dado1",
    values: [
      {x: date, y: [1,4,3,5,2]},
      {x: addMinutes(date,1), y: [2,5,4,4,3]},
      {x: addMinutes(date,2), y: [3,4,5,3,4]},
      {x: addMinutes(date,3), y: [4,3,4,2,5]},
      {x: addMinutes(date,4), y: [5,2,3,1,4]},
      {x: addMinutes(date,5), y: [4,1,2,2,3]},
      {x: addMinutes(date,6), y: [3,2,1,3,2]},
      {x: addMinutes(date,7), y: [2,3,2,4,1]},
      {x: addMinutes(date,8), y: [1,4,3,5,2]},
      {x: addMinutes(date,9), y: [2,5,4,4,3]},
      {x: addMinutes(date,10), y: [3,4,5,3,4]},
    ]
  },
  {
    labelChart: "Dado2",
    values: [
      {x: date, y: [5,2,3,1,4]},
      {x: addMinutes(date,1), y: [4,1,2,2,3]},
      {x: addMinutes(date,2), y: [3,2,1,3,2]},
      {x: addMinutes(date,3), y: [2,3,2,4,1]},
      {x: addMinutes(date,4), y: [1,4,3,5,2]},
      {x: addMinutes(date,5), y: [2,5,4,4,3]},
      {x: addMinutes(date,6), y: [3,4,5,3,4]},
      {x: addMinutes(date,7), y: [4,3,4,2,5]},
      {x: addMinutes(date,8), y: [3,2,3,1,4]},
      {x: addMinutes(date,9), y: [2,1,2,2,3]},
      {x: addMinutes(date,10), y: [1,2,1,3,2]},
    ]
  }
]

//Classe do gráfico de barras
class BarChartForVector {

  /*
    data -> Dados de um certo nó da árvore de elementos;
    dataChart -> Dados que serão lidos para montagem do gráfico. Obtido após um processamento de 'data';
    previousDataChart -> Possui o mesmo formato de 'dataChart' e serve para auxiliar na atualização de 'dataChart';
    elementRef -> Elemento de referência para definição do range dos eixos do gráfico;
    enableRefresh -> Variável que sinaliza se o gráfico deve ser atualizado;
    defaultInterval -> Intervalo mínimo padrão de visualização em x;
    range -> Intervalo total em x que pode ser visualizado;
    viewport -> Intervalo em x que está sendo visualizado;
    vectorAux -> Vetor auxiliar para montagem de 'dataChart';
    timeMultiplier -> Armazena o multiplicador do tempo, em milissegundos (util para os modais de edição)
    yInterval -> Intervalo do eixo y
    autoRange -> Variável que indica se gráfico está com range automático no eixo y
    title -> Título do gráfico
    active -> Indica se o gráfico está ativo (ou seja, se ele permite atualizações)
  */
  private data: IDataTree[] = testData;
  private dataChart: Array<any>;
  private previousDataChart: Array<any>;
  private elementRef: any;
  private viewport: number;
  private enableRefresh: boolean;
  private defaultInterval = 10000;
  private timeMultiplier: number = 0;
  private yInterval = [0,1];
  private autoRange: boolean;
  private title: string = "";
  private range = 0;
  //private sliderValue = 0;
  private objAux: any;
  private vectorAux: Array<any>;
  private active: boolean = false;
  private colors: string[] = ColorPalettes[0];
  private loading: boolean = true;
  private id: number = 0;
  private colorsFixed = false;
  private time: number | undefined;
  private tooltipActive: boolean = false;
  private showAxisGrid = false;
  
  /*
    chartRootComponent -> Componente estilizado do gráfico;
    titleRootComponent -> Componente estilizado do título;
  */
  private chartRootComponent = (props: Chart.RootProps) => (<div className={styles.chartComponent}>{props.children}</div>);
  private titleRootComponent = (props: Title.TextProps) => (<div className={styles.chartTitle}>{props.text}</div>);
  private legendRootComponent = (props: Legend.RootProps) => (<div className={styles.legendComponent} >{props.children}</div>);
  private legendItemComponent = (props: Legend.ItemProps) => (<div className={styles.legendItemComponent} >{props.children}</div>);
  private tooltipContentComponent = (props: Tooltip.ContentProps) => {
    const xValue: Date = this.dataChart[this.viewport][props.targetItem.point]["time"];
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
          {props.targetItem.series}[{props.targetItem.point}]: {parseFloat(props.text).toFixed(2)}
        </p>
      </div>
    )
  };

  constructor (/*data: IDataTree,*/ yInterval: number[], autoRange: boolean, title: string) {
    //this.data.push(data);
    this.dataChart = [];
    this.previousDataChart = [];
    this.enableRefresh = true;
    this.vectorAux = [];
    this.objAux = {};
    this.yInterval = yInterval;
    this.autoRange = autoRange;
    this.title = title;
    // this.constructDataChart();
    // if (data.children && data.type !== 'codelet') {
    //   this.elementRef = data.children[0].values
    // } else {
    //   this.elementRef = data.values
    // }

    this.viewport = 0;
    this.active = true;
    this.setData(this.data);
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
        this.elementRef = data[0].values;
        this.time = this.elementRef[this.elementRef.length-1].x.getTime();
        // this.viewport = {
        //   argumentStart: Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x)-this.defaultInterval,
        //   argumentEnd: Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x)
        // }
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
    this.range = this.dataChart.length
    console.log(this.range);
  }

  public setViewPort () {
    this.viewport = this.dataChart.length-1;
  }

  /*
    setViewPortWithSlider: define o novo 'viewport', quando o slider é mudado
  */
  public setViewPortWithSlider (value: number) {
    if (this.range === 0) return;

    if (value == 100) {
      this.setViewPort();
      //console.log(this.dataChart[this.dataChart.length-1])
      this.time = this.dataChart[this.dataChart.length-1][0]["time"].getTime();
      //this.fixColors();
      return;
    }
    
    this.viewport = Math.floor((value*0.01)*this.range);
    //console.log(this.dataChart[this.viewport])
    this.time = this.dataChart[this.viewport][0]["time"].getTime();
    //this.fixColors();
  }

  public handleStep (step: number) {
    if (this.range === 0) return 100;

    const viewportAux = this.viewport + step;
    
    if (viewportAux < 0) return 0;
    if (viewportAux >= this.dataChart.length) return 100;

    this.viewport = viewportAux;
    this.time = this.dataChart[this.viewport][0].x.getTime();
    //this.fixColors();
    
    const sliderValue = this.viewport*100/(this.range);
    return (sliderValue);
  }

  public findViewPortValueWithTime(time: number) {
    if (time) {
      const difs = this.dataChart.map(item => (
        Math.abs(item[0]["time"].getTime()-time)
      ))

      const min = Math.min(...difs)
      const index = difs.findIndex(item => item === min)
      const viewport = index*100/(this.range)
      return (viewport)
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
    return ([this.elementRef[0].x, Math.max(this.defaultInterval, this.elementRef[this.elementRef.length-1].x)])
  }

  public async fixColors () {
    // let doc: HTMLElement | null;
    // while (true) {
    //   doc = document.getElementById(`paper${this.id}`);
    //   if (doc) break;
    //   await timeout(100);
    // }
    
    // const rects = doc.getElementsByTagName("rect");
    // const texts = doc.getElementsByTagName("text");

    // while (true) {
    //   if (rects.length <= 1 || texts.length === 0) {
    //     await timeout(100);
    //   } else {
    //     break;
    //   }
    // }

    // // console.log(doc);
    // // console.log(rects);
    // // console.log(texts);

    // const elements = this.getElements();
    // let initial = 0

    // for (let i = 0; i < texts.length; i++) {
    //   const item = texts[i];
    //   if (item.innerHTML === elements[0].label) {
    //     initial = i;
    //     break;
    //   }
    // }

    // for (let i = 0; i < rects.length-1; i++) {
    //   const color = `#${this.colors[i]}`;
    //   rects[i+1].style.fill = color;
    //   texts[initial+i].style.fill = color;
    // }
    
    // this.colorsFixed = true;
  }

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
  public setTooltipActive (value: boolean) {
    this.tooltipActive = value; 
    setTimeout(() => this.setViewPortWithSlider(100), 5);
  }
  public setShowAxisGrid(value: boolean) {this.showAxisGrid = value}

  public getDefaultInterval() { return this.defaultInterval }
  public getTimeMultiplier() { return this.timeMultiplier }
  public getYInterval() { return this.yInterval }
  public getAutoRange() { return this.autoRange }
  public getTitle() { return this.title }
  public getShowAxisGrid() {return this.showAxisGrid}

  public getTime() { 
    if (this.time)
      return `${new Date(this.time).toLocaleString()}.${(this.time%1000).toString().padStart(3,"0")}`;
    else
      return ""
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
      if (this.data[0].values) {
        for (let j = 0; j < this.data[0].values.length; j++) {
          this.vectorAux = [];
          
          let yAux: any = this.data[0].values[0].y
          for (let k = 0; k < yAux.length; k++) {
            this.objAux = {};
            this.objAux["x"] = k;
            this.objAux["time"] = this.data[0].values[j].x;
            for (let i = 0; i < this.data.length; i++) {
              const element: any = this.data[i];
              if (element.values) this.objAux[`y${i}`] = element.values[j].y[k];    
            }
            this.vectorAux.push(this.objAux);
          }
          
          this.previousDataChart.push(this.vectorAux);
          this.dataChart.push(this.vectorAux);
        }
        this.setViewPort();
      }
      //this.fixColors()
    }
    else { 
      if (this.data[0].values) {
        this.vectorAux = [];
        let len = this.data[0].values.length;
        let yAux: any = this.data[0].values[len-1].y
        for (let k = 0; k < yAux.length; k++) {
          this.objAux = {};
          this.objAux["x"] = k;
          this.objAux["time"] = this.data[0].values[len-1].x;
          for (let i = 0; i < this.data.length; i++) {
            const element: any = this.data[i];
            if (element.values) this.objAux[`y${i}`] = element.values[len-1].y[k];    
          }
          this.vectorAux.push(this.objAux);
        }
      }
      
      this.previousDataChart.push(this.vectorAux);
      if (this.enableRefresh) {
        this.dataChart = [...this.previousDataChart];
        this.setViewPort();
      }
      //this.fixColors();
    }
  }

  /*
    reset: reinicializa os dados do gráfico
  */
  public reset() {
    this.active = false;
    this.previousDataChart = [];
    this.dataChart = [];
    this.colorsFixed = false;
  }
  
  /*
    getView: retorna a visualização do gráfico
  */
  public getView () {
    return (
      
      <Paper className={styles.chartPaper} id={`paper${this.id}`}>
        {(this.dataChart.length !== 0 && this.active)?
          <>
            <Chart
              data={this.dataChart[this.viewport]}
              rootComponent={this.chartRootComponent}
            >
              {/*Parte que gerencia as escalas*/}
              
              {!this.autoRange &&
                <ValueScale 
                  modifyDomain={() => this.yInterval} 
                />
              }
                
              <ArgumentScale factory={scaleBand} />
              <ArgumentAxis />
              <ValueAxis 
                showLine={true} 
                showTicks={true}
                showGrid={this.showAxisGrid}
              />

              {/*Parte que gerencia o tipo de visualização*/}
              
              {
                this.data.map((item, index) => (
                  <BarSeries 
                    name={item.labelChart}
                    valueField={`y${index}`}
                    argumentField="x" 
                    color={index < this.colors.length? `#${this.colors[index]}` : undefined}
                  />
                ))
              }

              {/* <BarSeries
                valueField="y"
                argumentField="name"
                color={this.colorsFixed? undefined:'#fff'}
              /> */}
              <Stack />

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
                <Tooltip 
                  // targetItem={this.targetItem} 
                  // onTargetItemChange={this.changeTargetItem}
                  // sheetComponent={this.tooltipSheetComponent}
                  contentComponent={this.tooltipContentComponent}
                />
              }
              
            </Chart>
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
    
    )
  }
}

export default BarChartForVector;