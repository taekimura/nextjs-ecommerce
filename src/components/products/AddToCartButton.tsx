'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AddProductToCart } from '@/redux/cartSlice';

function AddToCartButton({ product }: { product: Product }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  return (
    <div>
      <Button
        type='primary'
        style={{ fontSize: '12px' }}
        onClick={() => {
          if (currentUser._id) {
            dispatch(AddProductToCart(product));
            message.success('Added to cart');
          } else {
            router.push('/login');
          }
        }}
        disabled={product.countInStock === 0}
      >
        Add To Cart
      </Button>
    </div>
  );
}

export default AddToCartButton;
