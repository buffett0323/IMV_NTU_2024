import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './pages/UserContext';
import './css/Producer.css';

const Producer: React.FC = () => {
  const { user } = useUser();
  const [products, setProducts] = useState<{
    name: string,
    price: number,
    lineUserName: string,
    lineUserId: string,
    farmPlace: string,
    netWeight: number,
    pesticideRecord: string,
    productId?: string
  }[]>([]);
  const [newProduct, setNewProduct] = useState<{
    name: string,
    price: number,
    farmPlace: string,
    netWeight: number,
    pesticideRecord: string
  }>({ name: '', price: 0, farmPlace: '', netWeight: 0, pesticideRecord: '' });

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:8000/api/auth/products/${user.lineUserId}`)
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the products!', error);
        });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleAddProduct = () => {
    if (user) {
      const productToAdd = { ...newProduct, lineUserId: user.lineUserId, lineUserName: user.displayName };
      axios.post('http://localhost:8000/api/auth/products', productToAdd)
        .then(response => {
          setProducts([...products, response.data]);
          setNewProduct({ name: '', price: 0, farmPlace: '', netWeight: 0, pesticideRecord: '' });
        })
        .catch(error => {
          console.error('There was an error adding the product!', error);
        });
    }
  };

  return (
    <section className="market">
      <h2>賣家中心</h2>

      <div className="product-list">
        <h3>您的產品</h3>
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-box" key={product.productId}>
              <div className="product-name">{product.name}</div>
              <div className="product-price">價格: ${product.price}</div>
              <div className="product-farmPlace">產地: {product.farmPlace}</div>
              <div className="product-netWeight">重量: {product.netWeight}g</div>
              <div className="product-pesticideRecord">農藥紀錄: {product.pesticideRecord}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="add-product">
        <h3>新增產品</h3>
        <input 
          type="text" 
          name="name" 
          value={newProduct.name} 
          onChange={handleInputChange} 
          placeholder="產品名稱"
        />
        <input 
          type="number" 
          name="price" 
          value={newProduct.price} 
          onChange={handleInputChange} 
          placeholder="價格"
        />
        <input 
          type="text" 
          name="farmPlace" 
          value={newProduct.farmPlace} 
          onChange={handleInputChange} 
          placeholder="產地"
        />
        <input 
          type="number" 
          name="netWeight" 
          value={newProduct.netWeight} 
          onChange={handleInputChange} 
          placeholder="重量(g)"
        />
        <input 
          type="text" 
          name="pesticideRecord" 
          value={newProduct.pesticideRecord} 
          onChange={handleInputChange} 
          placeholder="農藥紀錄"
        />
        <button onClick={handleAddProduct}>新增</button>
      </div>
    </section>
  );
};

export default Producer;
