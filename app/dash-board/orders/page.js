import React, { Suspense } from 'react';
import Loading from '@/app/components/shared/Loading/Loading';
import OrderContents from '@/app/components/dashboard-order/OrderContents';

const OrdersPage = () => {

  return (
    <Suspense fallback={<Loading />}>
      <OrderContents />
    </Suspense>
  );
};

export default OrdersPage;