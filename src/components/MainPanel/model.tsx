import React from 'react';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';

import IDataTree from '../../interfaces/IDataTree';
import { IMindProperties } from '../../interfaces/IMindProperties';

import axios from 'axios';
import DataConstructor from '../../utils/DataConstructor';
import Interval from '../../utils/Interval';
import MainPanelModelType from '../../@types/MainPanelModelType';
import LineChartModel from '../Charts/LineChart/lineChartModel';
import LineChartActionsModel from '../Charts/LineChart/lineChartActionsModel';
import IChart from '../../interfaces/IChart';
import BarChartModel from '../Charts/BarChart/barChartModel';
import BarChartActionsModel from '../Charts/BarChart/barChartActionsModel';
import LineChartForVectorModel from '../Charts/LineChartForVector/lineChartForVectorModel';
import LineChartForVectorActionsModel from '../Charts/LineChartForVector/lineChartForVectorActionsModel';
import LineChartForVector from '../Charts/LineChartForVector';
import BarChartForVectorModel from '../Charts/BarChartForVector/barChartForVectorModel';
import BarChartForVectorActionsModel from '../Charts/BarChartForVector/barChartForVectorActionsModel';
import BarChartForVector from '../Charts/BarChartForVector';
import ScatterChartModel from '../Charts/ScatterChart/scatterChartModel';
import ScatterChartActionsModel from '../Charts/ScatterChart/scatterChartActionsModel';
import ScatterChart from '../Charts/ScatterChart';
import HeatMapModel from '../HeatMap/heatMapModel';
import HeatMapActionsModel from '../HeatMap/heatMapActionsModel';
import HeatMap from '../HeatMap';

class MainPanelModel {
  private static instance: MainPanelModel;
  private data: IDataTree[];
  private chartList: any;
  private chartActionsList: ((index: number) => JSX.Element)[];
  private chartLocation: string[];
  private noConnection: boolean;
  private firstConnection: boolean;
  private url: string;
  private files: string[];
  private connectionActive: boolean;
  private dispatch: React.Dispatch<any>;

  private dataConstructor: DataConstructor;
  private connection: Interval;

  public static getInstance = () => {
    if (MainPanelModel.instance == null)
      MainPanelModel.instance = new MainPanelModel()
    return MainPanelModel.instance
  }

  constructor () {
    this.data = [];
    this.chartList = [];
    this.chartActionsList = [];
    this.noConnection = false;
    this.firstConnection = true;
    this.url = "";
    this.files = [];
    this.connectionActive = false;
    this.chartLocation = []
    this.dispatch = () => null;

    this.dataConstructor = new DataConstructor();
    this.connection = new Interval(this.fetch, 300);
  }

  public init = (initialState: MainPanelModelType, dispatch: React.Dispatch<any>) => {
    this.data = initialState.data;
    this.chartList = initialState.chartList;
    this.noConnection = initialState.noConnection;
    this.dispatch = dispatch;
  }

  public setUrl = (url: string) => {
    console.log(url);
    this.url = url;
  }

  public setFiles = (files: string[]) => {
    this.files = files;
  }

  public initDataFiles = () => {
    this.data = this.dataConstructor.initializeDataFromFiles(this.files);
    this.dispatch({
      type: "UPDATE_DATA",
      data: this.data
    })

    this.noConnection = false;
    this.dispatch({
      type: "UPDATE_NOCONNECTION",
      value: false
    })
  }

  public setConnectionActive = (value: boolean) => {
    this.connectionActive = value;
  }

  public setConnection = (value: boolean) => {
    if (value && this.url !== "") {
      if (this.chartList.length !== 0) {
        this.chartList.forEach((item: any) => {
          item.reset();
          item.setActive(true);
          // item.chart.reset();
          // item.chart.setActive(true);
        })
      }
      this.connection.start();
      if (!this.connectionActive) this.connectionActive = true;
    } else {
      this.connection.stop();
      if (this.connectionActive) this.connectionActive = false;
    }
  }

