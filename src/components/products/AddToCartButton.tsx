'use client';
import React from 'react';
import { Product } from '@/types';
import { Button, message } from 'antd';
import { useDispatch } from 'react-redux';
import { AddProductToCart } from '@/redux/cartSlice';

function AddToCartButton({ product }: { product: Product }) {
  const dispatch = useDispatch();

  return (
    <div>
      <Button
        type='primary'
        style={{ fontSize: '12px' }}
        onClick={() => {
          dispatch(AddProductToCart(product));
          message.success('Added to cart');
        }}
        disabled={product.countInStock === 0}
      >
        Add To Cart
      </Button>
    </div>
  );
}

export default AddToCartButton;
