'use client';
import React from 'react';
import { Button, Table, message } from 'antd';
import CategoryForm from './CategoryForm';
import axios from 'axios';
import moment from 'moment';

export type Category = {
  _id: string;
  name: string;
  description: string;
  createdBy: {
    _id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};

function CategoriesList() {
  const [loading, setLoading] = React.useState(false);
  const [loadingForDelete, setLoadingForDelete] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [showCategoryForm, setShowCategoryForm] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/categories');
      setCategories(response.data.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  const onDelete = async (id: string) => {
    try {
      setLoadingForDelete(true);
      await axios.delete(`/api/categories/${id}`);
      message.success('Category deleted successfully');
      setSelectedCategory(null);
      getCategories();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || error.message);
      }
    } finally {
      setLoadingForDelete(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Description',
      dataIndex: 'description'
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
      render: (_: string, params: Category) => {
        return (
          <div className='flex gap-3 items-center'>
            <Button
              type='default'
              className='btn-small'
              onClick={() => [
                setSelectedCategory(params),
                onDelete(params._id)
              ]}
              loading={loadingForDelete && selectedCategory?._id === params._id}
            >
              Delete
            </Button>
            <Button
              type='primary'
              className='btn-small'
              onClick={() => {
                setSelectedCategory(params);
                setShowCategoryForm(true);
              }}
            >
              Edit
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <div className='flex justify-end'>
        <Button type='primary' onClick={() => setShowCategoryForm(true)}>
          Add Category
        </Button>
      </div>

      <div className='mt-5'>
        <Table
          columns={columns}
          dataSource={categories}
          pagination={false}
          loading={loading}
          rowKey='name'
        />
      </div>

      {showCategoryForm && (
        <CategoryForm
          showCategoryForm={showCategoryForm}
          setShowCategoryForm={setShowCategoryForm}
          selectedCategory={selectedCategory}
          reloadData={() => getCategories()}
          setSelectedCategory={setSelectedCategory}
        />
      )}
    </div>
  );
}

export default CategoriesList;
