import {
  Button,
  Carousel,
  ConfigProvider,
  Form,
  Input,
  message,
  Select,
  Switch,
  theme,
} from '@oceanbase/design';
import type { CarouselRef } from '@oceanbase/design/es/carousel';
import { useInterval, useRequest } from 'ahooks';
import React, { useState, useRef } from 'react';
import { range } from 'lodash';
import * as CarOrderController from '@/services/CarOrderController';
import * as TrackingController from '@/services/TrackingController';
import { formatMessage, getLocale } from 'umi';
import { COLOR_LIST } from './constant';
import { generateCustomerName, generateCarOrder } from './util';
import styles from './OrderForm.less';

interface OrderFormProps extends React.HTMLProps<HTMLDivElement> {
  debug?: string | null;
  userId?: string | null;
  onSuccess?: (sqlText?: string) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  debug,
  userId,
  onSuccess,
  ...restProps
}) => {
  const locale = getLocale();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [createPolling, setCreatePolling] = useState(false);
  const [batchCreatePolling, setBatchCreatePolling] = useState(false);
  const [currentCarColor, setCurrentColor] = useState('blue');
  // eslint-disable-next-line
  const currentCarColorItem = COLOR_LIST.find(
    (item) => item.value === currentCarColor,
  );

  const carouselRef = useRef<CarouselRef>(null);

  // 下单
  const { run: batchCreateCarOrder, loading: batchCreateCarOrderLoading } =
    useRequest(CarOrderController.batchCreateCarOrder, {
      manual: true,
      onSuccess: (res) => {
        message.success(
          formatMessage({
            id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.OrderSuccess',
            defaultMessage: '下单成功',
          }),
        );
        const batchSqlText = res.sqlText;
        onSuccess?.(batchSqlText);
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

  const getParentUrl = () => {
    const isInIframe = parent !== window;
    let parentUrl;
    if (isInIframe) {
      parentUrl = document.referrer;
    }
    return parentUrl;
  };

  // 通过表单提交订单
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { count, carColor, customerName } = values;
      batchCreateCarOrder(
        range(0, count).map(() => {
          return {
            ...generateCarOrder(locale),
            carColor,
            customerName,
          };
        }),
      );
    });
    // event tracking
    if (userId) {
      TrackingController.eventTracking({
        type: 126,
        eventType: 1,
        userId,
        resourcesName: '汽车下单及实时分析 Demo',
        resourcesId: getParentUrl(),
      });
    }
  };

  // 模拟单人连续下单
  useInterval(
    () => {
      batchCreateCarOrderForPolling([generateCarOrder(locale)]);
    },
    createPolling ? 1000 : undefined,
  );

  // 模拟多人同时下单
  useInterval(
    () => {
      batchCreateCarOrderForPolling(
        range(0, 10).map(() => {
          return generateCarOrder(locale);
        }),
      );
    },
    batchCreatePolling ? 1000 : undefined,
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 40,
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{
          height: '100%',
          padding: 24,
          background: `url(https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*915qTIA-IikAAAAAAAAAAAAADmfOAQ/original) no-repeat`,
          backgroundSize: '100% auto',
          borderRadius: 46,
        }}
        className={styles.form}
        {...restProps}
      >
        {/* <img
          src={currentCarColorItem?.image}
          style={{ width: '100%', margin: '36px 0px' }}
        /> */}
        <Carousel
          ref={carouselRef}
          draggable={true}
          afterChange={(current) => {
            const newCarColor = COLOR_LIST[current].value;
            setCurrentColor(newCarColor);
            form.setFieldValue('carColor', newCarColor);
          }}
          style={{ marginBottom: 24 }}
        >
          {COLOR_LIST.map((item) => {
            return (
              <div key={item.value}>
                <img
                  src={item.image}
                  style={{ width: '100%', margin: '36px 0px' }}
                />
              </div>
            );
          })}
        </Carousel>
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      background: item.color,
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      marginRight: 8,
                    }}
                  />
                  {item.label}
                </div>
              ),
            }))}
            onChange={(value) => {
              setCurrentColor(value);
              carouselRef.current?.goTo(
                COLOR_LIST.findIndex((item) => item.value === value),
              );
            }}
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
                    customerName: generateCustomerName(locale),
                  });
                }}
                style={{
                  color: token.colorLink,
                }}
              >
                {formatMessage({
                  id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.GenerateRandomly',
                  defaultMessage: '随机生成',
                })}
              </Button>
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={batchCreateCarOrderLoading}
            block={true}
            className={styles.submitButton}
          >
            {formatMessage({
              id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.OrderSubmit',
              defaultMessage: '预定下单',
            })}
          </Button>
        </Form.Item>
      </Form>
      {debug === 'true' && (
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
    </ConfigProvider>
  );
};

export default OrderForm;