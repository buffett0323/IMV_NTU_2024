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

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/auth/orders/delete/${orderId}`);
      // After deleting, filter out the deleted order from the state
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (error) {
      console.error('Error deleting the order', error);
    }
  };

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
        <table className="order-sheet">
          <thead>
            <tr>
              <th>產品名稱</th>
              <th>價錢</th>
              <th>數量</th>
              <th>總金額</th>
              <th>訂購日期</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.productName}</td>
                <td>{order.productPrice}</td>
                <td>{order.quantity}</td>
                <td>{order.totalAmount}</td>
                <td>{new Date(order.orderDate).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleDeleteOrder(order._id)} className="delete-button">
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default Cart;
