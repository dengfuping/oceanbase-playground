import { Card, Col, Row, Space, Spin, theme, Typography } from '@oceanbase/design';
import type { CardProps } from '@oceanbase/design';
import { useRequest } from 'ahooks';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LoadingOutlined } from '@oceanbase/icons';
import { sortByNumber } from '@oceanbase/util';
import { useScroll } from 'ahooks';
import CountUp from 'react-countup';
import * as CarOrderController from '@/services/CarOrderController';
import { COLOR_LIST } from './constant';
import Chart from './Chart';
import { formatTime } from './util';
import type { CarOrder } from '@prisma/client';
import { toString } from 'lodash';
import { formatMessage } from 'umi';
import moment from 'moment';
import { useComposeRef } from 'rc-util/lib/ref';
import { MacScrollbar } from 'mac-scrollbar-better';
import 'mac-scrollbar-better/dist/mac-scrollbar-better.css';
import './global.less';
import styles from './index.less';

export type DashboardRefType = { getStatus: () => void };

interface DashboardProps extends Omit<CardProps, 'type'> {
  dashboardRef: React.RefObject<any>;
  updateSql: (sql?: string) => void;
  updateSyncing: (syncing: boolean) => void;
  readonlyColumnStoreReplica: boolean;
  rowStore: boolean;
  htap: boolean;
  type: 'tp' | 'ap';
}

