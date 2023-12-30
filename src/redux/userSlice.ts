import { createSlice } from '@reduxjs/toolkit';

type CurrentUser = {
  _id: string;
  name: string;
  email: string;
  deliveryAddresses: string[];
  isActive: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export const userSlice = createSlice({
  initialState: {
    currentUser: {} as CurrentUser
  },
  name: 'user',
  reducers: {
    SetCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    }
  }
});

export const { SetCurrentUser } = userSlice.actions;
