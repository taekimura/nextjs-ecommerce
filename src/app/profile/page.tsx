'use client';
import React from 'react';
import { Tabs, TabsProps } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import CategoriesList from './_components/CategoryList';
// import ProductsList from './components/ProductsList';
// import UsersOrdersList from './components/UsersOrdersList';
// import AdminOrdersList from './components/AdminOrdersList';
// import PersonalInfo from './components/PersonalInfo';
// import UsersList from './components/UsersList';

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
      children: 'product'
    },
    {
      key: '2',
      label: 'Categories',
      children: <CategoriesList />
    },
    {
      key: '3',
      label: 'Orders',
      children: 'admin order'
    },
    {
      key: '4',
      label: 'Users',
      children: 'user list'
    },
    {
      key: '5',
      label: 'Personal Information',
      children: 'personal info'
    }
  ];

  const userItems: TabsProps['items'] = [
    {
      key: '1',
      label: 'Orders',
      children: 'user order'
    },
    {
      key: '2',
      label: 'Personal Information',
      children: 'personal info'
    }
  ];

  return (
    <div>
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
