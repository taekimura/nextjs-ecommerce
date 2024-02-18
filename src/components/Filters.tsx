/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React from 'react';
import axios from 'axios';
import { message, Input } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/types';

function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState<string>('');
  const [categories, setCategories] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState<string>('');

  const getCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      const tempCategories: any = [
        {
          name: 'All',
          _id: ''
        }
      ];
      tempCategories.push(...response.data.data);
      setCategories(tempCategories);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    }
  };

  const onSelectCategory = (category: Category) => {
    setSelectedCategory(category._id);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('category', category._id);
    router.push(`/?${newSearchParams.toString()}`);
  };

  React.useEffect(() => {
    getCategories();
  }, []);

  React.useEffect(() => {
    setTimeout(() => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.set('search', search);
      router.push(`/?${newSearchParams.toString()}`);
    }, 500);
  }, [search]);

  return (
    <div className='flex flex-col gap-5'>
      {categories.length > 0 && (
        <div className='flex flex-row flex-wrap gap-2 md:gap-8 bg-gray-300 py-2 px-5'>
          {categories.map((category: Category) => (
            <div
              key={category._id}
              onClick={() => onSelectCategory(category)}
              className={`cursor-pointer   ${
                selectedCategory === category._id
                  ? 'text-black font-semibold'
                  : 'text-gray-500 font-light'
              }`}
            >
              <span>{category.name}</span>
            </div>
          ))}
        </div>
      )}
      <Input
        type='text'
        style={{ borderRadius: 0, marginBottom: '8px' }}
        placeholder='Search products'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default Filters;
