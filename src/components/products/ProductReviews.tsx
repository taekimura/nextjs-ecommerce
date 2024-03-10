'use client';
import React from 'react';
import axios from 'axios';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Button, Modal, Rate, message } from 'antd';
import { Product } from '@/types';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

function ProductReviews({ product }: { product: Product }) {
  const router = useRouter();
  const pathname = usePathname();
  const isModalParam = useSearchParams().has('modal');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [comment, setComment] = React.useState<string>('');
  const [rating, setRating] = React.useState<number>(0);
  const [showReviewForm, setShowReviewForm] = React.useState(false);
  const [reviews, setReviews] = React.useState([]);
  const { currentUser } = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    if (isModalParam) {
      setShowReviewForm(true);
    }
  }, [isModalParam, setShowReviewForm]);

  const getReviews = async () => {
    try {
      const endPoint = `/api/reviews?product=${product._id}`;
      const response = await axios.get(endPoint);
      setReviews(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      }
    }
  };

  const submitReview = async () => {
    try {
      setLoading(true);
      const endPoint = `/api/reviews`;
      const response = await axios.post(endPoint, {
        comment,
        rating,
        product: product._id
      });
      message.success(response.data.message);
      getReviews();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
      setShowReviewForm(false);
    }
  };

  React.useEffect(() => {
    getReviews();
  }, []);

  return (
    <div className='mt-5'>
      <div className='flex flex-row flex-wrap justify-between items-center'>
        <h1 className='text-2xl font-semibold'>Reviews</h1>
        <Button
          type='primary'
          onClick={() => {
            if (currentUser._id) {
              setComment('');
              setRating(0);
              setShowReviewForm(true);
            } else {
              router.push(`/login?redirect=${pathname}?modal`);
            }
          }}
        >
          Write a review
        </Button>
      </div>
      {reviews.length === 0 && (
        <div className='text-gray-500 mt-5'>
          <span>No reviews yet. Be the first to review this product.</span>
        </div>
      )}

      <div className='flex flex-col gap-5 mt-5'>
        {reviews.map((review: any) => (
          <div
            key={review._id}
            className='flex flex-col gap-2 border border-gray-400 p-3 border-solid'
          >
            <div className='flex justify-between '>
              <div className='flex gap-2 items-center'>
                <div className='flex p-3 items-center justify-center bg-gray-600 rounded-full h-8 w-8 text-white'>
                  <span>{review.user.name[0]}</span>
                </div>
                <span className='text-sm'>{review.user.name}</span>
              </div>
              <Rate
                disabled
                defaultValue={review.rating}
                style={{
                  color: 'black'
                }}
              />
            </div>
            <span className='text-sm text-gray-500'>{review.comment}</span>
          </div>
        ))}
      </div>

      <Modal
        open={showReviewForm}
        onCancel={() => {
          setShowReviewForm(false);
          router.replace(pathname);
        }}
        title={
          <div className='flex justify-between items-center uppercase'>
            <h1 className='text-2xl font-semibold'>Write a review</h1>
          </div>
        }
        closable={false}
        okText='Submit'
        cancelText='Cancel'
        onOk={submitReview}
        confirmLoading={loading}
      >
        <div className='flex flex-col gap-5'>
          <div className='flex flex-col'>
            <span className='pb-2'>Rating</span>
            <Rate value={rating} onChange={(value) => setRating(value)} />
          </div>
          <div>
            <span>Comment</span>
            <textarea
              className='mt-2 w-full h-32'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ProductReviews;
