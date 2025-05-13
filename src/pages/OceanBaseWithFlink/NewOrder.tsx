import {
  Button,
  Carousel,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Switch,
} from '@oceanbase/design';
import { useInterval, useRequest } from 'ahooks';
import React, { useRef, useState } from 'react';
import { range, sample } from 'lodash';
import { firstName, lastName } from 'full-name-generator';
import * as CarOrderController from '@/services/CarOrderController';
import { COLOR_LIST } from './constant';
import type { CarouselRef } from 'antd/es/carousel';

interface OrderProps extends React.HTMLProps<HTMLDivElement> {
  readonlyColumnStoreReplica?: boolean;
  rowStore?: boolean;
  htap?: boolean;
  onSuccess?: () => void;
}

const Order: React.FC<OrderProps> = ({
  onSuccess,
  readonlyColumnStoreReplica,
  rowStore,
  htap,
  ...restProps
}) => {
  const [form] = Form.useForm();
  const [carColor, setCarColor] = useState('blue');
  const [createPolling, setCreatePolling] = useState(false);
  const [batchCreatePolling, setBatchCreatePolling] = useState(false);

  const carouselRef = useRef<CarouselRef>(null);

  // 下单
  const { run: batchCreateCarOrder, loading: batchCreateCarOrderLoading } = useRequest(
    CarOrderController.batchCreateCarOrder,
    {
      manual: true,
      onSuccess: () => {
        message.success('下单成功');
        onSuccess?.();
      },
    },
  );

  // 用于模拟场景的下单
  const { run: batchCreateCarOrderForPolling } = useRequest(
    CarOrderController.batchCreateCarOrder,
    {
      manual: true,
      onSuccess: () => {
        onSuccess?.();
      },
    },
  );

  // 随机生成用户名
  const generateCustomerName = () => {
    return `${lastName('CN', sample([0, 1]))}${firstName('CN', sample([0, 1]))}`;
  };

  // 随机生成订单
  const generateCarOrder = () => {
    return {
      carPrice: sample([215000, 245900, 299900]),
      carColor: sample(COLOR_LIST.map((item) => item.value)),
      saleRegion: sample(['Beijing', 'Shanghai', 'Shenzhen', 'Hangzhou']),
      saleNation: 'China',
      customerName: generateCustomerName(),
    } as any;
  };

  // 通过表单提交订单
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { count, carColor: formCarColor, customerName } = values;
      batchCreateCarOrder(
        {
          readonlyColumnStoreReplica,
          rowStore,
          htap,
        },
        range(0, count).map(() => {
          return {
            ...generateCarOrder(),
            carColor: formCarColor,
            customerName,
          };
        }),
      );
    });
  };

  // 模拟单人连续下单
  useInterval(
    () => {
      batchCreateCarOrderForPolling(
        {
          readonlyColumnStoreReplica,
          rowStore,
          htap,
        },
        [generateCarOrder()],
      );
    },
    createPolling ? 1000 : undefined,
  );

  // 模拟多人同时下单
  useInterval(
    () => {
      batchCreateCarOrderForPolling(
        {
          readonlyColumnStoreReplica,
          rowStore,
          htap,
        },
        range(0, 10).map(() => {
          return generateCarOrder();
        }),
      );
    },
    batchCreatePolling ? 1000 : undefined,
  );

  return (
    <>
      <Carousel
        ref={carouselRef}
        afterChange={(current) => {
          setCarColor(COLOR_LIST[current].value);
        }}
      >
        {COLOR_LIST.map((item) => {
          return (
            <div key={item.value}>
              <img src={item.image} style={{ width: '100%' }} />
            </div>
          );
        })}
      </Carousel>
      <Row gutter={[12, 12]} style={{ padding: 24 }}>
        {COLOR_LIST.map((item, index) => (
          <Col key={item.value} span={8}>
            <div
              onClick={() => {
                setCarColor(item.value);
                carouselRef.current?.goTo(index);
              }}
              style={{
                backgroundColor: item.value,
                height: item.value === carColor ? 62 : 60,
                borderRadius: 4,
                border: item.value === carColor ? '2px solid yellow' : undefined,
              }}
            />
          </Col>
        ))}
      </Row>
      <Form form={form} layout="vertical" {...restProps}>
        <Form.Item
          label="用户名"
          name="customerName"
          initialValue={generateCustomerName()}
          rules={[
            {
              required: true,
              message: '请输入用户名',
            },
          ]}
        >
          <Input />
        </Form.Item>
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
        <Form.Item>
          <Button
            size="large"
            type="primary"
            onClick={handleSubmit}
            loading={batchCreateCarOrderLoading}
            block={true}
          >
            预定下单
          </Button>
        </Form.Item>
      </Form>
      <Form
        layout="inline"
        style={{
          marginTop: 60,
        }}
      >
        <Form.Item label="模拟单人连续下单" required={true}>
          <Switch
            size="small"
            value={createPolling}
            onChange={(value) => {
              setCreatePolling(value);
              if (value) {
                setBatchCreatePolling(false);
              }
            }}
          />
        </Form.Item>
        <Form.Item label="模拟多人同时下单" required={true}>
          <Switch
            size="small"
            value={batchCreatePolling}
            onChange={(value) => {
              setBatchCreatePolling(value);
              if (value) {
                setCreatePolling(false);
              }
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
};

export default Order;
