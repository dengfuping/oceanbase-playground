import {
  Card,
  Col,
  Dropdown,
  Empty,
  Row,
  Space,
  Spin,
  theme,
  Typography,
} from '@oceanbase/design';
import { useInterval, useRequest, useScroll } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react';
import { GlobalOutlined, LoadingOutlined } from '@oceanbase/icons';
import { sortByNumber } from '@oceanbase/util';
import CountUp from 'react-countup';
import * as CarOrderController from '@/services/CarOrderController';
import { COLOR_LIST } from './constant';
import OrderForm from './OrderForm';
import Chart from './Chart';
import { formatTime } from './util';
import type { CarOrder } from '@prisma/client';
import { toString } from 'lodash';
import {
  formatMessage,
  getLocale,
  setLocale,
  Helmet,
  useSearchParams,
} from 'umi';
import moment from 'moment';
import 'animate.css';
import TweenOne from 'rc-tween-one';
import PathPlugin from 'rc-tween-one/lib/plugin/PathPlugin';
import type { IAnimObject } from 'rc-tween-one/typings/AnimObject';
import './global.less';
import styles from './index.less';

TweenOne.plugins.push(PathPlugin);

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const { token } = theme.useToken();
  const locale = getLocale();

  const [searchParams] = useSearchParams();
  const i18n = searchParams.get('i18n');
  const qrcode = searchParams.get('qrcode');
  const debug = searchParams.get('debug');

  // from https://www.oceanbase.com
  const userId = searchParams.get('userId');

  const localeList = [
    {
      value: 'zh-CN',
      label: '简体中文',
    },
    {
      value: 'en-US',
      label: 'English',
    },
  ];

  const orderRef = useRef<HTMLDivElement>(null);
  const oltpRef = useRef<HTMLImageElement>(null);
  const flinkRef = useRef<HTMLDivElement>(null);
  const olapRef = useRef<HTMLImageElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [path, setPath] = useState<string>('');
  const [sql, setSql] = useState('');

  const latestRef = useRef<HTMLDivElement>(null);
  const latestElment = latestRef.current;
  const latestScroll = useScroll(latestRef);
  const isLatestScroll =
    latestElment?.scrollHeight !== latestElment?.clientHeight;
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

  const sqlRef = useRef<HTMLDivElement>(null);
  const sqlElment = sqlRef.current;

  const updateSql = (appendSql: string | undefined) => {
    // 使用 setState 函数形式更新值，保证并发调用的结果符合预期
    setSql((prevSql) => `${prevSql}${appendSql}\n`);
    if (sqlElment) {
      setTimeout(() => {
        sqlElment.scrollTop = sqlElment.scrollHeight;
      }, 0);
    }
  };

  const renderPath = () => {
    const orderDom = orderRef.current;
    const oltpDom = oltpRef.current;
    const flinkDom = flinkRef.current;
    const olapDom = olapRef.current;
    const dashboardDom = dashboardRef.current;

    if (orderDom && flinkDom && olapDom && oltpDom && dashboardDom) {
      const oltpPoint = {
        x: oltpDom.offsetLeft + oltpDom.offsetWidth / 2,
        y: oltpDom.offsetTop + oltpDom.offsetHeight / 2,
      };
      const orderPoint = {
        x: dashboardDom.offsetLeft,
        y: oltpPoint.y,
      };
      const flinkPoint = {
        x: flinkDom.offsetLeft + flinkDom.offsetWidth / 2,
        y: flinkDom.offsetTop + flinkDom.offsetHeight / 2,
      };
      const olapPoint = {
        x: olapDom.offsetLeft + olapDom.offsetWidth / 2,
        y: olapDom.offsetTop + olapDom.offsetHeight / 2,
      };
      const dashboardPoint = {
        x: orderDom.offsetLeft + orderDom.offsetWidth,
        y: olapPoint.y,
      };
      const newPath = `M ${orderPoint.x} ${orderPoint.y}L ${oltpPoint.x} ${oltpPoint.y}L ${flinkPoint.x} ${flinkPoint.y}L ${olapPoint.x} ${olapPoint.y}L ${dashboardPoint.x} ${dashboardPoint.y}`;
      setPath(newPath);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      renderPath();
    }, 16);
  }, []);

  const handleMessageFromParent = (event: MessageEvent) => {
    if (
      event.origin !== window.location.origin &&
      ![
        'https://oceanbaseweb-pre.oceanbase.com',
        'https://www.oceanbase.com',
      ].includes(event.origin)
    ) {
      console.warn('Received message from untrusted origin:', event.origin);
      return;
    }

    console.log('Received message from parent:', event.data);
    console.log(event.origin);

    // 根据消息内容发送响应回父页面
    if (event.data === 'car-demo') {
      event.source?.postMessage('iframe-response', {
        targetOrigin: event.origin,
      });
    }
  };

  useEffect(() => {
    window.addEventListener('message', handleMessageFromParent);
  }, []);

  const sendMessage = (msg: any) => {
    window.parent.postMessage(msg, '*');
  };

  React.useEffect(() => {
    sendMessage('iframe-response');
    // 监听跨域请求的返回
    window.addEventListener(
      'message',
      function (event) {
        console.log(event, event.data);
      },
      false,
    );
    return () => {
      window.removeEventListener(
        'message',
        function (event) {
          console.log(event, event.data);
        },
        false,
      );
    };
  }, []);

  const {
    data: totalData,
    run: getTotal,
    loading: totalLoading,
  } = useRequest(CarOrderController.getTotal, {
    defaultParams: [{}],
    onSuccess: (res) => {
      updateSql(res.sqlText);
    },
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
    onSuccess: (res) => {
      updateSql(res.sqlText);
    },
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

  const animation: IAnimObject = {
    path,
    repeat: -1,
    duration: 1250,
    ease: 'linear',
  };
  const animationStyle: React.CSSProperties = {
    margin: 0,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 12,
    height: 12,
    transform: 'translate(-6px, -6px)',
    borderRadius: '50%',
    // border: '1px solid #adb2bd',
    background: token.colorPrimary,
  };

  return (
    <>
      <Helmet>
        <title>OceanBase With Flink | OceanBase Playground</title>
      </Helmet>
      <div
        style={{ padding: 48, position: 'relative' }}
        className={styles.container}
      >
        {i18n === 'true' && (
          <Dropdown
            menu={{
              items: localeList.map((item) => ({
                key: item.value,
                label: item.label,
              })),
              onClick: ({ key }) => {
                setLocale(key);
              },
            }}
          >
            <Space
              style={{
                cursor: 'pointer',
                position: 'absolute',
                right: 48,
                top: 16,
              }}
            >
              <GlobalOutlined />
              {localeList.find((item) => item.value === locale)?.label}
            </Space>
          </Dropdown>
        )}
        <Row gutter={8}>
          <Col span={6}>
            <div
              ref={orderRef}
              style={{
                background: '#FFFFFF',
                border: `1px solid ${token.colorBorder}`,
                boxShadow: '7px 10px 24px 0 rgba(37,48,70,0.08)',
                borderRadius: 50,
                padding: 10,
                height: '100%',
              }}
            >
              <div
                style={{
                  background: '#F6F8FB',
                  height: '100%',
                  borderRadius: 50,
                }}
              >
                <OrderForm
                  debug={debug}
                  userId={userId}
                  onSuccess={(sqlText) => {
                    getStatus({
                      orderId: latestOrder?.orderId,
                    });
                    updateSql(sqlText);
                  }}
                />
              </div>
            </div>
          </Col>
          <Col span={4}>
            {qrcode === 'true' && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <img
                  src="https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*XNLHS4D8osUAAAAAAAAAAAAADmfOAQ/original"
                  style={{
                    width: '60px',
                    marginRight: 20,
                  }}
                />
                <div style={{ fontSize: 16, fontFamily: 'Alibaba PuHuiTi' }}>
                  <div style={{ marginBottom: 8 }}>
                    {formatMessage({
                      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.ScanQrCodeToTry',
                      defaultMessage: '快来扫码试试吧！',
                    })}
                  </div>
                  <div>
                    {formatMessage({
                      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.SupportMultiplePeopleOrder',
                      defaultMessage: '支持多人同时下单',
                    })}
                  </div>
                </div>
              </div>
            )}
            {path && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 'calc(100% - 8px)',
                  height: '100%',
                }}
              >
                {syncing && (
                  <>
                    <TweenOne animation={animation} style={animationStyle} />
                    {/* <TweenOne
                      animation={{
                        ...animation,
                        delay: 50,
                      }}
                      style={animationStyle}
                    />
                    <TweenOne
                      animation={{
                        ...animation,
                        delay: 100,
                      }}
                      style={animationStyle}
                    /> */}
                  </>
                )}
                <svg style={{ width: '100%', height: '100%' }}>
                  <path
                    d={path}
                    fill="none"
                    stroke="#adb2bd"
                    strokeWidth={1}
                    strokeDasharray="6 6"
                    markerEnd="url(#arrow)"
                  />
                </svg>
              </div>
            )}

            {/* <div
              className={`effect-olap-flink ${
                true ? 'effect-olap-flink-animate' : ''
              }`}
            /> */}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
                padding: '64px 0px',
                zIndex: 10,
                position: 'relative',
                fontFamily: 'Roboto',
              }}
            >
              <div>
                <img
                  ref={olapRef}
                  src="https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*LGTUSYGnB2gAAAAAAAAAAAAADmfOAQ/original"
                />
                <div
                  style={{
                    fontSize: 20,
                    paddingTop: 8,
                    paddingBottom: 4,
                    backgroundColor: '#ffffff',
                  }}
                >
                  OLAP
                </div>
                <div style={{ paddingBottom: 4, backgroundColor: '#ffffff' }}>
                  OceanBase V4.3
                </div>
              </div>
              <div
                ref={flinkRef}
                style={{
                  fontSize: 20,
                  padding: '4px 0px',
                  backgroundColor: '#ffffff',
                }}
              >
                Flink
              </div>
              <div>
                <img
                  ref={oltpRef}
                  src="https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*3lQQQobix3YAAAAAAAAAAAAADmfOAQ/original"
                />
                <div
                  style={{
                    fontSize: 20,
                    marginTop: 12,
                    marginBottom: 4,
                  }}
                >
                  OLTP
                </div>
                <div>OceanBase V4.3</div>
              </div>
            </div>
          </Col>
          <Col span={14}>
            <Row gutter={[0, 16]}>
              <Col span={24}>
                <Card
                  ref={dashboardRef}
                  type="inner"
                  title={<h4>实时订单看板</h4>}
                  className={styles.orderViewCard}
                  bodyStyle={{ padding: 0 }}
                >
                  <Row>
                    <Col
                      span={12}
                      style={{
                        borderRight: `1px solid ${token.colorBorderSecondary}`,
                      }}
                    >
                      <Row>
                        <Col span={24}>
                          <div
                            style={{
                              borderBottom: `1px solid ${token.colorBorderSecondary}`,
                              padding: '24px 12px 16px 24px',
                            }}
                          >
                            <Space direction="vertical" size={4}>
                              <h5>
                                {formatMessage({
                                  id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.TotalOrderCount',
                                  defaultMessage: '总预定量',
                                })}
                              </h5>
                              <Space className="sql-rt">
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
                                        color: token.colorSuccess,
                                      }}
                                    />
                                  }
                                  style={{ marginTop: -4 }}
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
                          </div>
                        </Col>
                        <Col span={24}>
                          <div style={{ padding: '24px 12px 16px 24px' }}>
                            <Space direction="vertical" size={4}>
                              <h5>
                                {formatMessage({
                                  id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.Top3ColorsOfToday',
                                  defaultMessage: '今日颜色预定量 Top3',
                                })}
                              </h5>
                              <Space className="sql-rt">
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
                                        color: token.colorSuccess,
                                      }}
                                    />
                                  }
                                  style={{ marginTop: -4 }}
                                />
                              </Space>
                            </Space>
                            <Chart data={colorTop3} />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={12}>
                      <div style={{ padding: '24px 0px 0px 24px' }}>
                        <Space direction="vertical" size={4}>
                          <h5>
                            {formatMessage({
                              id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RealTimeOrders',
                              defaultMessage: '实时订单',
                            })}
                          </h5>
                          <Space className="sql-rt">
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
                                    color: token.colorSuccess,
                                  }}
                                />
                              }
                              style={{ marginTop: -4 }}
                            />
                          </Space>
                        </Space>
                        <div
                          ref={latestRef}
                          style={{
                            maxHeight: '360px',
                            overflow: 'auto',
                          }}
                        >
                          {isLatestStartScroll && (
                            <div
                              style={{
                                position: 'absolute',
                                left: 0,
                                height: 60,
                                width: '100%',
                                backgroundImage:
                                  'linear-gradient(360deg, #fefefe00 0%, #ffffff 100%)',
                                zIndex: 10,
                              }}
                            />
                          )}
                          {orderList.map((item) => {
                            const colorItem = COLOR_LIST.find(
                              (color) => color.value === item.carColor,
                            );
                            return (
                              <div
                                key={item.key}
                                style={{
                                  borderRadius: token.borderRadiusSM,
                                  borderWidth: 1,
                                  borderStyle: 'solid',
                                  borderColor: item.isNew
                                    ? token.colorSuccess
                                    : 'transparent',
                                  marginBottom: 16,
                                  marginRight: 16,
                                  padding: '4px 16px 4px 8px',
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
                                  <img
                                    src={colorItem?.image}
                                    style={{ width: '100%' }}
                                  />
                                </div>
                                <div style={{ maxWidth: 'calc(100% - 90px)' }}>
                                  <Typography.Text
                                    ellipsis={{ tooltip: true }}
                                    style={{ fontWeight: 700 }}
                                  >
                                    {formatMessage(
                                      {
                                        id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RealTimeOrderSuccess',
                                        defaultMessage:
                                          '{customerName} 下单成功',
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
                                    <Space>
                                      {formatMessage(
                                        {
                                          id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RealTimeCarColor',
                                          defaultMessage: '车辆颜色：{color}',
                                        },
                                        {
                                          color: colorItem?.label,
                                        },
                                      )}
                                      {formatTime(item.orderTime)}
                                    </Space>
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
                                height: 60,
                                width: '100%',
                                backgroundImage:
                                  'linear-gradient(180deg, #fefefe00 0%, #ffffff 100%)',
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card
                  type="inner"
                  title={<h4>实时执行 SQL</h4>}
                  bodyStyle={{
                    padding: '0px',
                    fontFamily: 'Menlo',
                  }}
                >
                  <div
                    ref={sqlRef}
                    style={{
                      padding: '16px 24px',
                      height: 164,
                      overflow: 'auto',
                      whiteSpace: 'pre',
                    }}
                  >
                    {sql || <Empty style={{ marginTop: 24 }} />}
                  </div>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Index;
