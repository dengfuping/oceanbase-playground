import { Button, Form, InputNumber, message, Select } from '@oceanbase/design';
import type { CarOrder } from '@prisma/client';
import { useInterval, useRequest } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { history } from 'umi';
import { sample } from 'lodash';
import { fullName } from 'full-name-generator';
import * as CarOrderController from '@/services/CarOrderController';
import { COLOR_LIST } from './constant';

interface BuyProps extends React.HTMLProps<HTMLDivElement> {
  polling?: boolean;
  onSuccess?: () => void;
}

const Buy: React.FC<BuyProps> = ({ polling, onSuccess, ...restProps }) => {
  const [form] = Form.useForm();

  const { run: createCarOrder, loading: createCarOrderLoading } = useRequest(
    CarOrderController.createCarOrder,
    {
      manual: true,
      onSuccess: () => {
        message.success('下单成功');
        onSuccess?.();
      },
    },
  );

  const { run: createCarOrderForPolling } = useRequest(
    CarOrderController.createCarOrder,
    {
      manual: true,
      onSuccess: () => {
        onSuccess?.();
      },
    },
  );

  const generateCarOrder = () => {
    return {
      carPrice: sample([215000, 245900, 299900]),
      carColor: sample(COLOR_LIST.map((item) => item.value)),
      saleRegion: sample(['Beijing', 'Shanghai', 'Shenzhen', 'Hangzhou']),
      saleNation: 'China',
      customerName: fullName('CN', sample([0, 1])),
    } as any;
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { count, carColor } = values;
      createCarOrder(generateCarOrder());
    });
  };

  // useInterval(
  //   () => {
  //     createCarOrderForPolling(generateCarOrder());
  //   },
  //   polling ? 1000 : undefined,
  // );

  return (
    <Form form={form} layout="vertical" {...restProps}>
      <Form.Item label="预定量" name="count" initialValue={1} required={true}>
        <Select
          options={[
            {
              value: 1,
              label: '1 辆',
            },
            {
              value: 10,
              label: '10 辆',
            },
            {
              value: 100,
              label: '100 辆',
            },
            {
              value: 1000,
              label: '1000 辆',
            },
            {
              value: 10000,
              label: '10000 辆',
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label="颜色"
        name="carColor"
        initialValue="blue"
        required={true}
      >
        <Select options={COLOR_LIST} />
      </Form.Item>
      <Form.Item>
        <Button
          size="large"
          type="primary"
          onClick={handleSubmit}
          loading={createCarOrderLoading}
          block={true}
        >
          预定下单
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Buy;
