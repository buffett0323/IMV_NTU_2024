import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from './pages/UserContext';
import './css/Producer.css';
import { Pencil, Delete } from 'lucide-react';

const Producer: React.FC = () => {
  const { user } = useUser();
  const [products, setProducts] = useState<{
    name: string,
    price: number,
    quantity: number,
    lineUserName: string,
    lineUserId: string,
    farmPlace: string,
    netWeight: number,
    pesticideRecord: string,
    productId?: string,
    imageUrl?: string,
    timestamp: string
  }[]>([]);
  
  const [newProduct, setNewProduct] = useState<{
    name: string,
    price: number,
    quantity: number,
    farmPlace: string,
    netWeight: number,
    pesticideRecord: string,
    imageFile?: File,
    timestamp: string
  }>({ name: '', price: 0, quantity: 0, farmPlace: '', netWeight: 0, pesticideRecord: '', timestamp: '' });
  
  const [editProduct, setEditProduct] = useState<{
    name: string,
    price: number,
    quantity: number,
    farmPlace: string,
    netWeight: number,
    pesticideRecord: string,
    imageFile?: File,
    productId?: string,
    timestamp: string
  } | null>(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProduct({ ...newProduct, imageFile: e.target.files[0] });
    }
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editProduct) {
      const { name, value } = e.target;
      setEditProduct({ ...editProduct, [name]: value });
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editProduct && e.target.files && e.target.files[0]) {
      setEditProduct({ ...editProduct, imageFile: e.target.files[0] });
    }
  };

  const handleAddProduct = () => {
    if (user && newProduct.imageFile) {
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', newProduct.price.toString());
      formData.append('quantity', newProduct.quantity.toString());
      formData.append('farmPlace', newProduct.farmPlace);
      formData.append('netWeight', newProduct.netWeight.toString());
      formData.append('pesticideRecord', newProduct.pesticideRecord);
      formData.append('lineUserId', user.lineUserId);
      formData.append('lineUserName', user.displayName);
      formData.append('timestamp', new Date().toISOString());
      formData.append('imageFile', newProduct.imageFile);
  
      axios.post('http://localhost:8000/api/auth/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        setProducts([...products, response.data]);
        setNewProduct({ name: '', price: 0, quantity: 0, farmPlace: '', netWeight: 0, pesticideRecord: '', timestamp: '' });
      })
      .catch(error => {
        console.error('There was an error adding the product!', error);
      });
    }
  };
  

  const handleEditProduct = () => {
    if (editProduct) {
      const formData = new FormData();
      formData.append('name', editProduct.name);
      formData.append('price', editProduct.price.toString());
      formData.append('quantity', editProduct.quantity.toString());
      formData.append('farmPlace', editProduct.farmPlace);
      formData.append('netWeight', editProduct.netWeight.toString());
      formData.append('pesticideRecord', editProduct.pesticideRecord);
      if (editProduct.imageFile) {
        formData.append('imageFile', editProduct.imageFile);
      }

      axios.put(`http://localhost:8000/api/auth/products/${editProduct.productId}`, formData)
        .then(response => {
          setProducts(products.map(p => (p.productId === editProduct.productId ? response.data : p)));
          setShowEditModal(false);
          setEditProduct(null);
        })
        .catch(error => {
          console.error('There was an error editing the product!', error);
        });
    }
  };

  const handleDeleteProduct = () => {
    if (deleteProductId) {
      axios.delete(`http://localhost:8000/api/auth/products/${deleteProductId}`)
        .then(() => {
          setProducts(products.filter(p => p.productId !== deleteProductId));
          setDeleteProductId(null);
        })
        .catch(error => {
          console.error('There was an error deleting the product!', error);
        });
    }
  };

  return (
    <section className="market">
      <h2>賣家中心</h2>
      <h3>{user?.displayName} 的產品</h3>
      <div className="product-list">
        <div className="product-grid">
          {products.map((product) => (
            <div className="product-box" key={product.productId}>
              <div className="product-name">{product.name}</div>
              <div className="product-price">單價: ${product.price}</div>
              <div className="product-quantity">數量: {product.quantity}個</div>
              <div className="product-farmPlace">產地: {product.farmPlace}</div>
              <div className="product-netWeight">重量: {product.netWeight}g</div>
              <div className="product-pesticideRecord">農藥紀錄: {product.pesticideRecord}</div>
              {/* {product.imageUrl && <img src={product.imageUrl} alt={product.name} />} */}
              {product.imageUrl && (
                <img src={product.imageUrl} alt={product.name} className="product-image" 
                onError={(e) => console.log('Image failed to load:', product.imageUrl, "Current:", window.location.pathname)}/>
              )}
              <div className="product-timestamp">上架時間: {new Date(product.timestamp).toLocaleString()}</div>
              <div className="button-group">
                <button onClick={() => { setEditProduct(product); setShowEditModal(true); }}><Pencil /></button>
                <button onClick={() => product.productId && setDeleteProductId(product.productId)}><Delete /></button>
              </div>
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
          placeholder="單價"
        />
        <input 
          type="number" 
          name="quantity" 
          value={newProduct.quantity} 
          onChange={handleInputChange} 
          placeholder="數量"
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
        <input 
          type="file" 
          name="imageFile" 
          onChange={handleFileChange} 
          placeholder="產品圖片"
        />
        <button onClick={handleAddProduct}>新增</button>
      </div>

      {showEditModal && editProduct && (
        <div className="modal">
          <div className="modal-content">
            <h3>編輯產品</h3>
            <input 
              type="text" 
              name="name" 
              value={editProduct.name} 
              onChange={handleEditInputChange} 
              placeholder="產品名稱"
            />
            <input 
              type="number" 
              name="price" 
              value={editProduct.price} 
              onChange={handleEditInputChange} 
              placeholder="單價"
            />
            <input 
              type="number" 
              name="quantity" 
              value={editProduct.quantity} 
              onChange={handleEditInputChange} 
              placeholder="數量"
            />
            <input 
              type="text" 
              name="farmPlace" 
              value={editProduct.farmPlace} 
              onChange={handleEditInputChange} 
              placeholder="產地"
            />
            <input 
              type="number" 
              name="netWeight" 
              value={editProduct.netWeight} 
              onChange={handleEditInputChange} 
              placeholder="重量(g)"
            />
            <input 
              type="text" 
              name="pesticideRecord" 
              value={editProduct.pesticideRecord} 
              onChange={handleEditInputChange} 
              placeholder="農藥紀錄"
            />
            <input 
              type="file" 
              name="imageFile" 
              onChange={handleEditFileChange} 
            />
            <button onClick={handleEditProduct}>保存</button>
            <button onClick={() => setShowEditModal(false)}>取消</button>
          </div>
        </div>
      )}

      {deleteProductId && (
        <div className="modal">
          <div className="modal-content">
            <h3>確認刪除</h3>
            <p>您確定要刪除此產品嗎？</p>
            <button onClick={handleDeleteProduct}>確認</button>
            <button onClick={() => setDeleteProductId(null)}>取消</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Producer;
