'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Badge, message, Popover } from 'antd';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { SetCurrentUser } from '@/redux/userSlice';
import { RootState } from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { CartState } from '@/redux/cartSlice';

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { cartItems }: CartState = useSelector(
    (state: RootState) => state.cart
  );

  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isPrivatePage = pathname !== '/login' && pathname !== '/register';
  const dispatch = useDispatch();

  const getCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/auth/currentuser');
      dispatch(SetCurrentUser(response.data.data));
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        dispatch(SetCurrentUser({}));
        console.log(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isPrivatePage) {
      getCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrivatePage, pathname]);

  React.useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const onLogout = async () => {
    try {
      setLoading(true);
      await axios.get('/api/auth/logout');
      dispatch(SetCurrentUser({}));
      router.push('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      } else {
        message.error('Failed to logout.');
      }
    } finally {
      setLoading(false);
    }
  };

  const content = (
    <div className='flex flex-col gap-2 p-1'>
      <div
        className='flex gap-2 items-center cursor-pointer text-md'
        onClick={() => router.push('/profile')}
      >
        <i className='ri-shield-user-line'></i>
        <span>Profile</span>
      </div>

      <div
        className='flex gap-2 items-center cursor-pointer text-md'
        onClick={() => onLogout()}
      >
        <i className='ri-logout-box-r-line'></i>
        <span>Logout</span>
      </div>
    </div>
  );

  return (
    <div>
      {loading && <Loader />}
      {isPrivatePage && (
        <>
          <div className='bg-primary px-5 flex justify-between items-center fixed w-full z-50'>
            <div
              className='flex gap-2 cursor-pointer'
              onClick={() => router.push('/')}
            >
              <h3 className='font-light text-white cursor-pointer'>SOZAI.</h3>
            </div>
            <div className='flex gap-5 items-center pt-1'>
              {!loading && (
                <>
                  <Badge
                    style={{ boxShadow: 'none', marginTop: '5px' }}
                    count={cartItems.reduce((acc, item) => {
                      return acc + item.quantity;
                    }, 0)}
                    className='cursor-pointer shadow-none'
                  >
                    <i
                      className='ri-shopping-cart-line text-white text-3xl mt-1'
                      onClick={() => router.push('/cart')}
                    ></i>
                  </Badge>
                  {currentUser._id ? (
                    <Popover content={content} trigger='click'>
                      <div className='flex h-8 w-8 bg-white p-2 rounded-full items-center justify-center cursor-pointer'>
                        <span>{currentUser.name[0]}</span>
                      </div>
                    </Popover>
                  ) : (
                    <Link href='/login' className='text-white no-underline'>
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className='pt-[80px] p-5'>{children}</div>
        </>
      )}
      {!isPrivatePage && children}
    </div>
  );
}

export default LayoutProvider;
