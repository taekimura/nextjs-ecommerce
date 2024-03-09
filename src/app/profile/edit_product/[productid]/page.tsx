'use client';
import React from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import ProductForm from '@/components/profile/ProductForm';
import { uploadImagesAndReturnUrls } from '@/lib/imageHandling';
import { ProductPayload, Product } from '@/types';

function EditProduct({ params }: { params: { productid: string } }) {
  const [existingImages = [], setExistingImages] = React.useState<string[]>([]);
  const [selectedFiles = [], setSelectedFiles] = React.useState<File[]>([]);
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const [loadingProduct = false, setLoadingProduct] =
    React.useState<boolean>(false);
  const [product, setProduct] = React.useState<Product | null>(null);
  const router = useRouter();

  const onSave = async (values: ProductPayload) => {
    try {
      setLoading(true);
      const newImages = (await uploadImagesAndReturnUrls(
        selectedFiles
      )) as string[];
      const newAndExistingImages = [...existingImages, ...newImages];
      values.images = newAndExistingImages;
      await axios.put(`/api/products/${params.productid}`, values);
      message.success('Product updated successfully.');
      router.refresh();
      router.back();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.message || error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async () => {
    try {
      setLoadingProduct(true);
      const response = await axios.get(`/api/products/${params.productid}`);
      setExistingImages(response.data.images || []);
      setProduct(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.message || error.response.data.message);
      }
    } finally {
      setLoadingProduct(false);
    }
  };

  React.useEffect(() => {
    getProduct();
  }, []);

  return (
    <div>
      {loadingProduct && <Loader />}
      <h1 className='text-2xl font-bold text-gray-800'>Edit Product</h1>
      {product && (
        <ProductForm
          setSelectedFiles={setSelectedFiles}
          loading={loading}
          onSave={onSave}
          initialValues={product}
          existingImages={existingImages}
          setExistingImages={setExistingImages}
        />
      )}
    </div>
  );
}

export default EditProduct;
