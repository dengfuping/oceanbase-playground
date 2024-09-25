import React from 'react';
import { Column } from '@ant-design/plots';
import { COLOR_LIST } from './constant';
import { isEqual, max, omit } from 'lodash';
import { useIntl } from 'react-intl';

interface ChartProps {
  data?: { carColor: string; count: number }[];
}

const Chart: React.FC<ChartProps> = ({ data = [] }) => {
  const { formatMessage } = useIntl();
  const maxCount = max(data.map((item) => item.count)) || 0;
  return (
    <Column
      height={188}
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
        },
      }}
    />
  );
};

export default React.memo(Chart, (prevProps, nextProps) =>
  isEqual(prevProps.data, nextProps.data),
);
