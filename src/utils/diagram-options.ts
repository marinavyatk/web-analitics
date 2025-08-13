import ru from 'apexcharts/dist/locales/ru.json'

export const donutColors = [
  '#f95f62',
  '#43b3ae',
  '#fca652',
  '#54a0ff',
  '#ffd66b',
  '#9f6ef1',
  '#7ed957',
  '#e96fe8',
  '#3b3c98',
  '#e74c3c',
]

const titleOptions = {
  title: {
    text: 'Остаток',
    style: {
      color: '#3b3c98',
      fontSize: '30px',
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        title: {
          style: {
            fontSize: '20px',
          },
        },
      },
    },
    {
      breakpoint: 480,
      options: {
        title: {
          style: {
            fontSize: '16px',
          },
        },
      },
    },
  ],
}

export const chartOptionsLinear = {
  chart: {
    type: 'line',
    height: 350,
    zoom: { enabled: true },
    locales: [ru],
    defaultLocale: 'ru',
  },
  xaxis: {
    type: 'datetime',
    labels: {
      format: 'd MMM',
      style: {
        colors: '#666',
        fontSize: '12px',
      },
    },
  },
  stroke: {
    width: 5,
    curve: 'smooth',
  },
  colors: ['#3b3c98'],
  fill: {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      gradientToColors: ['#f45dff'],
      shadeIntensity: 1,
      type: 'horizontal',
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  grid: {
    borderColor: '#efeef2',
  },
  ...titleOptions,
}

export const chartOptionsColumn = {
  chart: {
    type: 'bar',
  },
  ...titleOptions,
}
