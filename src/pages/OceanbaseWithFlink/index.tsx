import { Col, Row, Space, theme, Typography } from '@oceanbase/design';
import { Column } from '@oceanbase/charts';
import { useRequest } from 'ahooks';
import React from 'react';
import * as CarOrderController from '@/services/CarOrderController';
import Buy from './Buy';
import { CheckCircleOutlined } from '@oceanbase/icons';
import { COLOR_LIST } from './constant';

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  const { token } = theme.useToken();

  const { data: carOrderCount, refresh: getCarOrderCountRefresh } = useRequest(
    CarOrderController.getCarOrderCount,
    {
      defaultParams: [{}],
    },
  );

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
          <Buy style={{ marginTop: '-100%', padding: '24px 40px 0 24px' }} />
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
              <Space direction="vertical" size={40}>
                <h2>今日预定量</h2>
                <h1 style={{ fontSize: 50 }}>{carOrderCount}445,434,123</h1>
                <h2>今日颜色预定量 Top3</h2>
                <Column
                  height={300}
                  data={[
                    {
                      carColor: 'blue',
                      count: 300,
                    },
                    {
                      carColor: 'green',
                      count: 200,
                    },
                    {
                      carColor: 'purple',
                      count: 100,
                    },
                  ]}
                  xField="carColor"
                  yField="count"
                  seriesField="carColor"
                  meta={{
                    carColor: {
                      formatter: (value) =>
                        COLOR_LIST.find((item) => item.value === value)?.label,
                    },
                  }}
                />
              </Space>
            </Col>
            <Col span={10} style={{ paddingLeft: 48 }}>
              <h2>下单详情</h2>
              <div
                style={{
                  maxHeight: '540px',
                  overflow: 'auto',
                  paddingRight: 12,
                }}
              >
                {Array.from(Array(20)).map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: '12px 16px',
                      border: `1px solid ${token.colorBorder}`,
                      borderRadius: token.borderRadiusSM,
                      backgroundColor: token.colorBgContainer,
                      marginBottom: 14,
                      display: 'flex',
                      alignItems: 'center',
                    }}
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
                        ellipsis={true}
                        style={{ fontWeight: 700, marginBottom: 8 }}
                      >
                        11:45 福*玲下单成功
                      </Typography.Text>
                      <Typography.Text
                        ellipsis={true}
                        style={{ color: token.colorTextDescription }}
                      >
                        订单详情：蓝色吉普蓝色吉普蓝色吉普蓝色吉普蓝色吉普蓝色吉普
                      </Typography.Text>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Index;
