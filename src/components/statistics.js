import AbstractSmartComponent from './abstract-smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDuration, getDurationInHours} from '../utils/funcs';
import {BAR_HEIGHT, iconMap, pointGroupToType, TypeGroup, ChartVariables} from '../utils/consts';


const renderMoneyChart = (ctx, points) => {
  const moneyStats = points.reduce((totalCost, point) => {
    if (!totalCost[point.type]) {
      totalCost[point.type] = 0;
    }
    totalCost[point.type] += Number(point.basePrice);
    return totalCost;
  }, {});

  const types = Object.keys(moneyStats).map((type) => `${iconMap[type]} ${type.toUpperCase()}`);
  const costs = Object.values(moneyStats);
  ctx.height = BAR_HEIGHT * types.length;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: costs,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartVariables.LABELS_FONT_SIZE,
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: ChartVariables.TITLE_FONT_SIZE,
        position: `left`
      },
      layout: {
        padding: {
          left: ChartVariables.LAYOUT_PADDING_LEFT,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: ChartVariables.AXES_Y_PADDING,
            fontSize: ChartVariables.AXES_Y_FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: ChartVariables.BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: ChartVariables.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });


};

const renderTransportChart = (ctx, points) => {
  const transportStats = points.reduce((transportFrequency, point) => {
    const isTransport = pointGroupToType[TypeGroup.TRANSFER].includes(point.type);
    if (isTransport) {
      if (!transportFrequency[point.type]) {
        transportFrequency[point.type] = 0;
      }
      transportFrequency[point.type] += 1;
    }
    return transportFrequency;
  }, {});

  const types = Object.keys(transportStats).map((type) => `${iconMap[type]} ${type.toUpperCase()}`);
  const times = Object.values(transportStats);
  ctx.height = BAR_HEIGHT * types.length;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: times,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartVariables.LABELS_FONT_SIZE,
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: ChartVariables.TITLE_FONT_SIZE,
        position: `left`
      },
      layout: {
        padding: {
          left: ChartVariables.LAYOUT_PADDING_LEFT,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: ChartVariables.AXES_Y_PADDING,
            fontSize: ChartVariables.AXES_Y_FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: ChartVariables.BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: ChartVariables.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeChart = (ctx, points) => {
  const timeStats = points.reduce((timeSpent, point) => {
    if (!timeSpent[point.type]) {
      timeSpent[point.type] = getDuration(point.startDate, point.endDate);
    }
    timeSpent[point.type] += getDuration(point.startDate, point.endDate);
    return timeSpent;
  }, {});

  const types = Object.keys(timeStats).map((type) => `${iconMap[type]} ${type.toUpperCase()}`);
  const durations = Object.values(timeStats);
  ctx.height = BAR_HEIGHT * types.length;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: durations,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: ChartVariables.LABELS_FONT_SIZE,
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${getDurationInHours(val)}H`
        }
      },
      title: {
        display: true,
        text: `TIME-SPEND`,
        fontColor: `#000000`,
        fontSize: ChartVariables.TITLE_FONT_SIZE,
        position: `left`
      },
      layout: {
        padding: {
          left: ChartVariables.LAYOUT_PADDING_LEFT,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: ChartVariables.AXES_Y_PADDING,
            fontSize: ChartVariables.AXES_Y_FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: ChartVariables.BAR_THICKNESS,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: ChartVariables.MIN_BAR_LENGTH,
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class StatisticsComponent extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();
    this._pointsModel = pointsModel;

    this._moneyChart = null;
    this._transportChart = null;
    this._timeChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();
    this.rerender(this._points);
  }

  rerender(points) {
    this._points = points;

    super.rerender();
    this._renderCharts();
  }

  recoveryListeners() {}

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeCtx = element.querySelector(`.statistics__chart--time`);
    const points = this._pointsModel.getPointsAll();

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, points);
    this._transportChart = renderTransportChart(transportCtx, points);
    this._timeChart = renderTimeChart(timeCtx, points);
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeChart) {
      this._timeChart.destroy();
      this._timeChart = null;
    }
  }
}
