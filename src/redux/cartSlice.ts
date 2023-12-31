import { createSlice } from '@reduxjs/toolkit';
import { Product } from '@/types';

export interface CartState {
  cartItems: Product[];
  cartTotal: number;
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cartItems: [],
    cartTotal: 0
  } as CartState,
  reducers: {
    AddProductToCart: (
      state,
      action: {
        type: string;
        payload: Product;
      }
    ) => {
      const { _id, price } = action.payload;
      const inCart = state.cartItems.some((item) => item._id === _id);

      if (inCart) {
        return {
          cartItems: state.cartItems.map((item) =>
            item._id === _id
              ? {
                  ...item,
                  quantity: item.quantity + 1
                }
              : item
          ),
          cartTotal: state.cartTotal + price
        };
      } else {
        state.cartItems.push({
          ...action.payload,
          quantity: 1
        });
        state.cartTotal += price;
      }
    },
    RemoveProductFromCart: (
      state,
      action: {
        type: string;
        payload: Product;
      }
    ) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
    },
    EditProductInCart: (
      state,
      action: {
        type: string;
        payload: Product;
      }
    ) => {
      state.cartItems = state.cartItems.map((item) =>
        item._id === action.payload._id ? action.payload : item
      );
    },
    ClearCart: (state) => {
      state.cartItems = [];
    }
  }
});

export const {
  AddProductToCart,
  RemoveProductFromCart,
  EditProductInCart,
  ClearCart
} = cartSlice.actions;
