import { Form, message } from '@oceanbase/design';
import type { CarOrder } from '@prisma/client';
import { useRequest } from 'ahooks';
import React, { useState } from 'react';
import { history } from 'umi';
import * as CarOrderController from '@/services/CarOrderController';

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const [form] = Form.useForm();

  const {
    data: carOrderCount,
    refresh: getCarOrderCountRefresh,
    loading: getCarOrderCountLoading,
  } = useRequest(CarOrderController.getCarOrderCount, {
    defaultParams: [{}],
  });

  const { run: createCarOrder, loading: createCarOrderLoading } = useRequest(
    CarOrderController.createCarOrder,
    {
      manual: true,
      onSuccess: () => {
        message.success('下单成功');
        getCarOrderCountRefresh();
      },
    },
  );

  return <h1>OceanBase Playground</h1>;
};

export default Index;
