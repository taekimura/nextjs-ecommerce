import React from 'react';
import axios from 'axios';
import { Modal, Table, message } from 'antd';
import moment from 'moment';
import { RootState } from '@/redux/store';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { formatPrice } from '@/lib/utils';

function UserOrdersList() {
  const router = useRouter();
  const [loading = false, setLoading] = React.useState<boolean>(false);
  const [showCancelModal = false, setShowCancelModal] =
    React.useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null);
  const [statusUpdateLoading = false, setStatusUpdateLoading] =
    React.useState<boolean>(false);
  const [orders = [], setOrders] = React.useState([]);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const getOrders = async () => {
    try {
      setLoading(true);
      const endPoint = `/api/orders?user=${currentUser._id}`;
      const response = await axios.get(endPoint);
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
      message.success('Your order has been cancelled successfully. Thank you.');
      setShowCancelModal(false);
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
    if (currentUser._id) {
      getOrders();
    }
  }, [currentUser]);

  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id'
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
      render: (status: string) => status.toUpperCase()
    },
    {
      title: 'Action',
      render: (record: any) => (
        <div className='flex gap-5'>
          {record.orderStatus === 'order placed' && (
            <span
              className='underline cursor-pointer'
              onClick={() => {
                setSelectedOrder(record);
                setShowCancelModal(true);
              }}
            >
              Cancel
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
      <Table
        columns={columns}
        dataSource={orders}
        rowKey='_id'
        loading={loading}
        pagination={false}
      />

      {selectedOrder && (
        <Modal
          open={showCancelModal}
          onCancel={() => {
            setShowCancelModal(false);
          }}
          title='Cancel Order'
          centered
          closable={false}
          onOk={() => {
            onStatusUpdate(selectedOrder._id, 'cancelled');
          }}
          okText='Yes, Cancel Order'
          cancelText='No, Keep Order'
          okButtonProps={{
            loading: statusUpdateLoading
          }}
        >
          <p className='my-10 text-gray-600'>
            Are you sure you want to cancel order #{selectedOrder._id} ? This
            action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
}

export default UserOrdersList;
