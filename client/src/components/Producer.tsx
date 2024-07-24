import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './pages/UserContext';

const Producer: React.FC = () => {
  const { user } = useUser();
  const [products, setProducts] = useState<{ name: string, price: number, productId?: string }[]>([]);
  const [newProduct, setNewProduct] = useState<{ name: string, price: number }>({ name: '', price: 0 });

  useEffect(() => {
    if (user) {
      console.log(user.lineUserId);
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
      const productToAdd = { ...newProduct, userId: user.lineUserId };
      axios.post('http://localhost:8000/api/auth/products', productToAdd)
        .then(response => {
          setProducts([...products, response.data]);
          setNewProduct({ name: '', price: 0 });
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
        <ul>
          {products.map((product) => (
            <li key={product.productId}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
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
        <button onClick={handleAddProduct}>新增</button>
      </div>
    </section>
  );
};

export default Producer;
