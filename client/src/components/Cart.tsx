import React, { useEffect, useState } from 'react';
import { useUser } from './pages/UserContext';
import axios from 'axios';
import './css/Cart.css';

interface Order {
  _id: string;
  userId: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  totalAmount: number;
  orderDate: Date;
}

const Cart: React.FC = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/orders/${user.lineUserId}`);
          setOrders(response.data);
        } catch (error) {
          console.error('Error fetching the orders', error);
        }
      };

      fetchOrders();
    }
  }, [user]);

  if (!user) {
    return (
      <section className="cart">
        <h2>購物車</h2>
        <p>請先登入以查看您的購物車。</p>
      </section>
    );
  }

  return (
    <section className="cart">
      <h2>購物車</h2>
      {orders.length === 0 ? (
        <p>購物車內沒有商品。</p>
      ) : (
        <div className="order-list">
          {orders.map(order => (
            <div className="order-box" key={order._id}>
              <h3>{order.productName}</h3>
              <p>價錢: {order.productPrice}</p>
              <p>數量: {order.quantity}</p>
              <p>總金額: {order.totalAmount}</p>
              <p>訂購日期: {new Date(order.orderDate).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Cart;
