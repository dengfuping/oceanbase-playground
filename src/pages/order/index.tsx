import React from 'react';
import OrderForm from '@/components/oceanbase-with-flink/OrderForm';

interface OrderProps {}

const Order: React.FC<OrderProps> = () => {
  return (
    <OrderForm style={{ padding: '2em' }} />
  );
};

export default Order;
