'use client';
import React from 'react';
import ProductForm from '../../../components/profile/ProductForm';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { uploadImagesAndReturnUrls } from '@/lib/imageHandling';
import { ProductPayload } from '@/types';

function AddProduct() {
  const [selectedFiles = [], setSelectedFiles] = React.useState<File[]>([]);
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const router = useRouter();

  const onSave = async (values: ProductPayload) => {
    try {
      setLoading(true);
      const imagesUrls = await uploadImagesAndReturnUrls(selectedFiles);
      values.images = imagesUrls;

      await axios.post('/api/products', values);
      message.success('Product created successfully.');
      router.push('/profile?id=1');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.message || error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    console.log('selectedFiles', selectedFiles);
  }, [selectedFiles]);

  return (
    <div>
      <h1 className='text-2xl font-bold text-gray-800'>Add Product</h1>
      <ProductForm
        setSelectedFiles={setSelectedFiles}
        loading={loading}
        onSave={onSave}
      />
    </div>
  );
}

export default AddProduct;
