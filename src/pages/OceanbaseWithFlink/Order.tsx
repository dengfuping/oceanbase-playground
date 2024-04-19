import React from 'react';
import OrderForm from './OrderForm';

interface OrderProps {}

const Order: React.FC<OrderProps> = () => {
  return (
    <>
      <img
        src="https://mdn.alipayobjects.com/huamei_fhnyvh/afts/img/A*DB28SqC3wRMAAAAAAAAAAAAADmfOAQ/original"
        style={{
          width: '100%',
          borderRadius: '0px 0px 20px 20px',
        }}
      />
      <OrderForm style={{ padding: '2em' }} />
    </>
  );
};

export default Order;
