import React from 'react';
import OrderForm from './OceanBaseWithFlink/OrderForm';
import { useSearchParams } from 'umi';

interface OrderProps {}

const Order: React.FC<OrderProps> = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as 'readonlyColumnStoreReplica' | 'rowStore' | 'htap';
  return (
    <>
      <OrderForm
        readonlyColumnStoreReplica={type === 'readonlyColumnStoreReplica'}
        rowStore={type === 'rowStore'}
        htap={type === 'htap'}
        style={{ padding: '2em' }}
      />
    </>
  );
};

export default Order;
