'use client';
import React from 'react';
// import { ProductInterface } from '@/interfaces';
// import { AddProductToCart, CartState } from '@/redux/cartSlice';
import { Button, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

function AddToCartButton({ product }: { product: any }) {
  const dispatch = useDispatch();
  // const { cartItems }: CartState = useSelector((state: any) => state.cart);
  return (
    <div>
      <Button
        type='primary'
        style={{ fontSize: '12px' }}
        onClick={(e) => {
          // dispatch(
          //   AddProductToCart({
          //     ...product,
          //     quantity: 1
          //   })
          // );
          message.success('Added to cart');
        }}
        // disabled={
        //   cartItems.some(
        //     (item: ProductInterface) => item._id === product._id
        //   ) || product.countInStock === 0
        // }
      >
        Add To Cart
      </Button>
    </div>
  );
}

export default AddToCartButton;
