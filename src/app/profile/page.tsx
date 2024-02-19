'use client';
import React from 'react';
import { Tabs, TabsProps } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import CategoriesList from '@/components/profile/CategoriesList';
import ProductsList from '@/components/profile/ProductsList';
import UserOrderList from '@/components/profile/UserOrderList';
import AdminOrderList from '@/components/profile/AdminOrderList';
import PersonalInfo from '@/components/profile/PersonalInfo';
import UserList from '@/components/profile/UserList';

function Profile() {
  const { currentUser } = useSelector((state: RootState) => state.user);
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || '1';
  const [selectedTab, setSelectedTab] = React.useState(id);
  const router = useRouter();

  const adminItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Products',
      children: <ProductsList />
    },
    {
      key: '2',
      label: 'Categories',
      children: <CategoriesList />
    },
    {
      key: '3',
      label: 'Orders',
      children: <AdminOrderList />
    },
    {
      key: '4',
      label: 'Users',
      children: <UserList />
    },
    {
      key: '5',
      label: 'Personal Information',
      children: <PersonalInfo />
    }
  ];

  const userItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Orders',
      children: <UserOrderList />
    },
    {
      key: '2',
      label: 'Personal Information',
      children: <PersonalInfo />
    }
  ];

  return (
    <div className='w-full overflow-auto'>
      {currentUser.isAdmin && (
        <Tabs
          defaultActiveKey='1'
          onChange={(key) => {
            router.push(`/profile?id=${key}`);
            setSelectedTab(key);
          }}
          activeKey={selectedTab}
          items={adminItems}
        />
      )}
      {!currentUser.isAdmin && <Tabs defaultActiveKey='1' items={userItems} />}
    </div>
  );
}

export default Profile;
