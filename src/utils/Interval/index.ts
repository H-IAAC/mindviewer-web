class Interval {
  private interval: NodeJS.Timeout | undefined;
  private time: number;
  private method: (() => void);

  constructor (method: () => void, time: number) {
    this.time = time;
    this.method = method;
  }

  /*
    start: Inicia a conexão com o servidor. Se os gráficos tiverem dados,
    a função reseta eles;
  */
  public start = () => {  
    const interval = setInterval(this.method, this.time);
    this.interval = interval;
  }

  /*
    stopConnection: Interrompe a conexão com o servidor
  */
  public stop = () => {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }  
}

export default Interval;