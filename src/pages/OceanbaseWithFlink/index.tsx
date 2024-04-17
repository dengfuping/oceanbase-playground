import { Col, Row, Space, theme, Typography } from '@oceanbase/design';
// import { Column } from '@oceanbase/charts';
import { Column } from '@ant-design/charts';
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
import EChart from './EChart';
import { desensitizeName, formatTime } from './util';
import type { CarOrder } from '@prisma/client';
import { toString, uniqBy } from 'lodash';
import { Helmet } from 'umi';
// import './animation/custom-update';
import 'animate.css';
import './index.less';
import { sortByNumber } from '@oceanbase/util';
import moment from 'moment';

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
        orderId: latestOrder.orderId,
      },
    ],
    onSuccess: (res) => {
      if (res.length > 0) {
        const newOrderList =
          res.length >= 10 ? res : [...res, ...orderList].slice(0, 10);
        setOrderList(
          newOrderList.map((item) => ({
            ...item,
            // 增加时间戳，每次都生成唯一 key，保证滚动动画正常执行
            key: `${toString(item.orderId)}-${moment().format()}`,
          })),
        );
      }
    },
  });

  const getAllData = () => {
    getTotal();
    getColorTop3();
    getLatest({
      orderId: latestOrder.orderId,
    });
  };

  useInterval(() => {
    getAllData();
  }, 1000);

  return (
    <>
      <Helmet>
        <title>OceanBase With Flink | OceanBase Playground</title>
      </Helmet>
      <div style={{ padding: '104px 40px 40px 104px' }}>
        <Row gutter={12}>
          <Col span={6}>
            <h2 style={{ marginBottom: 56 }}>汽车下单 Demo</h2>
            <img
              src="https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*nJT5Sr-UI5gAAAAAAAAAAAAADmfOAQ/original"
              style={{
                width: '125%',
                marginLeft: '-15%',
                marginTop: '-15%',
              }}
            />
            <Buy
              onSuccess={() => {
                getAllData();
              }}
              style={{ marginTop: '-115%', padding: '24px 40px 0 24px' }}
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
            <h2 style={{ marginBottom: 56 }}>数据可视化</h2>
            <Row
              style={{
                backgroundColor: token.colorBgLayout,
                padding: 40,
                borderRadius: 30,
              }}
            >
              <Col span={14}>
                <Space direction="vertical" size={40} style={{ width: '100%' }}>
                  <h3>今日预定量</h3>
                  <h1>
                    <CountUp
                      duration={1}
                      start={countRef.current}
                      end={total}
                    />
                  </h1>
                  <h3>今日颜色预定量 Top3</h3>
                  {/* <Chart
                  data={colorTop3?.map((item) => ({
                    carColor: item.carColor,
                    count: item._count?.carColor || 0,
                  }))}
                /> */}
                  {/* <EChart data={colorTop3} /> */}
                  <Column
                    height={300}
                    data={colorTop3.map((item) => ({
                      ...item,
                      carColor: COLOR_LIST.find(
                        (color) => color.value === item.carColor,
                      )?.label,
                    }))}
                    xField="carColor"
                    yField="count"
                    colorField="carColor"
                    // meta={{
                    //   carColor: {
                    //     formatter: (value) =>
                    //       COLOR_LIST.find((item) => item.value === value)
                    //         ?.label,
                    //   },
                    // }}
                    legend={false}
                    label={{
                      textBaseline: 'bottom',
                    }}
                    // animation={{
                    //   // appear: {
                    //   //   duration: APPEAR_TIME,
                    //   //   easing: BLIANK_EASING,
                    //   // },
                    //   // update: {
                    //   //   animation: 'element-update',
                    //   //   duration: UPDATE_TIME,
                    //   //   easing: BLIANK_EASING,
                    //   // },
                    //   update: {
                    //     animation: 'custom-update',
                    //     // duration: UPDATE_TIME,
                    //     // easing: BLIANK_EASING,
                    //   },
                    // }}
                  />
                </Space>
              </Col>
              <Col span={10} style={{ paddingLeft: 48 }}>
                <h3 style={{ marginBottom: 32 }}>实时订单</h3>
                <div
                  style={{
                    maxHeight: '590px',
                    overflow: 'auto',
                    paddingRight: 12,
                  }}
                >
                  {orderList.map((item) => (
                    <div
                      key={item.key}
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
                      className="animate__animated animate__slideInDown"
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
                          {`${formatTime(item.orderTime)} ${
                            item.customerName
                          } 下单成功`}
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
    </>
  );
};

export default Index;
