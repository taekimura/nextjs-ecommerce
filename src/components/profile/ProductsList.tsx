/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import { Button, Table, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';

function ProductsList() {
  const router = useRouter();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [deleteLoading, setDeleteLoading] = React.useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [products, setProducts] = React.useState<Product[]>([]);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = async (productId: string) => {
    try {
      setDeleteLoading(true);
      await axios.delete(`/api/products/${productId}`);
      message.success('Product deleted successfully');
      getProducts();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || error.message);
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      render: (text: string, record: Product) => {
        if (record.images) {
          return (
            <img
              src={record.images[0]}
              alt={text}
              className='w-20 h-20 object-cover rounded-full'
            />
          );
        }
      }
    },
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      render: (createdBy: { _id: string; name: string }) => createdBy.name
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (createdAt: string) =>
        moment(createdAt).format('DD MMM YYYY hh:mm A')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: string, params: Product) => (
        <div className='flex gap-3 items-center'>
          <Button
            type='default'
            className='btn-small'
            onClick={() => {
              setSelectedProduct(params);
              deleteProduct(params._id);
            }}
            loading={deleteLoading && selectedProduct?._id === params._id}
          >
            Delete
          </Button>
          <Button
            type='primary'
            className='btn-small'
            onClick={() => {
              router.push(`/profile/edit_product/${params._id}`);
            }}
          >
            Edit
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className='flex justify-end'>
        <Button
          type='primary'
          onClick={() => router.push('/profile/add_product')}
        >
          Add Product
        </Button>
      </div>

      <div className='mt-5'>
        <Table
          columns={columns}
          dataSource={products}
          loading={loading}
          pagination={false}
          rowKey='name'
        />
      </div>
    </div>
  );
}

export default ProductsList;
