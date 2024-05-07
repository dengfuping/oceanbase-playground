import {
  Button,
  Form,
  Input,
  message,
  Select,
  Space,
  Switch,
  theme,
} from '@oceanbase/design';
import { useInterval, useRequest } from 'ahooks';
import React, { useState } from 'react';
import { range, sample } from 'lodash';
import { firstName, lastName } from 'full-name-generator';
import * as CarOrderController from '@/services/CarOrderController';
import { COLOR_LIST } from './constant';
import { formatMessage, getLocale } from 'umi';

interface OrderFormProps extends React.HTMLProps<HTMLDivElement> {
  onSuccess?: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ onSuccess, ...restProps }) => {
  const locale = getLocale();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [createPolling, setCreatePolling] = useState(false);
  const [batchCreatePolling, setBatchCreatePolling] = useState(false);

  // 下单
  const { run: batchCreateCarOrder, loading: batchCreateCarOrderLoading } =
    useRequest(CarOrderController.batchCreateCarOrder, {
      manual: true,
      onSuccess: () => {
        message.success(
          formatMessage({
            id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.OrderSuccess',
            defaultMessage: '下单成功',
          }),
        );
        onSuccess?.();
      },
    });

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
    return locale === 'en-US'
      ? `${firstName('US', sample([0, 1]))}`
      : `${lastName('CN', sample([0, 1]))}${firstName('CN', sample([0, 1]))}`;
  };

  // 随机生成订单
  const generateCarOrder = () => {
    return {
      carPrice: sample([215000, 245900, 299900]),
      carColor: sample(COLOR_LIST.map((item) => item.value)),
      saleRegion:
        locale === 'en-US'
          ? sample(['New York', 'Los Angeles', 'Washington', 'Chicago'])
          : sample(['Beijing', 'Shanghai', 'Shenzhen', 'Hangzhou']),
      saleNation: locale === 'en-US' ? 'America' : 'China',
      customerName: generateCustomerName(),
    } as any;
  };

  // 通过表单提交订单
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { count, carColor, customerName } = values;
      batchCreateCarOrder(
        range(0, count).map(() => {
          return {
            ...generateCarOrder(),
            carColor,
            customerName,
          };
        }),
      );
    });
  };

  // 模拟单人连续下单
  useInterval(
    () => {
      batchCreateCarOrderForPolling([generateCarOrder()]);
    },
    createPolling ? 1000 : undefined,
  );

  // 模拟多人同时下单
  useInterval(
    () => {
      batchCreateCarOrderForPolling(
        range(0, 10).map(() => {
          return generateCarOrder();
        }),
      );
    },
    batchCreatePolling ? 1000 : undefined,
  );

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        style={{ padding: '1em' }}
        {...restProps}
      >
        <Form.Item
          label={formatMessage({
            id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Username',
            defaultMessage: '用户名',
          })}
          name="customerName"
          initialValue="OceanBase"
          rules={[
            {
              required: true,
              message: formatMessage({
                id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.PleaseEnterUsername',
                defaultMessage: '请输入用户名',
              }),
            },
          ]}
        >
          <Input.Search
            enterButton={
              <Button
                onClick={() => {
                  form.setFieldsValue({
                    customerName: generateCustomerName(),
                  });
                }}
                style={{ color: token.colorText }}
              >
                {formatMessage({
                  id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.GenerateRandomly',
                  defaultMessage: '随机生成',
                })}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.OrderCount',
            defaultMessage: '预定量',
          })}
          name="count"
          initialValue={1}
          required={true}
        >
          <Select
            options={[
              {
                value: 1,
                label: formatMessage({
                  id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Count1',
                  defaultMessage: '1 辆',
                }),
              },
              {
                value: 10,
                label: formatMessage({
                  id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Count10',
                  defaultMessage: '瞬间连续下单 10 辆',
                }),
              },
              {
                value: 100,
                label: formatMessage({
                  id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Count100',
                  defaultMessage: '瞬间连续下单 100 辆',
                }),
              },
              {
                value: 1000,
                label: formatMessage({
                  id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Count1000',
                  defaultMessage: '瞬间连续下单 1000 辆',
                }),
              },
              // {
              //   value: 10000,
              //   label: formatMessage({
              //     id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Count10000',
              //     defaultMessage: '瞬间连续下单 10000 辆',
              //   }),
              // },
            ]}
          />
        </Form.Item>
        <Form.Item
          label={formatMessage({
            id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.OrderColor',
            defaultMessage: '颜色',
          })}
          name="carColor"
          initialValue="blue"
          required={true}
        >
          <Select
            options={COLOR_LIST.map((item) => ({
              ...item,
              label: (
                <Space>
                  <div
                    style={{
                      background: item.color,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                    }}
                  />
                  {item.label}
                </Space>
              ),
            }))}
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
            {formatMessage({
              id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.OrderSubmit',
              defaultMessage: '预定下单',
            })}
          </Button>
        </Form.Item>
      </Form>
      {false && (
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
      )}
    </>
  );
};

export default OrderForm;
