import React, { useEffect, useState } from 'react';
import { useUser } from './pages/UserContext';
import axios from 'axios';
import './css/Market.css';

interface Product {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  lineUserName: string;
  lineUserId: string;
  farmPlace: string;
  netWeight: number;
  pesticideRecord: string;
  timestamp: Date;
}

const Market: React.FC = () => {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderQuantities, setOrderQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/auth/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching the products', error);
      }
    };

    fetchProducts();
  }, []);

  const handleQuantityChange = (productId: string, quantity: number) => {
    setOrderQuantities({ ...orderQuantities, [productId]: quantity });
  };

  const handleOrder = async (product: Product) => {
    if (user) {
      const userId = user.lineUserId;
      const quantity = orderQuantities[product.productId] || 1; // Default to 1 if not specified
  
      const order = {
        userId,
        productId: product.productId,
        productName: product.name,
        productPrice: product.price,
        quantity,
        totalAmount: product.price * quantity,
      };
  
      try {
        await axios.post('http://localhost:8000/api/auth/orders', order);
        alert('Order placed successfully');
      } catch (error) {
        console.error('Error placing the order', error);
        alert('Failed to place the order');
      }
    }
    else {
      alert("Please Login First!");
    }
    
  };

  return (
    <section className="market">
      <h2>農產品市場</h2>
      <div className="product-list">
        {products.map(product => (
          <div className="product-card" key={product.productId}>
            <div className="product-image">
              {/* Replace with an actual image URL or placeholder */}
              {/* <img src="image_url_or_placeholder.jpg" alt={product.name} /> */}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>價錢: {product.price} 元</p>
              <p>數量: {product.quantity}</p>
              <p>生產者: {product.lineUserName}</p>
              <p>生產地: {product.farmPlace}</p>
              <p>淨重量: {product.netWeight}g</p>
              <p>農藥紀錄: {product.pesticideRecord}</p>
              <div className="order-form">
                <input
                  type="number"
                  min="1"
                  value={orderQuantities[product.productId] || 1}
                  onChange={(e) => handleQuantityChange(product.productId, parseInt(e.target.value))}
                />
                <button onClick={() => handleOrder(product)}>訂購</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Market;
