import React, { useEffect, useState } from 'react';
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
  const [products, setProducts] = useState<Product[]>([]);

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

  return (
    <section className="market">
      <h2>農產品市場</h2>
      <div className="product-list">
        {products.map(product => (
          <div className="product-box" key={product.productId}>
            <h3>{product.name}</h3>
            <p>價錢: {product.price}</p>
            <p>數量: {product.quantity}</p>
            <p>生產者: {product.lineUserName}</p>
            <p>生產地: {product.farmPlace}</p>
            <p>淨重量: {product.netWeight}g</p>
            <p>農藥紀錄: {product.pesticideRecord}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Market;
