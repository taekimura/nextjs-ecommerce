'use client';
import React from 'react';
import { Button, message } from 'antd';
import {
  PaymentElement,
  AddressElement,
  useElements,
  useStripe
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CartState, ClearCart } from '@/redux/cartSlice';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Loader from '@/components/Loader';
import { RootState } from '@/redux/store';

function CheckoutForm({
  total,
  setShowCheckoutModal
}: {
  total: number;
  setShowCheckoutModal: (showCheckoutModal: boolean) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const elements = useElements();
  const stripe = useStripe();
  const { cartItems }: CartState = useSelector(
    (state: RootState) => state.cart
  );
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      event.preventDefault();
      if (!stripe || !elements) {
        throw new Error("Stripe.js hasn't loaded yet.");
      }
      const locationOrigin =
        typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : '';
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${locationOrigin}/cart`
        },
        redirect: 'if_required'
      });

      if (result.error) {
        throw result.error;
      }

      message.success('Payment successful.');

      const orderPayload = {
        items: cartItems,
        paymentStatus: 'paid',
        orderStatus: 'order placed',
        shippingAddress: result.paymentIntent.shipping,
        transactionId: result.paymentIntent.id,
        total
      };
      await axios.post('/api/orders/place_order', orderPayload);
      dispatch(ClearCart());
      message.success('Order placed successfully.');
      router.push('/profile');
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {loading && <Loader />}
      <form onSubmit={handleSubmit}>
        <div className='h-[350px] overflow-y-scroll pr-5'>
          <PaymentElement />
          <AddressElement
            options={{
              allowedCountries: ['CA'],
              mode: 'shipping'
            }}
          />
        </div>
        <div className='flex gap-5'>
          <Button
            htmlType='button'
            className='mt-5'
            block
            onClick={() => {
              setShowCheckoutModal(false);
              router.replace('/cart');
            }}
          >
            Cancel
          </Button>
          <Button type='primary' htmlType='submit' className='mt-5' block>
            Pay
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CheckoutForm;
