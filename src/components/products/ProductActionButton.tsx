'use client';
import { Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Product } from '@/types';
import { RootState } from '@/redux/store';
import { AddProductToCart } from '@/redux/cartSlice';

function ProductActionButtons({ product }: { product: Product }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);

  return (
    <div className='flex gap-5 mt-5'>
      <Button
        type='default'
        disabled={product.countInStock === 0}
        onClick={() => {
          if (currentUser._id) {
            dispatch(AddProductToCart(product));
            message.success('Added to cart');
          } else {
            router.push(`/login?redirect=/${pathname}`);
          }
        }}
      >
        Add to Cart
      </Button>
      <Button
        type='primary'
        disabled={product.countInStock === 0}
        onClick={() => {
          if (currentUser._id) {
            dispatch(AddProductToCart(product));
            message.success('Added to cart');
            router.push('/cart');
          } else {
            router.push(`/login?redirect=/${pathname}`);
          }
        }}
      >
        Buy Now
      </Button>
    </div>
  );
}

export default ProductActionButtons;
