import React, { useEffect, useState } from 'react';
import { useUser } from './pages/UserContext';
import axios from 'axios';
import './css/Market.css';

interface Product {
  name: string,
  price: number,
  quantity: number,
  lineUserName: string,
  lineUserId: string,
  farmPlace: string,
  netWeight: number,
  pesticideRecord: string,
  productId: string,
  imageBase64: string,
  timestamp: string
}

const Market: React.FC = () => {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [orderQuantities, setOrderQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/products`);
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
      const quantity = orderQuantities[product.productId] || 1; // 預設為 1，如果未指定
  
      const order = {
        userId,
        productId: product.productId,
        productName: product.name,
        productPrice: product.price,
        quantity,
        totalAmount: product.price * quantity,
      };
  
      try {
        // 發送訂單請求到後端，並等待響應
        const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/orders`, order);
        
        // 提示來自後端的成功訊息，或使用默認訊息
        alert(response.data.message || 'Order placed successfully');
      } catch (error: unknown) {
        // 檢查錯誤是否為 Axios 錯誤
        if (axios.isAxiosError(error)) {
          // 確保 error.response 存在並有 message
          if (error.response && error.response.data && error.response.data.message) {
            alert(`Failed to place the order: ${error.response.data.message}`);
          } else {
            console.error('Error placing the order', error);
            alert('Failed to place the order');
          }
        } else {
          // 非 Axios 錯誤的處理邏輯
          console.error('An unexpected error occurred', error);
          alert('An unexpected error occurred. Please try again.');
        }
      }
    } else {
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
              {product.imageBase64 && <img src={product.imageBase64} alt={product.name} className="product-image" />}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <div className="info-columns">
                <div className="column">
                  <p><span className="label">價錢:</span><span className="value">{product.price} 元</span></p>
                  <p><span className="label">生產者:</span><span className="value">{product.lineUserName}</span></p>
                  <p><span className="label">淨重量:</span><span className="value">{product.netWeight}g</span></p>
                </div>
                <div className="column">
                  <p><span className="label">數量:</span><span className="value">{product.quantity}</span></p>
                  <p><span className="label">生產地:</span><span className="value">{product.farmPlace}</span></p>
                  <p><span className="label">農藥紀錄:</span><span className="value">{product.pesticideRecord}</span></p>
                </div>
              </div>
              <div className="order-form">
                <input
                  type="number"
                  // min="1"
                  value={orderQuantities[product.productId]}
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
