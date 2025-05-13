import React from 'react';
import OrderForm from './OceanBaseWithFlink/OrderForm';

interface OrderProps {
  readonlyColumnStoreReplica?: string;
  rowStore?: string;
  htap?: string;
}

const Order: React.FC<OrderProps> = ({ readonlyColumnStoreReplica, rowStore, htap }) => {
  return (
    <>
      <OrderForm
        readonlyColumnStoreReplica={readonlyColumnStoreReplica === 'true'}
        rowStore={rowStore === 'true'}
        htap={htap === 'true'}
        style={{ padding: '2em' }}
      />
    </>
  );
};

export default Order;
