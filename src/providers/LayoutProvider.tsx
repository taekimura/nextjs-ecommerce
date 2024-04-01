'use client';

import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { SetCurrentUser } from '@/redux/userSlice';
import axios from 'axios';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = React.useState(false);
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

  return (
    <>
      {loading && <Loader />}
      {isPrivatePage && (
        <>
          <Header />
          <div className='pt-[80px] p-5'>{children}</div>
        </>
      )}
      {!isPrivatePage && children}
    </>
  );
}

export default LayoutProvider;
