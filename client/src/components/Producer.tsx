import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSeller } from './pages/UserContext';
import './css/Producer.css';
import { Pencil, Delete } from 'lucide-react';

const Producer: React.FC = () => {
  const { seller } = useSeller();
  const navigate = useNavigate();
  console.log("Seller info:", seller);
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
    imageBase64?: string,
    timestamp: string
  }[]>([]);
  
  const [newProduct, setNewProduct] = useState<{
    name: string,
    price: number,
    quantity: number,
    farmPlace: string,
    netWeight: number,
    pesticideRecord: string,
    imageBase64: string,
    timestamp: string
  }>({
    name: '', price: 0, quantity: 0, farmPlace: '', netWeight: 0, pesticideRecord: '', imageBase64: '', timestamp: ''
  });
  
  const [editProduct, setEditProduct] = useState<{
    name: string,
    price: number,
    quantity: number,
    farmPlace: string,
    netWeight: number,
    pesticideRecord: string,
    imageBase64: string,
    productId?: string,
    timestamp: string
  } | null>(null);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const MAX_BASE64_SIZE = 50 * 1024 * 1024; // 50 MB

  useEffect(() => {
    if (!seller) {
      // Redirect to login page if seller is not logged in
      navigate('/login');
    } else {
      // Fetch products if the seller is logged in
      axios.get(`http://localhost:8000/api/auth/products/get_all`, {params: {username: seller.username}})
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the products!', error);
        });
    }
  }, [seller, navigate]);  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await convertToBase64(file);
      console.log("BASE64 Length:", base64.length);
      if (base64.length > MAX_BASE64_SIZE) {
        setErrorMessage('The Base64 encoded image exceeds the 50MB limit. Please choose a smaller file.');
        return;
      }
      setNewProduct({ ...newProduct, imageBase64: base64 });
      setErrorMessage(null); // Clear error message if file is valid
    }
  };
  
  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editProduct && e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const base64 = await convertToBase64(file);
      console.log("BASE64 Length:", base64.length);
      if (base64.length > MAX_BASE64_SIZE) {
        setErrorMessage('The Base64 encoded image exceeds the 50MB limit. Please choose a smaller file.');
        return;
      }
      setEditProduct({ ...editProduct, imageBase64: base64 });
      setErrorMessage(null); // Clear error message if file is valid
    }
  };
  

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editProduct) {
      const { name, value } = e.target;
      setEditProduct({ ...editProduct, [name]: value });
    }
  };


  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleAddProduct = () => {
    if (seller) {
      const productData = {
        ...newProduct,
        lineUserId: seller.username, //user.lineUserId,
        lineUserName: seller.name, //user.displayName,
        timestamp: new Date().toISOString()
      };
      axios.post('http://localhost:8000/api/auth/products', productData)
        .then(response => {
          setProducts([...products, response.data]);
          setNewProduct({ name: '', price: 0, quantity: 0, farmPlace: '', netWeight: 0, pesticideRecord: '', imageBase64: '', timestamp: '' });
        })
        .catch(error => {
          console.error('There was an error adding the product!', error);
        });
    }
  };
  

  const handleEditProduct = () => {
    if (editProduct) {
      axios.put(`http://localhost:8000/api/auth/products/${editProduct.productId}`, editProduct)
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
      {seller && (
        <>
          <h2>賣家中心</h2>
          <h3>{seller?.name} 的產品</h3>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
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
                  {product.imageBase64 && <img src={product.imageBase64} alt={product.name} className="product-image" />}
                  <div className="product-timestamp">上架時間: {new Date(product.timestamp).toLocaleString()}</div>
                  <div className="button-group">
                    <button onClick={() => { setEditProduct({
                        ...product,
                        imageBase64: product.imageBase64 || '' // Ensure imageBase64 is a string
                      });
                      setShowEditModal(true);
                    }}><Pencil /></button>
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
                  name="imageBase64" 
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
        </>
      )}
    </section>
  );
  };
  
  export default Producer;
  