const Dashboard = forwardRef(
  (
    {
      dashboardRef,
      updateSql,
      updateSyncing,
      readonlyColumnStoreReplica,
      rowStore,
      htap,
      type,
      ...restProps
    }: DashboardProps,
    ref: React.ForwardedRef<any>,
  ) => {
    const { token } = theme.useToken();

    const latestRef = useRef<HTMLDivElement>(null);
    const latestElment = latestRef.current;
    const latestScroll = useScroll(latestRef);
    const isLatestScroll = latestElment?.scrollHeight !== latestElment?.clientHeight;
    // start scroll
    const isLatestStartScroll = (latestScroll?.top || 0) > 0;
    // Determine if an element has been totally scrolled
    // ref: https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
    const isLatestTotalScroll =
      Math.abs(
        (latestElment?.scrollHeight || 0) -
          (latestElment?.clientHeight || 0) -
          (latestElment?.scrollTop || 0),
      ) < 1;

    const {
      data: totalData,
      run: getTotal,
      loading: totalLoading,
    } = useRequest(
      () => CarOrderController.getTotal({ readonlyColumnStoreReplica, rowStore, htap, type }),
      {
        onSuccess: (res) => {
          updateSql(res.sqlText);
        },
      },
    );
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
    } = useRequest(
      () => CarOrderController.getColorTop3({ readonlyColumnStoreReplica, rowStore, htap, type }),
      {
        onSuccess: (res) => {
          updateSql(res.sqlText);
        },
      },
    );
    const { data: colorTop3 = [], latency: colorTop3Latency } = colorTop3Data || {};

    const [orderList, setOrderList] = useState<CarOrder[]>([]);
    const latestOrder = orderList[0] || {};

    const {
      data: latestData,
      loading: latestLoading,
      run: getLatest,
    } = useRequest(
      () => CarOrderController.getLatest({ readonlyColumnStoreReplica, rowStore, htap, type }),
      {
        onSuccess: (res) => {
          const latest = res.data || [];
          if (latest.length > 0) {
            updateSql(res.sqlText);
            let newOrderList = [...latest, ...orderList].slice(0, 10);
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
      },
    );
    const { latency: latestLantency } = latestData || {};

    const getAllData = () => {
      getTotal();
      getColorTop3();
      getLatest();
    };

    // 获取同步状态和是否应该刷新
    const { run: getStatus } = useRequest(
      () =>
        CarOrderController.getStatus({
          readonlyColumnStoreReplica,
          rowStore,
          htap,
          type,
          orderId: latestOrder.orderId,
        }),
      {
        onSuccess: (res) => {
          if (res.shouldRefresh) {
            getAllData();
          }
          updateSyncing(res.syncing ?? false);
        },
        pollingInterval: 1000,
        debounceWait: 1000,
      },
    );

    useImperativeHandle(ref, () => ({
      getStatus,
    }));

    const mergedRef = useComposeRef(ref, dashboardRef);

    return (
      <Card
        ref={mergedRef}
        type="inner"
        size={htap ? 'small' : 'default'}
        title={
          <h4 style={htap ? { fontSize: 14 } : {}}>
            {formatMessage({
              id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RealtimeOrderDashboard',
              defaultMessage: '实时订单看板',
            })}
          </h4>
        }
        className={styles.orderViewCard}
        style={{ height: '100%' }}
        bodyStyle={{ padding: 0, height: htap ? 'calc(100% - 22px)' : 'calc(100% - 48px)' }}
        {...restProps}
      >
        <Row style={{ height: '100%' }}>
          <Col
            span={12}
            style={{
              height: '100%',
              borderRight: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Row style={{ height: '100%' }}>
              <Col span={24} style={{ height: htap ? 85 : 154 }}>
                <div
                  style={{
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    padding: htap ? 16 : '24px 12px 16px 24px',
                  }}
                >
                  <Space
                    direction="vertical"
                    size={4}
                    style={
                      htap
                        ? { width: '100%', flexDirection: 'row', justifyContent: 'space-between' }
                        : {}
                    }
                  >
                    <h5 style={htap ? { fontSize: 14 } : {}}>
                      {formatMessage({
                        id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.TotalOrderCount',
                        defaultMessage: '总预定量',
                      })}
                    </h5>
                    <Space
                      className="sql-rt"
                      style={
                        htap
                          ? {
                              fontSize: 12,
                              color: type === 'tp' ? token.colorError : token.colorSuccess,
                              backgroundColor:
                                type === 'tp' ? token.colorErrorBg : token.colorSuccessBg,
                              borderRadius: 2,
                              padding: '0px 4px',
                              marginBottom: 0,
                            }
                          : {}
                      }
                    >
                      {formatMessage(
                        {
                          id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.SqlLatency',
                          defaultMessage: 'SQL 耗时：{latency}ms',
                        },
                        {
                          latency: totalLatency,
                        },
                      )}
                      <Spin
                        spinning={totalLoading}
                        indicator={
                          <LoadingOutlined
                            style={{
                              fontSize: 14,
                              color: type === 'tp' ? token.colorError : token.colorSuccess,
                            }}
                          />
                        }
                        style={{ marginTop: -4 }}
                      />
                    </Space>
                  </Space>
                  <h1
                    style={
                      htap
                        ? {
                            fontSize: 18,
                            lineHeight: '30px',
                          }
                        : {}
                    }
                  >
                    <CountUp duration={1} start={countRef.current} end={total} />
                  </h1>
                </div>
              </Col>
              <Col span={24} style={{ height: htap ? 'calc(100% - 48px)' : 'calc(100% - 154px)' }}>
                <div
                  style={{
                    height: '100%',
                    padding: htap ? 16 : '24px 12px 16px 24px',
                  }}
                >
                  <Space
                    direction="vertical"
                    size={4}
                    style={
                      htap
                        ? { width: '100%', flexDirection: 'row', justifyContent: 'space-between' }
                        : {}
                    }
                  >
                    <h5 style={htap ? { fontSize: 14 } : {}}>
                      {formatMessage({
                        id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Top3ColorsOfToday',
                        defaultMessage: '今日颜色预定量 Top3',
                      })}
                    </h5>
                    <Space
                      className="sql-rt"
                      style={
                        htap
                          ? {
                              fontSize: 12,
                              color: type === 'tp' ? token.colorError : token.colorSuccess,
                              backgroundColor:
                                type === 'tp' ? token.colorErrorBg : token.colorSuccessBg,
                              borderRadius: 2,
                              padding: '0px 4px',
                              marginBottom: 0,
                            }
                          : {}
                      }
                    >
                      {formatMessage(
                        {
                          id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.SqlLatency',
                          defaultMessage: 'SQL 耗时：{latency}ms',
                        },
                        { latency: colorTop3Latency },
                      )}
                      <Spin
                        spinning={colorTop3Loading}
                        indicator={
                          <LoadingOutlined
                            style={{
                              fontSize: 14,
                              color: type === 'tp' ? token.colorError : token.colorSuccess,
                            }}
                          />
                        }
                        style={{ marginTop: -4 }}
                      />
                    </Space>
                  </Space>
                  <Chart loading={colorTop3Loading} data={colorTop3} />
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={12} style={{ height: '100%' }}>
            <div
              style={{
                height: '100%',
                padding: htap ? '16px 0px 0px 16px' : '24px 0px 0px 24px',
              }}
            >
              <Space
                direction="vertical"
                size={4}
                style={
                  htap
                    ? { width: '100%', flexDirection: 'row', justifyContent: 'space-between' }
                    : {}
                }
              >
                <h5 style={htap ? { fontSize: 14 } : {}}>
                  {formatMessage({
                    id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RealTimeOrders',
                    defaultMessage: '实时订单',
                  })}
                </h5>
                <Space
                  className="sql-rt"
                  style={
                    htap
                      ? {
                          fontSize: 12,
                          color: type === 'tp' ? token.colorError : token.colorSuccess,
                          backgroundColor:
                            type === 'tp' ? token.colorErrorBg : token.colorSuccessBg,
                          borderRadius: 2,
                          padding: '0px 4px',
                          marginBottom: 0,
                          marginRight: 16,
                        }
                      : {}
                  }
                >
                  {formatMessage(
                    {
                      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.SqlLatency',
                      defaultMessage: 'SQL 耗时：{latency}ms',
                    },
                    { latency: latestLantency },
                  )}
                  <Spin
                    spinning={latestLoading}
                    indicator={
                      <LoadingOutlined
                        style={{
                          fontSize: 14,
                          color: type === 'tp' ? token.colorError : token.colorSuccess,
                        }}
                      />
                    }
                    style={{ marginTop: -4 }}
                  />
                </Space>
              </Space>
              <MacScrollbar
                ref={latestRef}
                style={{
                  height: htap ? 'calc(100% - 40px)' : 'calc(100% - 68px)',
                }}
              >
                {isLatestStartScroll && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      height: htap ? 30 : 60,
                      width: '100%',
                      backgroundImage: 'linear-gradient(360deg, #fefefe00 0%, #ffffff 100%)',
                      zIndex: 10,
                    }}
                  />
                )}
                {orderList.map((item) => {
                  const colorItem = COLOR_LIST.find((color) => color.value === item.carColor);
                  return (
                    <div
                      key={item.key}
                      style={{
                        borderRadius: token.borderRadiusSM,
                        borderWidth: 1,
                        borderStyle: 'solid',
                        borderColor: item.isNew ? token.colorSuccess : 'transparent',
                        marginBottom: htap ? 0 : 16,
                        padding: '4px 0px',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.3s ease',
                      }}
                      className="animate__animated animate__slideInDown"
                    >
                      <div
                        style={{
                          width: 70,
                          height: 36,
                          background: `url(https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*ZgXlRqDlwmYAAAAAAAAAAAAADmfOAQ/original) no-repeat`,
                          backgroundSize: 'cover',
                          borderRadius: 6,
                          padding: '6px 4px',
                          marginRight: 8,
                        }}
                      >
                        <img src={colorItem?.image} style={{ width: '100%' }} />
                      </div>
                      <div style={{ maxWidth: 'calc(100% - 90px)' }}>
                        <Typography.Text ellipsis={{ tooltip: true }} style={{ fontWeight: 700 }}>
                          {formatMessage(
                            {
                              id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RealTimeOrderSuccess',
                              defaultMessage: '{customerName} 下单成功',
                            },
                            {
                              customerName: item.customerName,
                            },
                          )}
                        </Typography.Text>
                        <br />
                        <Typography.Text
                          ellipsis={{ tooltip: true }}
                          style={{
                            color: token.colorTextDescription,
                          }}
                        >
                          <span style={{ marginRight: 8 }}>
                            {formatMessage(
                              {
                                id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RealTimeCarColor',
                                defaultMessage: '{color} {count} 辆',
                              },
                              {
                                color: colorItem?.label,
                                count: item.count,
                              },
                            )}
                          </span>
                          <span>
                            {moment(item.orderTime).isSame(moment(), 'day')
                              ? formatTime(item.orderTime)
                              : // Display month and day for not today
                                moment(item.orderTime).format('MM/DD HH:mm:ss')}
                          </span>
                        </Typography.Text>
                      </div>
                    </div>
                  );
                })}
                {isLatestScroll && !isLatestTotalScroll && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      height: htap ? 30 : 60,
                      width: '100%',
                      backgroundImage: 'linear-gradient(180deg, #fefefe00 0%, #ffffff 100%)',
                    }}
                  />
                )}
              </MacScrollbar>
            </div>
          </Col>
        </Row>
      </Card>
    );
  },
);

export default Dashboard;
