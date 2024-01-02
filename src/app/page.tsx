import axios from 'axios';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import AddToCartButton from '@/components/products/AddToCartButton';
import Rate from '@/components/products/Rate';
import { formatPrice } from '../lib/utils';
import { Product } from '@/types';
import Filters from '@/components/Filters';

async function getProducts(searchParams: any) {
  try {
    const category = searchParams.category || '';
    const search = searchParams.search || '';
    const endPoint = `http://localhost:3000/api/products?category=${category}&search=${search}`;
    const response = await axios.get(endPoint);
    return response.data.data || [];
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return [];
  }
}

export default async function Home({ searchParams }: any) {
  const products = await getProducts(searchParams);

  return (
    <div>
      <Filters />
      <div className='grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5 mt-3'>
        {products.map((product: Product) => (
          <div
            key={product._id}
            className='px-4 py-4 flex flex-col gap-1 border border-solid border-gray-300'
          >
            <Link href={`/products/${product._id}`} className='no-underline'>
              <div className='text-center'>
                <Image
                  src={product.images[0]}
                  alt=''
                  height={150}
                  width={150}
                />
              </div>
              <div className='flex flex-col mt-5'>
                <span className='mb-3 text-sm font-semibold text-black'>
                  {product.name}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <Rate
                  disabled
                  defaultValue={product.rating || 0}
                  style={{ fontSize: '14px', color: 'black' }}
                />
                <span className='text-gray-500 text-xs'>
                  {product.countInStock > 0
                    ? `${product.countInStock} in stock`
                    : 'Out of stock'}
                </span>
              </div>
            </Link>
            <div className='flex gap-5 items-center justify-between'>
              <h2 className='text-base font-bold'>
                {formatPrice(product.price)}
              </h2>
              <AddToCartButton product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
