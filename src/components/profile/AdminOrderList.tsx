import React from 'react';
import axios from 'axios';
import { Table, message } from 'antd';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { formatPrice } from '@/lib/utils';

function AdminOrdersList() {
  const router = useRouter();
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const [statusUpdateLoading = false, setStatusUpdateLoading] =
    React.useState<boolean>(false);
  const [orders = [], setOrders] = React.useState([]);

  const getOrders = async () => {
    try {
      setLoading(true);
      const endPoint = `/api/orders`;
      const response = await axios.get(endPoint);
      console.log(response.data);
      setOrders(response.data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onStatusUpdate = async (orderId: string, status: string) => {
    try {
      setStatusUpdateLoading(true);
      const endPoint = `/api/orders/${orderId}`;
      await axios.put(endPoint, { orderStatus: status });
      message.success('Order status updated successfully');
      getOrders();
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const onRefundIssue = async (orderId: string, transactionId: string) => {
    try {
      setStatusUpdateLoading(true);
      const endPoint = `/api/stripe_refund`;
      await axios.post(endPoint, { orderId, transactionId });
      message.success('Refund issued successfully');
      getOrders();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message);
      }
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  React.useEffect(() => {
    getOrders();
  }, []);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id'
    },
    {
      title: 'User',
      dataIndex: 'user',
      render: (user: any) => user.name
    },
    {
      title: 'Placed On',
      dataIndex: 'createdAt',
      render: (date: string) => moment(date).format('DD MMM YYYY hh:mm a')
    },
    {
      title: 'Total',
      dataIndex: 'total',
      render: (total: number) => formatPrice(total)
    },
    {
      title: 'Status',
      dataIndex: 'orderStatus',
      render: (status: string, record: any) => (
        <div>
          <select
            value={status}
            onChange={(e) => {
              onStatusUpdate(record._id, e.target.value);
            }}
          >
            <option value='order placed'>Order Placed</option>
            <option value='shipped'>Shipped</option>
            <option value='out for delivery'>Out for Delivery</option>
            <option value='delivered'>Delivered</option>

            <option value='cancelled'>Cancelled</option>
          </select>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'paymentStatus',
      render: (status: string) => status.toUpperCase()
    },
    {
      title: 'Action',
      render: (record: any) => (
        <div className='flex gap-5'>
          {record.orderStatus === 'cancelled' &&
            record.paymentStatus === 'paid' && (
              <span
                className='underline cursor-pointer'
                onClick={() => {
                  onRefundIssue(record._id, record.transactionId);
                }}
              >
                Issue Refund
              </span>
            )}
          <span
            className='underline cursor-pointer'
            onClick={() => {
              router.push(`/profile/orders/${record._id}`);
            }}
          >
            View
          </span>
        </div>
      )
    }
  ];
  return (
    <div>
      {statusUpdateLoading && <Loader />}
      <Table
        columns={columns}
        dataSource={orders}
        rowKey='_id'
        loading={loading}
        pagination={false}
      />
    </div>
  );
}

export default AdminOrdersList;