  public fetch = async () => {
    try {
      const response = await axios.get(`${this.url}`);
      const rawJson: IMindProperties = response.data;
      //console.log(rawJson)

      if (this.noConnection) {
        this.noConnection = false;
        this.dispatch({
          type: "UPDATE_NOCONNECTION",
          value: false
        })
      }

      if (this.firstConnection) {
        this.data = this.dataConstructor.initializeDataFromJson(rawJson);
        this.firstConnection = false;
        console.log(this.data)
      } else {
        this.data = this.dataConstructor.updateDataFromJson(rawJson,this.data);
      }

      this.dispatch({
        type: "UPDATE_DATA",
        data: [...this.data]
      })
    } catch (error) {
      console.log(error);
      this.noConnection = true;
      this.dispatch({
        type: "UPDATE_NOCONNECTION",
        value: true
      })
    }
  }

  /*
    updateChartList: Recebe um novo gráfico e o adiciona na lista de gráficos;
  */
  public updateChartList = (chart: any, chartComponent: any) => {
    this.chartList.push(chart);
    this.chartActionsList.push(chartComponent);
    this.chartLocation.push("default");
    this.dispatch({
      type: "UPDATE_CHARTLIST",
      chartList: [...this.chartList],
      chartComponentList: [...this.chartActionsList],
      chartLocation: [...this.chartLocation]
    })
    
    if (!this.connectionActive)
      this.updateCharts();
  }

  public addChart = (tabActive: number, options: {idTree: string[], type: string, xInterval: number, timeMultiplier: number, yInterval:Array<number>, autoRange: boolean, title: string}) => {
    const {idTree, type, xInterval, yInterval, autoRange, timeMultiplier, title} = options;
    let idTreeVector: string[][] = [];
    let requiredDataAll = []
    
    for (let i = 0; i < idTree.length; i++) {
      const idTreeItem = idTree[i];
      
      let idTreeList = idTreeItem.split("-").reverse();

      let idTreeListAux = [...idTreeList];
      let id;
      let requiredData = this.data[tabActive];
      let idCompare = ""
      
      while (idTreeListAux.length != 0) {
        id = idTreeListAux.pop();
        if (id) idCompare = idCompare !== "" ? idCompare+"-"+id : id;

        if (requiredData.children) {
          for (let i = 0; i < requiredData.children.length; i++) {
            if (requiredData.children[i].id === idCompare) {
              requiredData = requiredData.children[i];
              break;
            }
          }
        }
      }

      idTreeList.push(tabActive.toString());
      requiredDataAll.push({idTree: idTreeList, requiredData: requiredData});
    }

    for (let i = 0; i < requiredDataAll.length; i++) {
      const item = requiredDataAll[i];
      
      if (item.requiredData.values) {
        idTreeVector.push([...item.idTree])
      } else {
        if (item.requiredData.children) {
          for (let i = 0; i < item.requiredData.children.length; i++) {
            if (item.requiredData.children[i].values) {
              let idTreeAux2 = [...item.idTree];
              idTreeAux2.unshift(item.requiredData.children[i].id.split("-").slice(-1)[0]);
              idTreeVector.push(idTreeAux2)
            }
          }
        }
      }
    }

    let chart: any;
    let chartComponent: any
    if (type === 'line') {
      const newChart: IChart =  new LineChartModel(idTreeVector, xInterval, yInterval, autoRange, timeMultiplier,  title);
      const newChartActions =  new LineChartActionsModel(newChart);
      newChart.setActive(true);
      chart = newChart;
      chartComponent = (index: number) => (
        <LineChart
          chart={newChart} 
          chartActions={newChartActions}
          chartId={index} 
          removeChart={this.removeChart} 
          removeDataFromChart={this.removeDataFromChart}
        />
      )
    } else if (type === 'bar') {
      const newChart =  new BarChartModel(idTreeVector, yInterval, autoRange, title);
      const newChartActions =  new BarChartActionsModel(newChart);
      newChart.setActive(true);
      chart = newChart;
      chartComponent = (index: number) => (
        <BarChart
          chart={newChart} 
          chartActions={newChartActions}
          chartId={index} 
          removeChart={this.removeChart} 
          removeDataFromChart={this.removeDataFromChart}
        />
      )
    } else if (type === 'lineForVector') {
      const newChart =  new LineChartForVectorModel(idTreeVector, xInterval, yInterval, autoRange, timeMultiplier,  title);
      const newChartActions =  new LineChartForVectorActionsModel(newChart);
      newChart.setActive(true);
      chart = newChart;
      chartComponent = (index: number) => (
        <LineChartForVector
          chart={newChart} 
          chartActions={newChartActions}
          chartId={index} 
          removeChart={this.removeChart} 
          removeDataFromChart={this.removeDataFromChart}
        />
      )
    } else if (type === 'barForVector') {
      const newChart =  new BarChartForVectorModel(idTreeVector, yInterval, autoRange, title);
      const newChartActions =  new BarChartForVectorActionsModel(newChart);
      newChart.setActive(true);
      chart = newChart;
      chartComponent = (index: number) => (
        <BarChartForVector
          chart={newChart} 
          chartActions={newChartActions}
          chartId={index} 
          removeChart={this.removeChart} 
          removeDataFromChart={this.removeDataFromChart}
        />
      )
    } else if (type === 'scatter') {
      const newChart =  new ScatterChartModel(idTreeVector, xInterval, yInterval, autoRange, timeMultiplier,  title);
      const newChartActions =  new ScatterChartActionsModel(newChart);
      newChart.setActive(true);
      chart = newChart;
      chartComponent = (index: number) => (
        <ScatterChart
          chart={newChart} 
          chartActions={newChartActions}
          chartId={index} 
          removeChart={this.removeChart} 
          removeDataFromChart={this.removeDataFromChart}
        />
      )
    } else if (type === 'heatMap') {
      const newChart =  new HeatMapModel(idTreeVector, title);
      const newChartActions =  new HeatMapActionsModel(newChart);
      newChart.setActive(true);
      chart = newChart;
      chartComponent = (index: number) => (
        <HeatMap
          chart={newChart} 
          chartActions={newChartActions}
          chartId={index} 
          removeChart={this.removeChart} 
          removeDataFromChart={this.removeDataFromChart}
        />
      )
    }
    
    this.updateChartList(chart, chartComponent);
  }

