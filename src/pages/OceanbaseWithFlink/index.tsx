import { Col, Row, Space, theme, Typography } from '@oceanbase/design';
import { Column } from '@oceanbase/charts';
import { useInterval, useRequest } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined } from '@oceanbase/icons';
import QueueAnim from 'rc-queue-anim';
import TweenOne from 'rc-tween-one';
import CountUp from 'react-countup';
import * as CarOrderController from '@/services/CarOrderController';
import { COLOR_LIST } from './constant';
import { APPEAR_TIME, BLIANK_EASING, UPDATE_TIME } from './animation';
import Buy from './Buy';
import Chart from './Chart';
import { desensitizeName, formatTime } from './util';
import styles from './index.less';
import type { CarOrder } from '@prisma/client';
import { toString, uniqBy } from 'lodash';

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const { token } = theme.useToken();

  const { data: total = 0, run: getTotal } = useRequest(
    CarOrderController.getTotal,
    {
      defaultParams: [{}],
    },
  );

  // to preserve previous total
  const countRef = useRef(total);
  useEffect(() => {
    countRef.current = total;
  }, [total]);

  const { data: colorTop3 = [], run: getColorTop3 } = useRequest(
    CarOrderController.getColorTop3,
    {
      defaultParams: [{}],
    },
  );

  const [orderList, setOrderList] = useState<CarOrder[]>([]);
  const latestOrder = orderList[0] || {};

  const { run: getLatest } = useRequest(CarOrderController.getLatest, {
    defaultParams: [
      {
        queryTime: latestOrder.orderTime,
      },
    ],
    onSuccess: (res) => {
      setOrderList(
        uniqBy([...res, ...orderList], (item) => item.orderId).slice(0, 10),
      );
    },
  });

  const getAllData = () => {
    getTotal();
    getColorTop3();
    getLatest({
      queryTime: latestOrder.orderTime,
    });
  };

  useInterval(() => {
    getAllData();
  }, 1000);

  return (
    <div style={{ padding: '104px 40px 40px 104px' }}>
      <Row gutter={12}>
        <Col span={6}>
          <h1 style={{ marginBottom: 56 }}>汽车下单 Demo</h1>
          <img
            src="https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*nJT5Sr-UI5gAAAAAAAAAAAAADmfOAQ/original"
            style={{
              width: '125%',
              marginLeft: '-15%',
              marginTop: '-15%',
            }}
          />
          <Buy
            polling={true}
            onSuccess={() => {
              getAllData();
            }}
            style={{ marginTop: '-100%', padding: '24px 40px 0 24px' }}
          />
        </Col>
        <Col span={5}>
          <img
            src="https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*w-dvQIGYbBMAAAAAAAAAAAAADmfOAQ/original"
            style={{
              width: '100%',
              marginTop: 118,
            }}
          />
        </Col>
        <Col span={13}>
          <h1 style={{ marginBottom: 56 }}>数据可视化</h1>
          <Row
            style={{
              backgroundColor: token.colorBgLayout,
              padding: 40,
              borderRadius: 30,
            }}
          >
            <Col span={14}>
              <Space direction="vertical" size={40} style={{ width: '100%' }}>
                <h2>今日预定量</h2>
                <h1 style={{ fontSize: 50 }}>
                  <CountUp duration={1} start={countRef.current} end={total} />
                </h1>
                <h2>今日颜色预定量 Top3</h2>
                {/* <Chart
                  data={colorTop3?.map((item) => ({
                    carColor: item.carColor,
                    count: item._count?.carColor || 0,
                  }))}
                /> */}
                <Column
                  height={300}
                  data={colorTop3}
                  xField="carColor"
                  yField="count"
                  seriesField="carColor"
                  meta={{
                    carColor: {
                      formatter: (value) =>
                        COLOR_LIST.find((item) => item.value === value)?.label,
                    },
                  }}
                  animation={{
                    appear: {
                      duration: APPEAR_TIME,
                      easing: BLIANK_EASING,
                    },
                    update: {
                      animation: 'element-update',
                      duration: UPDATE_TIME,
                      easing: BLIANK_EASING,
                    },
                  }}
                />
              </Space>
            </Col>
            <Col span={10} style={{ paddingLeft: 48 }}>
              <h2>下单详情</h2>
              <div
                style={{
                  maxHeight: '590px',
                  overflow: 'auto',
                  paddingRight: 12,
                }}
              >
                {orderList.map((item) => (
                  <div
                    key={toString(item.orderId)}
                    style={{
                      padding: '12px 16px',
                      border: `1px solid ${token.colorBorder}`,
                      borderRadius: token.borderRadiusSM,
                      backgroundColor: token.colorBgContainer,
                      marginBottom: 14,
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.3s ease',
                    }}
                    className={styles.orderItem}
                  >
                    <CheckCircleOutlined
                      style={{
                        fontSize: 30,
                        color: token.colorSuccess,
                        marginRight: 16,
                      }}
                    />
                    <div style={{ maxWidth: 'calc(100% - 40px)' }}>
                      <Typography.Text
                        ellipsis={{ tooltip: true }}
                        style={{ fontWeight: 700, marginBottom: 8 }}
                      >
                        {`${formatTime(item.orderTime)} ${desensitizeName(
                          item.customerName,
                        )} 下单成功`}
                      </Typography.Text>
                      <Typography.Text
                        ellipsis={{ tooltip: true }}
                        style={{ color: token.colorTextDescription }}
                      >
                        {`车辆颜色：${
                          COLOR_LIST.find(
                            (color) => color.value === item.carColor,
                          )?.label
                        }`}
                      </Typography.Text>
                    </div>
                  </div>
                ))}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    height: 135,
                    width: '100%',
                    backgroundImage:
                      'linear-gradient(180deg, rgba(245,248,253,0.00) 0%, #F5F8FD 62%)',
                  }}
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
