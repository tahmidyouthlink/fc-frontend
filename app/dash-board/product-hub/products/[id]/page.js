import EditProductContents from '@/app/components/dashboard-product/edit-product/EditProductContents';
import Loading from '@/app/components/shared/Loading/Loading';
import React, { Suspense } from 'react';

const EditProductPage = () => {

  return (
    <Suspense fallback={<Loading />}>
      <EditProductContents />
    </Suspense>
  );
};

export default EditProductPage;