  public addNewDataInChart = (tabActive: number, idTree: string[], key: number) => {
    let idTreeVector: string[][] = [];
    let requiredDataAll = []

    for (let i = 0; i < idTree.length; i++) {
      const idTreeItem = idTree[i];

      let idTreeList = idTreeItem.split("-").reverse();
      let idTreeListAux = [...idTreeList];
      let id;
      let requiredData = this.data[tabActive];
      let idCompare = ""
      
      while (idTreeListAux.length != 0) {
        id = idTreeListAux.pop();
        if (id) idCompare = idCompare !== "" ? idCompare+"-"+id : id;

        if (requiredData.children) {
          for (let i = 0; i < requiredData.children.length; i++) {
            if (requiredData.children[i].id === idCompare) {
              requiredData = requiredData.children[i];
              break;
            }
          }
        }
      }

      idTreeList.push(tabActive.toString());
      requiredDataAll.push({idTree: idTreeList, requiredData: requiredData});
    }

    //let idTreeVector = [];
    const idTreeToCompare = this.chartList[key].getIdTree().map((item: any) => [item[0],item[item.length-1]].join(","));

    for (let i = 0; i < requiredDataAll.length; i++) {
      const item = requiredDataAll[i];
      if (item.requiredData.values) {
        if (!idTreeToCompare.includes([item.idTree[0],item.idTree[item.idTree.length-1]].join(",")))
          idTreeVector.push([...item.idTree])
      } else {
        if (item.requiredData.children) {
          for (let i = 0; i < item.requiredData.children.length; i++) {
            if (item.requiredData.children[i].values) {
              let idTreeAux2 = [...item.idTree];
              idTreeAux2.unshift(item.requiredData.children[i].id.split("-").slice(-1)[0]);
              if (!idTreeToCompare.includes([idTreeAux2[0],idTreeAux2[idTreeAux2.length-1]].join(",")))
                idTreeVector.push(idTreeAux2)
            }
          }
        }
      }
    }

    //console.log([...this.chartList[key].getIdTree()])
    let idTreeAux = this.chartList[key].getIdTree();
    idTreeAux.push(...idTreeVector)
    console.log(idTreeAux)
    this.chartList[key].reset();
    this.chartList[key].setIdTree([...idTreeAux]);
    this.chartList[key].setActive(true);
    if (!this.connectionActive) {
      this.updateCharts();
    }
    //this.chartList[key].init();
    //this.updateChartsWithNoConnection();
    
    console.log("aki5")
  }

