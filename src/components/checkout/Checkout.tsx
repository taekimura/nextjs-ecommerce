'use client';
import { Modal, message } from 'antd';
import React from 'react';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import Loader from '@/components/Loader';
import { formatPrice } from '@/lib/utils';

const stripePromise = loadStripe('pk_test_ZYjLFheDRmo87WABiETBv6mS00v1hsaMbu');

type CheckoutModalProps = {
  showCheckoutModal: boolean;
  setShowCheckoutModal: (showCheckout: boolean) => void;
  total: number;
};

function CheckoutModal({
  showCheckoutModal,
  setShowCheckoutModal,
  total
}: CheckoutModalProps) {
  const [loading, setLoading] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState('');

  const loadClientSecret = async () => {
    try {
      setLoading(true);
      const res = await axios.post('/api/stripe_client_secret', {
        amount: total
      });
      setClientSecret(res.data.clientSecret);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadClientSecret();
  }, []);

  return (
    <Modal
      title={
        <div className='flex justify-between items-center font-bold text-xl'>
          <span>Checkout</span>
          <span>Total: {formatPrice(total)}</span>
        </div>
      }
      open={showCheckoutModal}
      onCancel={() => setShowCheckoutModal(false)}
      centered
      closable={false}
      footer={false}
    >
      {loading && <Loader />}
      <hr className='my-5' />
      <div className='mt-5'>
        {stripePromise && clientSecret && (
          <Elements
            key={clientSecret}
            stripe={stripePromise}
            options={{
              clientSecret
            }}
          >
            <CheckoutForm
              total={total}
              setShowCheckoutModal={setShowCheckoutModal}
            />
          </Elements>
        )}
      </div>
    </Modal>
  );
}

export default CheckoutModal;
