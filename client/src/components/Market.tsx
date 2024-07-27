import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Market.css';

interface Product {
  productId: string;
  name: string;
  price: number;
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
            <p>Price: {product.price}</p>
            <p>Producer: {product.lineUserName}</p>
            <p>Farm Place: {product.farmPlace}</p>
            <p>Net Weight: {product.netWeight}g</p>
            <p>Pesticide Record: {product.pesticideRecord}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Market;
