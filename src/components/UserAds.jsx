import React, { useState, useEffect } from 'react';
import { Table, Button, Image } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css'; // For v5 and above (if using Ant Design v5)

const UserAds = () => {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBoats = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('User not logged in');
        }

        const user = JSON.parse(userStr);
        const response = await fetch('https://api.dubaiboating.com/public/api/boats');
        const allBoats = await response.json();
        const userBoats = allBoats.filter(boat => boat.user_id === user.user_id);
        setBoats(userBoats);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBoats();
  }, []);

  const getPrimaryImageUrl = (images) => {
    const primaryImage = images?.find(img => img.is_primary === 1);
    return primaryImage
      ? `https://api.dubaiboating.com/storage/app/public/${primaryImage.image_url}`
      : '/api/placeholder/300/200';
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (_, boat) => (
        <Image
          width={100}
          height={100}
          src={getPrimaryImageUrl(boat.images)}
          alt={boat.title}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, boat) => (
        <span>{boat.title}</span>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      key: 'quantity',
      render: () => '1',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text) => `AED ${Number(text).toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'boat_condition',
      key: 'boat_condition',
      render: (condition) => (
        <span>{condition}</span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, boat) => (
        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(boat)}>
          Edit
        </Button>
      ),
    },
  ];

  const handleEdit = (boat) => {
    // Handle the edit action here
    console.log('Editing boat:', boat);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>
        Current Listings
      </h2>
      <Table
        columns={columns}
        dataSource={boats}
        rowKey="id"
        pagination={false}
        bordered
      />
    </div>
  );
};

export default UserAds;
