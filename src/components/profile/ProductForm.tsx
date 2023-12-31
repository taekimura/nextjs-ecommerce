/* eslint-disable @next/next/no-img-element */
import { getInputFieldRule } from '@/lib/validations';
import { Button, Form, message, Upload, Input, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Category, Product, ProductPayload } from '@/types';

type ProductFormProps = {
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  loading: boolean;
  onSave: (values: ProductPayload) => Promise<void>;
  initialValues?: Product;
  existingImages?: string[];
  setExistingImages?: React.Dispatch<React.SetStateAction<string[]>>;
};

function ProductForm({
  setSelectedFiles,
  loading,
  initialValues,
  onSave,
  existingImages = [],
  setExistingImages
}: ProductFormProps) {
  const router = useRouter();
  const [categories, setCategories] = React.useState([]);

  const getCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  return (
    <div>
      <Form
        layout='vertical'
        className='mt-10 flex flex-col xl:grid grid-cols-3 gap-2'
        onFinish={onSave}
        initialValues={initialValues}
      >
        <div className='col-span-3'>
          <Form.Item
            label='Name'
            name='name'
            rules={getInputFieldRule('Name is required')}
          >
            <Input size='large' />
          </Form.Item>
        </div>
        <div className='col-span-3'>
          <Form.Item
            label='Description'
            name='description'
            rules={getInputFieldRule('Description is required')}
          >
            <Input.TextArea rows={4} maxLength={1000} />
          </Form.Item>
        </div>

        <Form.Item
          label='Price'
          name='price'
          rules={
            !initialValues ? getInputFieldRule('Price is required') : undefined
          }
        >
          <Input type='number' size='large' min={0} />
        </Form.Item>

        <Form.Item
          label='Category'
          name='category'
          rules={getInputFieldRule('Category is required')}
        >
          <Select
            size='large'
            options={categories.map((c: Category) => {
              return { label: c.name, value: c._id };
            })}
          />
        </Form.Item>
        <Form.Item
          label='Count In Stock'
          name='countInStock'
          rules={
            !initialValues ? getInputFieldRule('Stock is required') : undefined
          }
        >
          <Input type='number' size='large' min={0} />
        </Form.Item>

        <div className='col-span-3 flex gap-2'>
          {existingImages.map((image: string) => (
            <div
              key={image}
              className='rounded-lg border border-solid p-3 border-gray-300 '
            >
              <img src={image} alt='product' className='w-20 h-auto' />
              <h1
                className='cursor-pointer underline text-xs'
                onClick={() => {
                  setExistingImages &&
                    setExistingImages((prev: string[]) =>
                      prev.filter((i: string) => i !== image)
                    );
                }}
              >
                Remove
              </h1>
            </div>
          ))}
        </div>

        <div className='col-span-3'>
          <Upload
            listType='picture-card'
            multiple
            beforeUpload={(file) => {
              setSelectedFiles((prev: File[]) => [...prev, file]);
              return false;
            }}
          >
            <div>
              <PlusOutlined />
              <div className='mt-2'>Upload</div>
            </div>
          </Upload>
        </div>

        <div className='col-span-3 mt-10'>
          <h1 className='text-lg font-semibold'>Features</h1>
          <Form.List name='features'>
            {(fields, { add, remove }) => (
              <div className='flex flex-col gap-1'>
                {fields.map((field, index) => (
                  <div key={field.key} className='flex gap-5 items-center'>
                    <Form.Item
                      label={`Feature ${index + 1}`}
                      name={[field.name]}
                      className='w-full'
                    >
                      <Input size='large' />
                    </Form.Item>
                    <Button size='large' onClick={() => remove(field.name)}>
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  type='dashed'
                  onClick={() => add()}
                  block
                  className='mt-2'
                >
                  Add Feature
                </Button>
              </div>
            )}
          </Form.List>
        </div>

        <div className='col-span-3 justify-end flex gap-5 mt-5'>
          <Button size='large' onClick={() => router.back()}>
            Back
          </Button>
          <Button
            size='large'
            type='primary'
            htmlType='submit'
            loading={loading}
          >
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default ProductForm;
