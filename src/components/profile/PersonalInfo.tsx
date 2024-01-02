import React from 'react';
import { Form, Button, message, Input } from 'antd';
import { getInputFieldRule } from '@/lib/validations';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { SetCurrentUser } from '@/redux/userSlice';

function PersonalInfo() {
  const [loading, setLoading] = React.useState(false);
  const { currentUser } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const onSave = async (values: any) => {
    try {
      setLoading(true);
      const endPoint = `/api/users/${currentUser._id}`;
      const response = await axios.put(endPoint, values);
      dispatch(SetCurrentUser(response.data));
      message.success('User updated successfully');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form
        className='w-[400px] flex flex-col gap-5'
        layout='vertical'
        onFinish={onSave}
        initialValues={{
          name: currentUser.name,
          email: currentUser.email
        }}
      >
        <Form.Item
          name='name'
          label='Name'
          rules={getInputFieldRule('Please input your name!')}
        >
          <Input size='large' type='text' />
        </Form.Item>

        <Form.Item
          name='email'
          label='Email'
          rules={getInputFieldRule('Please input your email!')}
        >
          <Input size='large' type='text' disabled />
        </Form.Item>

        <Form.Item
          name='password'
          label='Current password'
          rules={getInputFieldRule('Please input your old password!')}
        >
          <Input.Password size='large' />
        </Form.Item>

        <Form.Item
          name='newPassword'
          label='New Password'
          rules={getInputFieldRule('Please input your new password!')}
        >
          <Input.Password size='large' />
        </Form.Item>

        <Button
          type='primary'
          size='large'
          htmlType='submit'
          block
          loading={loading}
        >
          Save
        </Button>
      </Form>
    </div>
  );
}

export default PersonalInfo;
