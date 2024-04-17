import React from 'react';
import ReactECharts from 'echarts-for-react'; // or var ReactECharts = require('echarts-for-react');

interface ChartProps {
  data?: { carColor: string; count: number }[];
  style?: React.CSSProperties;
  className?: string;
}

const Chart: React.FC<ChartProps> = ({ data = [], style, ...restProps }) => {
  const option = {
    xAxis: {
      max: 'dataMax',
    },
    yAxis: {
      type: 'category',
      data: data.map((item) => item.carColor),
      // inverse: true,
      animationDuration: 300,
      animationDurationUpdate: 300,
    },

    series: [
      {
        realtimeSort: true,
        type: 'bar',
        data: data.map((item) => item.count),
        label: {
          show: true,
          position: 'top',
          valueAnimation: true,
        },
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)',
        },
      },
    ],
    animationDuration: 0,
    animationDurationUpdate: 3000,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
  };
  return (
    <ReactECharts
      option={option}
      style={{ height: 300, ...style }}
      {...restProps}
    />
  );
};

export default Chart;
