import Chart from "react-apexcharts";

// Reference: https://apexcharts.com/docs/options/annotations/
const options = {
    type: 'area',
    chart: {
      id: 'area',
      height: 10,
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      grid: {
        show: true,
        yaxis: {
          lines: {
            show: false
          }
        },
        xaxis: {
          lines: {
            show: false
          }
        }
      }
    },
    tooltip: {
      followCursor: true,
      fixed: {
        enabled: false
      },
      marker: {
        show: false,
      },
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function () {
            return ''
          }
        }
      },
    },
    /*show: {
      show: false
    },*/
    marker: {
      show: false,
    },
    xaxis: {
      labels: {
        show: false
      }
    },
    yaxis: {
      labels: {
        show: true
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 100]
      }
    }
  };

  export default options;