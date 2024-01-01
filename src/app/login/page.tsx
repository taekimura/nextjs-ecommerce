'use client';
import React from 'react';
import { Button, Form, Input, message } from 'antd';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  getInputFieldRule,
  EMAIL_REGEX,
  PASSWORD_REGEX,
  passwordRule
} from '@/lib/validations';

interface userType {
  email: string;
  password: string;
}

function Login() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const onLogin = async (values: userType) => {
    try {
      setLoading(true);
      await axios.post('/api/auth/login', values);
      router.push('/');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 min-h-screen'>
      <div className='h-full bg-primary hidden md:flex items-center justify-center'>
        <h1
          className='text-5xl font-light text-white cursor-pointer'
          onClick={() => router.push('/')}
        >
          SOZAI.
        </h1>
      </div>

      <div className='flex items-center justify-center h-full'>
        <Form
          className='w-[400px] flex flex-col'
          layout='vertical'
          requiredMark={false}
          onFinish={onLogin}
        >
          <h1 className='text-2xl font-light'>Login</h1>
          <Form.Item
            name='email'
            label='Email'
            rules={getInputFieldRule('Please enter a valid email', EMAIL_REGEX)}
          >
            <Input size='large' />
          </Form.Item>
          <Form.Item
            name='password'
            label='Password'
            rules={getInputFieldRule(
              `Please enter a valid password (${passwordRule})`,
              PASSWORD_REGEX
            )}
          >
            <Input.Password size='large' />
          </Form.Item>
          <Button
            className='my-2'
            type='primary'
            size='large'
            htmlType='submit'
            block
            loading={loading}
          >
            Login
          </Button>

          <Link href='/register' className='text-primary text-right'>
            Don't have an account? Register
          </Link>
        </Form>
      </div>
    </div>
  );
}

export default Login;
