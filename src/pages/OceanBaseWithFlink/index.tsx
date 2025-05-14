import { Card, Col, Dropdown, Empty, Row, Segmented, Space, theme } from '@oceanbase/design';
import { useSize } from 'ahooks';
import React, { useEffect, useRef, useState } from 'react';
import { GlobalOutlined } from '@oceanbase/icons';
import OrderForm from './OrderForm';
import {
  formatMessage,
  getLocale,
  setLocale,
  Helmet,
  useSearchParams,
  history,
  useLocation,
} from 'umi';
import { detect } from 'detect-browser';
import 'animate.css';
import TweenOne from 'rc-tween-one';
import PathPlugin from 'rc-tween-one/lib/plugin/PathPlugin';
import type { IAnimObject } from 'rc-tween-one/typings/AnimObject';
import { MacScrollbar } from 'mac-scrollbar-better';
import 'mac-scrollbar-better/dist/mac-scrollbar-better.css';
import './global.less';
import styles from './index.less';
import type { DashboardRefType } from './Dashboard';
import Dashboard from './Dashboard';

TweenOne.plugins.push(PathPlugin);

const browserInfo = detect();

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const { token } = theme.useToken();
  const locale = getLocale();

  const location = useLocation();

  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const i18n = searchParams.get('i18n');
  const qrcode = searchParams.get('qrcode');
  const debug = searchParams.get('debug');
  const bodySize = useSize(document.body);
  const sm = (bodySize?.width || 0) < 1280;

  // from https://www.oceanbase.com/demo/real-time-order-dashboard
  const userId = searchParams.get('userId');

  const pathList = [
    {
      value: '/oceanbase-with-flink',
      label: 'OceanBase with Flink',
    },
    {
      value: '/readonly-column-store-replica',
      label: formatMessage({
        id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.OceanBaseReadonlyColumnStoreReplica',
        defaultMessage: 'OceanBase 只读列存副本',
      }),
    },
    {
      value: '/row-store',
      label: formatMessage({
        id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.OceanBaseRowStore',
        defaultMessage: 'OceanBase 行存',
      }),
    },
    {
      value: '/htap',
      label: formatMessage({
        id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.OceanBaseHtap',
        defaultMessage: 'OceanBase HTAP',
      }),
    },
  ];
  const currentPath = pathList.find((item) => item.value === location.pathname) || pathList[0];
  const flink = currentPath.value === '/oceanbase-with-flink';
  const readonlyColumnStoreReplica = currentPath.value === '/readonly-column-store-replica';
  const rowStore = currentPath.value === '/row-store';
  const htap = currentPath.value === '/htap';

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
  const dashboardRef1 = useRef<HTMLDivElement>(null);
  const dashboardRef2 = useRef<HTMLDivElement>(null);
  const dashboardForwardRef1 = useRef<DashboardRefType>(null);
  const dashboardForwardRef2 = useRef<DashboardRefType>(null);
  const [path, setPath] = useState<string>('');
  const [path1, setPath1] = useState<string>('');
  const [path2, setPath2] = useState<string>('');
  const [sql, setSql] = useState('');

  const [creating, setCreating] = useState(false);
  const [syncing1, setSyncing1] = useState(false);
  const [syncing2, setSyncing2] = useState(false);

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
    const dashboardDom1 = dashboardRef1.current;
    const dashboardDom2 = dashboardRef2.current;

    if (orderDom && oltpDom && dashboardDom1 && (!htap || (htap && dashboardDom2))) {
      const oltpPoint = {
        x: oltpDom.offsetLeft + oltpDom.offsetWidth / 2,
        y: oltpDom.offsetTop + oltpDom.offsetHeight / 2,
      };
      const orderPoint = {
        x: dashboardDom1.offsetLeft,
        y: oltpPoint.y,
      };
      const flinkPoint = {
        x: (flinkDom?.offsetLeft || 0) + (flinkDom?.offsetWidth || 0) / 2,
        y: (flinkDom?.offsetTop || 0) + (flinkDom?.offsetHeight || 0) / 2,
      };
      const olapPoint = {
        x: (olapDom?.offsetLeft || 0) + (olapDom?.offsetWidth || 0) / 2,
        y: (olapDom?.offsetTop || 0) + (olapDom?.offsetHeight || 0) / 2,
      };
      const dashboardPoint = {
        x: orderDom.offsetLeft + orderDom.offsetWidth,
        y: rowStore ? oltpPoint.y : olapPoint.y,
      };

      const newPath1 = readonlyColumnStoreReplica
        ? `M ${orderPoint.x} ${orderPoint.y}L ${oltpPoint.x} ${oltpPoint.y}L ${olapPoint.x} ${olapPoint.y}L ${dashboardPoint.x} ${dashboardPoint.y}`
        : htap
        ? `M ${oltpPoint.x} ${oltpPoint.y}L ${olapPoint.x} ${olapPoint.y}L ${dashboardPoint.x} ${dashboardPoint.y}`
        : rowStore
        ? `M ${orderPoint.x} ${orderPoint.y}L ${oltpPoint.x} ${oltpPoint.y}L ${dashboardPoint.x} ${dashboardPoint.y}`
        : `M ${orderPoint.x} ${orderPoint.y}L ${oltpPoint.x} ${oltpPoint.y}L ${flinkPoint.x} ${flinkPoint.y}L ${olapPoint.x} ${olapPoint.y}L ${dashboardPoint.x} ${dashboardPoint.y}`;
      setPath1(newPath1);

      if (htap) {
        const newPath = `M ${orderPoint.x} ${orderPoint.y}L ${oltpPoint.x} ${oltpPoint.y}`;
        setPath(newPath);

        const oltpRightPoint = {
          x: oltpPoint.x + oltpDom.offsetWidth / 2,
          y: oltpDom.offsetTop + oltpDom.offsetHeight / 2,
        };
        const dashboard2Point = {
          x: orderDom.offsetLeft + orderDom.offsetWidth,
          y: oltpRightPoint.y,
        };
        const newPath2 = `M ${oltpPoint.x} ${oltpPoint.y}L ${oltpRightPoint.x} ${oltpRightPoint.y}L ${dashboard2Point.x} ${dashboard2Point.y}`;
        setPath2(newPath2);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      renderPath();
    }, 16);
    window.addEventListener('resize', () => {
      renderPath();
    });
    return () => {
      window.removeEventListener('resize', () => {});
    };
  }, []);

  const sendMessage = (msg: string) => {
    window.parent.postMessage(msg, '*');
  };

  React.useEffect(() => {
    sendMessage('iframe-response');
    // 监听跨域请求的返回
    window.addEventListener(
      'message',
      (event) => {
        console.log(event, event.data);
      },
      false,
    );
    return () => {
      window.removeEventListener(
        'message',
        (event) => {
          console.log(event, event.data);
        },
        false,
      );
    };
  }, []);

  const animation: IAnimObject = {
    path: path,
    repeat: -1,
    duration: 500,
    ease: 'linear',
  };
  const animation1: IAnimObject = {
    path: path1,
    repeat: -1,
    duration: htap ? 1000 : 1250,
    ease: 'linear',
  };
  const animation2: IAnimObject = {
    path: path2,
    repeat: -1,
    duration: 1000,
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
    ...(htap
      ? {
          background: '#ffffff',
        }
      : {
          background: token.colorPrimary,
        }),
  };

  const containerPadding = sm ? 24 : 48;

  return (
    <>
      <Helmet>
        <title>{currentPath.label}</title>
      </Helmet>
      <div
        style={{
          paddingLeft: containerPadding,
          paddingRight: containerPadding,
          paddingBottom: containerPadding,
          paddingTop: tab === 'true' || i18n === 'true' ? 48 : containerPadding,
          position: 'relative',
        }}
        className={`${styles.container} ${
          typeof userId === 'string' ? styles.nestedContainer : ''
        }`}
      >
        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            width: `calc(100% - ${containerPadding * 2}px)`,
            top: 8,
            textAlign: 'center',
          }}
        >
          {tab === 'true' && (
            <Segmented
              value={currentPath.value}
              options={pathList}
              onChange={(value) => {
                history.push({
                  pathname: value as string,
                  search: location.search,
                });
              }}
            />
          )}
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
                  float: 'right',
                  marginTop: 8,
                }}
              >
                <GlobalOutlined />
                {localeList.find((item) => item.value === locale)?.label}
              </Space>
            </Dropdown>
          )}
        </div>
        <Row gutter={8} style={{ height: '100%' }}>
          <Col span={sm ? 7 : 6} style={{ height: '100%' }}>
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
                  qrcode={qrcode}
                  userId={userId}
                  sm={sm}
                  readonlyColumnStoreReplica={readonlyColumnStoreReplica}
                  rowStore={rowStore}
                  htap={htap}
                  updateCreating={(newCreating) => {
                    setCreating(newCreating);
                  }}
                  onSuccess={(sqlText) => {
                    setSyncing1(true);
                    setSyncing2(true);
                    dashboardForwardRef1.current?.getStatus();
                    dashboardForwardRef2.current?.getStatus();
                    updateSql(sqlText);
                  }}
                />
              </div>
            </div>
          </Col>
          <Col span={4} style={{ height: '100%' }}>
            {path && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 'calc(100% - 8px)',
                  height: '100%',
                }}
              >
                {creating && (
                  <>
                    <TweenOne
                      animation={animation}
                      style={{
                        ...animationStyle,
                        border: htap ? `1.5px solid ${token.colorTextTertiary}` : 'none',
                      }}
                    />
                  </>
                )}
                <svg style={{ width: '100%', height: '100%' }}>
                  <path
                    d={path}
                    fill="none"
                    stroke="#adb2bd"
                    strokeWidth={htap ? 1.5 : 1}
                    strokeDasharray="6 5"
                    markerEnd="url(#arrow)"
                  />
                </svg>
              </div>
            )}
            {path1 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 'calc(100% - 8px)',
                  height: '100%',
                }}
              >
                {syncing1 && (
                  <>
                    <TweenOne
                      animation={animation1}
                      style={{
                        ...animationStyle,
                        border: htap ? `1.5px solid ${token.colorSuccess}` : 'none',
                      }}
                    />
                  </>
                )}
                <svg style={{ width: '100%', height: '100%' }}>
                  <path
                    d={path1}
                    fill="none"
                    stroke={htap ? token.colorSuccess : '#adb2bd'}
                    strokeWidth={htap ? 1.5 : 1}
                    strokeDasharray="6 5"
                    markerEnd="url(#arrow)"
                  />
                </svg>
              </div>
            )}

            {htap && path2 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  width: 'calc(100% - 8px)',
                  height: '100%',
                }}
              >
                {syncing2 && (
                  <>
                    <TweenOne
                      animation={animation2}
                      style={{
                        ...animationStyle,
                        border: htap ? `1.5px solid ${token.colorError}` : 'none',
                      }}
                    />
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
                    d={path2}
                    fill="none"
                    stroke={htap ? token.colorError : '#adb2bd'}
                    strokeWidth={htap ? 1.5 : 1}
                    strokeDasharray="6 5"
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
                justifyContent: rowStore ? 'center' : 'space-between',
                alignItems: 'center',
                textAlign: 'center',
                height: '100%',
                padding: htap ? '150px 0px' : '64px 0px',
                zIndex: 10,
                position: 'relative',
                fontFamily: 'Roboto',
              }}
            >
              {(flink || readonlyColumnStoreReplica || htap) && (
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
                    {readonlyColumnStoreReplica || htap
                      ? formatMessage({
                          id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.ReadonlyColumnStoreReplica',
                          defaultMessage: '只读列存副本',
                        })
                      : 'OceanBase V4.3'}
                  </div>
                </div>
              )}

              {flink && (
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
              )}
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
                <div>
                  {readonlyColumnStoreReplica || htap
                    ? formatMessage({
                        id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RowStoreReplica',
                        defaultMessage: '行存副本',
                      })
                    : 'OceanBase V4.3'}
                </div>
              </div>
            </div>
          </Col>
          <Col span={sm ? 13 : 14} style={{ height: '100%' }}>
            <Row gutter={[0, 16]} style={{ height: '100%' }}>
              <Col
                span={24}
                style={{
                  height: htap ? 'calc((100% - 32px) * 0.4)' : 'calc((100% - 16px) * 0.8)',
                }}
              >
                <Dashboard
                  title={formatMessage({
                    id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RealtimeOrderDashboardReadonlyColumnStoreReplica',
                    defaultMessage: '实时订单看板（方案一：从只读列存副本查询）',
                  })}
                  ref={dashboardForwardRef1}
                  dashboardRef={dashboardRef1}
                  updateSql={updateSql}
                  updateSyncing={(syncing) => {
                    setSyncing1(syncing);
                  }}
                  readonlyColumnStoreReplica={readonlyColumnStoreReplica}
                  rowStore={rowStore}
                  htap={htap}
                  type="ap"
                />
              </Col>
              {htap && (
                <Col
                  span={24}
                  style={{
                    height: htap ? 'calc((100% - 32px) * 0.4)' : 'calc((100% - 16px) * 0.8)',
                  }}
                >
                  <Dashboard
                    title={formatMessage({
                      id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RealtimeOrderDashboardRowStore',
                      defaultMessage: '实时订单看板（方案二：从行存副本查询）',
                    })}
                    ref={dashboardForwardRef2}
                    dashboardRef={dashboardRef2}
                    updateSql={updateSql}
                    updateSyncing={(syncing) => {
                      setSyncing2(syncing);
                    }}
                    readonlyColumnStoreReplica={readonlyColumnStoreReplica}
                    rowStore={rowStore}
                    htap={htap}
                    type="tp"
                  />
                </Col>
              )}
              <Col
                span={24}
                style={{ height: htap ? 'calc((100% - 32px) * 0.2)' : 'calc((100% - 16px) * 0.2)' }}
              >
                <Card
                  type="inner"
                  size={htap ? 'small' : 'default'}
                  title={
                    <h4 style={htap ? { fontSize: 14 } : {}}>
                      {formatMessage({
                        id: 'oceanbase-playground.src.pages.OceanBaseWithFlink.RealtimeExecuteSql',
                        defaultMessage: '实时执行 SQL',
                      })}
                    </h4>
                  }
                  style={{ height: '100%' }}
                  bodyStyle={{
                    padding: '0px',
                    fontFamily: 'Menlo',
                    height: htap ? 'calc(100% - 38px)' : 'calc(100% - 48px)',
                  }}
                >
                  <MacScrollbar
                    ref={sqlRef}
                    style={{
                      padding: htap ? 16 : '16px 24px',
                      height: '100%',
                      overflow: 'auto',
                      whiteSpace: 'pre',
                    }}
                    className={
                      browserInfo?.os?.includes('Windows') ? styles.sqlScrollWindows : undefined
                    }
                  >
                    {sql || <Empty style={{ marginTop: 24 }} />}
                  </MacScrollbar>
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
