import React from 'react';
import { Form, Modal, message, Input } from 'antd';
import { getInputFieldRule } from '@/lib/validations';
import axios from 'axios';
import { Category } from './CategoriesList';

type categoryType = {
  name: string;
  description: string;
};

type CategoryFormProps = {
  showCategoryForm: boolean;
  setShowCategoryForm: (show: boolean) => void;
  reloadData: () => void;
  selectedCategory: Category | null;
  setSelectedCategory: (category: Category | null) => void;
};

function CategoryForm({
  showCategoryForm,
  setShowCategoryForm,
  reloadData,
  selectedCategory,
  setSelectedCategory
}: CategoryFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: categoryType) => {
    try {
      setLoading(true);
      if (selectedCategory) {
        await axios.put(`/api/categories/${selectedCategory._id}`, values);
        message.success('Category updated successfully');
      } else {
        await axios.post('/api/categories', values);
        message.success('Category added successfully');
      }
      setShowCategoryForm(false);
      setSelectedCategory(null);
      reloadData();
    } catch (error: unknown) {
      console.log(error);
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={showCategoryForm}
      onCancel={() => {
        setShowCategoryForm(false);
        setSelectedCategory(null);
      }}
      centered
      title={
        <h1 className='text-2xl font-bold text-gray-800'>
          {selectedCategory ? 'Edit Category' : 'Add Category'}
        </h1>
      }
      closable={false}
      okText='Save'
      onOk={() => {
        form.submit();
      }}
      okButtonProps={{
        loading
      }}
    >
      <Form
        layout='vertical'
        className='flex flex-col gap-5 mt-5'
        form={form}
        onFinish={onFinish}
        initialValues={selectedCategory as Category}
      >
        <Form.Item
          label='Category Name'
          name='name'
          rules={getInputFieldRule('Category name is required')}
        >
          <Input size='large' />
        </Form.Item>

        <Form.Item label='Category Description' name='description'>
          <Input.TextArea rows={4} maxLength={500} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CategoryForm;
