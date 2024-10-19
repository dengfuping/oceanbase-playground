import React from 'react';
import { Column } from '@ant-design/charts';
import { COLOR_LIST } from './constant';
import { isEqual } from 'lodash';
import { formatMessage } from 'umi';

interface ChartProps {
  data?: { carColor: string; count: number }[];
}

const Chart: React.FC<ChartProps> = ({ data = [] }) => {
  return (
    <Column
      containerStyle={{
        height: 'calc(100% - 48px)',
        position: 'relative',
      }}
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
        items: [
          {
            name: formatMessage({
              id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.OrderCountOfToday',
              defaultMessage: '今日预定量',
            }),
            channel: 'y',
          },
        ],
      }}
      style={{
        fill: (datum) => {
          return datum?.color;
        },
        maxWidth: 64,
      }}
      axis={{
        x: {
          tick: false,
        },
        y: {
          tick: false,
          tickCount: 4,
        },
      }}
    />
  );
};

export default React.memo(Chart, (prevProps, nextProps) =>
  isEqual(prevProps.data, nextProps.data),
);
