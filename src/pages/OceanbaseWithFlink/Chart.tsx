import React from 'react';
import { Column } from '@ant-design/charts';
import { COLOR_LIST } from './constant';
import { isEqual } from 'lodash';

interface ChartProps {
  data?: { carColor: string; count: number }[];
}

const Chart: React.FC<ChartProps> = ({ data = [] }) => {
  return (
    <Column
      height={300}
      data={data.map((item) => {
        const colorItem = COLOR_LIST.find(
          (color) => color.value === item.carColor,
        );
        return {
          ...item,
          carColor: colorItem?.label,
          color: colorItem?.color,
        };
      })}
      xField="carColor"
      yField="count"
      legend={false}
      label={{
        textBaseline: 'bottom',
      }}
      tooltip={{
        items: [{ name: '今日预定量', channel: 'y' }],
      }}
      style={{
        fill: (datum) => {
          return datum?.color;
        },
      }}
    />
  );
};

export default React.memo(Chart, (prevProps, nextProps) =>
  isEqual(prevProps.data, nextProps.data),
);
