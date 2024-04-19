import { Col, Row, Space, Spin, theme, Typography } from '@oceanbase/design';
import { useInterval, useRequest } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react';
import { CheckCircleOutlined, LoadingOutlined } from '@oceanbase/icons';
import CountUp from 'react-countup';
import * as CarOrderController from '@/services/CarOrderController';
import { COLOR_LIST } from './constant';
import OrderForm from './OrderForm';
import Chart from './Chart';
import { formatTime } from './util';
import type { CarOrder } from '@prisma/client';
import { toString } from 'lodash';
import { Helmet } from 'umi';
import moment from 'moment';
import 'animate.css';
import './index.less';
import { sortByNumber } from '@oceanbase/util';

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const { token } = theme.useToken();

  const {
    data: totalData,
    run: getTotal,
    loading: totalLoading,
  } = useRequest(CarOrderController.getTotal, {
    defaultParams: [{}],
  });
  const { total = 0, latency: totalLatency } = totalData || {};

  // to preserve previous total
  const countRef = useRef(total);
  useEffect(() => {
    countRef.current = total;
  }, [total]);

  const {
    data: colorTop3Data,
    run: getColorTop3,
    loading: colorTop3Loading,
  } = useRequest(CarOrderController.getColorTop3, {
    defaultParams: [{}],
  });
  const { data: colorTop3 = [], latency: colorTop3Latency } =
    colorTop3Data || {};

  const [orderList, setOrderList] = useState<CarOrder[]>([]);
  const latestOrder = orderList[0] || {};

  const {
    data: latestData,
    loading: latestLoading,
    run: getLatest,
  } = useRequest(CarOrderController.getLatest, {
    defaultParams: [
      {
        orderId: latestOrder.orderId,
      },
    ],
    onSuccess: (res) => {
      const latest = res.data || [];
      if (latest.length > 0) {
        let newOrderList =
          latest.length >= 10 ? latest : [...latest, ...orderList].slice(0, 10);
        newOrderList = newOrderList
          .map((item) => ({
            ...item,
            isNew:
              orderList.length === 0 ||
              orderList.map((order) => order.orderId).includes(item.orderId)
                ? false
                : true,
            // 增加时间戳，每次都生成唯一 key，保证滚动动画正常执行
            key: `${toString(item.orderId)}-${moment().format()}`,
          }))
          // 从大到小排序
          .sort((a, b) => sortByNumber(b, a, 'orderId'));
        setOrderList(newOrderList);
        setTimeout(() => {
          setOrderList(
            newOrderList.map((item) => ({
              ...item,
              isNew: false,
            })),
          );
        }, 1000);
      }
    },
  });
  const { latency: latestLantency } = latestData || {};

  const getAllData = () => {
    getTotal();
    getColorTop3();
    getLatest({
      orderId: latestOrder.orderId,
    });
  };

  // 获取同步状态和是否应该刷新
  const { data: statusData, run: getStatus } = useRequest(
    CarOrderController.getStatus,
    {
      defaultParams: [{}],
      onSuccess: (res) => {
        if (res.shouldRefresh) {
          getAllData();
        }
      },
    },
  );
  const { syncing } = statusData || {};

  useInterval(() => {
    getStatus({
      orderId: latestOrder.orderId,
    });
  }, 1000);

  return (
    <>
      <Helmet>
        <title>OceanBase With Flink | OceanBase Playground</title>
      </Helmet>
      <div style={{ padding: '104px 40px 40px 68px' }}>
        <Row gutter={12}>
          <Col span={6}>
            <h2 style={{ marginBottom: 32 }}>汽车下单 Demo</h2>
            <img
              src="https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*nJT5Sr-UI5gAAAAAAAAAAAAADmfOAQ/original"
              style={{
                width: '128%',
                marginLeft: '-15%',
                marginTop: '-10%',
              }}
            />
            <OrderForm
              onSuccess={() => {
                getStatus({
                  orderId: latestOrder?.orderId,
                });
              }}
              style={{ marginTop: '-115%', padding: '16px 32px 0px 24px' }}
            />
          </Col>
          <Col span={5}>
            {/* <div
              style={{
                display:
                  process.env.NODE_ENV === 'development' ? 'flex' : 'none',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src="https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*XNLHS4D8osUAAAAAAAAAAAAADmfOAQ/original"
                style={{
                  width: '80px',
                  marginRight: 20,
                }}
              />
              <div>
                <h4>快来扫码试试吧！</h4>
                <h5>支持多人同时下单</h5>
              </div>
            </div> */}
            <div
              style={{
                marginTop: 150,
              }}
              className={`effect-olap-flink ${
                syncing ? 'effect-olap-flink-animate' : ''
              }`}
            />
            {/* <img
              src="https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*w-dvQIGYbBMAAAAAAAAAAAAADmfOAQ/original"
              style={{
                width: '100%',
                marginTop: 118,
              }}
            /> */}
          </Col>
          <Col span={13}>
            <h2 style={{ marginBottom: 50 }}>数据可视化</h2>
            <Row
              style={{
                backgroundColor: token.colorBgLayout,
                padding: '40px 40px 0px 40px',
                borderRadius: 30,
              }}
            >
              <Col span={14}>
                <Space direction="vertical" size={40} style={{ width: '100%' }}>
                  <Space direction="vertical" size={4}>
                    <h3>总预定量</h3>
                    <Space style={{ color: token.colorSuccess }}>
                      <div style={{ marginTop: 4 }}>
                        SQL 耗时：
                        <span style={{ fontSize: 24 }}>
                          {totalLatency || ''}
                        </span>
                        ms
                      </div>
                      <Spin
                        spinning={totalLoading}
                        indicator={
                          <LoadingOutlined
                            style={{ fontSize: 14, color: token.colorSuccess }}
                          />
                        }
                        style={{ marginTop: 4 }}
                      />
                    </Space>
                  </Space>
                  <h1>
                    <CountUp
                      duration={1}
                      start={countRef.current}
                      end={total}
                    />
                  </h1>
                  <Space direction="vertical" size={4}>
                    <h3>今日颜色预定量 Top3</h3>
                    <Space style={{ color: token.colorSuccess }}>
                      <div style={{ marginTop: 4 }}>
                        SQL 耗时：
                        <span style={{ fontSize: 24 }}>
                          {colorTop3Latency || ''}
                        </span>
                        ms
                      </div>
                      <Spin
                        spinning={colorTop3Loading}
                        indicator={
                          <LoadingOutlined
                            style={{ fontSize: 14, color: token.colorSuccess }}
                          />
                        }
                        style={{ marginTop: 4 }}
                      />
                    </Space>
                  </Space>
                  <Chart data={colorTop3} />
                </Space>
              </Col>
              <Col span={10} style={{ paddingLeft: 48 }}>
                <Space
                  direction="vertical"
                  size={4}
                  style={{ marginBottom: 32 }}
                >
                  <h3>实时订单</h3>
                  <Space style={{ color: token.colorSuccess }}>
                    <div style={{ marginTop: 4 }}>
                      SQL 耗时：
                      <span style={{ fontSize: 24 }}>
                        {latestLantency || ''}
                      </span>
                      ms
                    </div>
                    <Spin
                      spinning={latestLoading}
                      indicator={
                        <LoadingOutlined
                          style={{ fontSize: 14, color: token.colorSuccess }}
                        />
                      }
                      style={{ marginTop: 4 }}
                    />
                  </Space>
                </Space>
                <div
                  style={{
                    maxHeight: '580px',
                    overflow: 'auto',
                  }}
                >
                  {orderList.map((item) => (
                    <div
                      key={item.key}
                      style={{
                        padding: '12px 16px',
                        border: `1px solid ${token.colorBorder}`,
                        borderRadius: token.borderRadiusSM,
                        backgroundColor: item.isNew
                          ? token.colorSuccessBg
                          : token.colorBgContainer,
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