  /*
    removeChart: Recebe o índice de um determinado gráfico e o remove da lista de gráficos;
  */
  public removeChart = (id: number) => {
    console.log(id);

    this.chartList[id].reset();
    this.chartList.splice(id,1);
    this.chartActionsList.splice(id,1);
    this.chartLocation.splice(id,1);
    //LineChartActionsModel.removeInstance(id);
    this.dispatch({
      type: "UPDATE_CHARTLIST",
      chartList: [...this.chartList],
      chartComponentList: [...this.chartActionsList],
      chartLocation: [...this.chartLocation]
    })
    //console.log(this.chartList)
  }

  /*
    removeDataFromChart: Remove o dados de um determinado gráfico
  */
  public removeDataFromChart = (chartId: number, elementId: number[]) => {
    this.chartList[chartId].reset()
    const listAux = elementId.sort();
    for (let i = listAux.length-1; i >= 0; i--) {
      const element = listAux[i];
      let idTreeAux = this.chartList[chartId].getIdTree();
      idTreeAux.splice(element,1);
      this.chartList[chartId].setIdTree([...idTreeAux]);
    }
    this.chartList[chartId].setActive(true);
    if (!this.connectionActive) {
      this.updateCharts();
    }
    //this.updateChartsWithNoConnection();
  }

  /*
    updateCharts: atualiza a lista de gráficos com as novas informações de 'data'
  */
  public updateCharts = () => {
    this.chartList.forEach((item: any) => {
      //console.log(item)
      let requiredDataFinal: [IDataTree, string][] = [];
      let idTree = item.getIdTree();
      for (let i = 0; i < idTree.length; i++) {
        const element = idTree[i];
        
        let hasJson = false;
        let jsonId = "i";

        let idTreeAux = [...element];
        let id = idTreeAux.pop();
        if (id) {
          let requiredData = this.data[parseInt(id)];
          let idCompare = ""
          while (idTreeAux.length != 0) {
            id = idTreeAux.pop();

            if (id === "i") {
              hasJson = true;
              break;
            }

            idCompare = idCompare !== "" ? idCompare+"-"+id : id;

            if (requiredData.children) {
              for (let i = 0; i < requiredData.children.length; i++) {
                if (requiredData.children[i].id === idCompare) {
                  requiredData = requiredData.children[i];
                  break;
                }
              }
            }
          }

          if (hasJson) {
            if (idTreeAux.length !== 0) {
              jsonId = "i-"+idTreeAux.reverse().join("-");
            }
          }

          requiredDataFinal.push([requiredData, hasJson? jsonId : ""]);
        }
      }
      item.setData(requiredDataFinal);
    })
  }

  public updateChartLocation = (index: number, newLocation: string) => {
    this.chartLocation[index] = newLocation;
    this.dispatch({
      type: "UPDATE_CHARTLOCATION",
      chartLocation: [...this.chartLocation]
    })
  }

  /*
    updateChartsWithNoConnection: Função para atualização em casos de não haver conexão e auto-refresh desativado
    (Ainda é uma tentativa)
  */
  public updateChartsWithNoConnection = () => {
    if (!this.connectionActive)
    this.dispatch({type: "UPDATEVARIABLE"});
  }
}

export default MainPanelModel;