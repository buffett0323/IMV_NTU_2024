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
  
  const [orders, setOrders] = useState<{
    orderId: string,
    buyerId: string,
    buyerName: string,
    buyerContact: string,
    productId: string,
    productName: string,
    productPrice: number,
    productOwnerID: string,
    quantity: number,
    totalAmount: number,
    orderDate: Date
  }[]>([]); // State to store orders

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
  const [showAddProductModal, setShowAddProductModal] = useState(false); // State to control modal visibility
  const MAX_BASE64_SIZE = 50 * 1024 * 1024; // 50 MB

  useEffect(() => {
    if (!seller) {
      // Redirect to login page if seller is not logged in
      navigate('/login');
    } else {
      // Fetch products if the seller is logged in
      axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/products/get_all`, {params: {username: seller.username}})
        .then(response => {
          setProducts(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the products!', error);
        });
      
      // Fetch orders associated with the seller
      axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/orders/get_all`, {params: {username: seller.username}})
        .then(response => {
          setOrders(response.data);
        })
        .catch(error => {
          console.error('There was an error fetching the orders!', error);
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
      axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/products`, productData)
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
      axios.put(`${process.env.REACT_APP_SERVER_URL}/api/auth/products/${editProduct.productId}`, editProduct)
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
      axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/auth/products/${deleteProductId}`)
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
          <h1>賣家中心</h1> 
          <h2>Welcome - {seller?.name}</h2>
          <h3>{seller?.name} 的產品</h3>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <div className="product-list">
            <div className="product-grid">
              {products.map((product) => (
                <div className="product-card" key={product.productId}>
                  <div className="product-image">
                    {product.imageBase64 && <img src={product.imageBase64} alt={product.name} className="product-image" />}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <div className="info-columns">
                      <div className="column">
                        <p><span className="label">單價:</span><span className="value">${product.price}</span></p>
                        <p><span className="label">數量:</span><span className="value">{product.quantity} 個</span></p>
                        <p><span className="label">產地:</span><span className="value">{product.farmPlace}</span></p>
                      </div>
                      <div className="column">
                        <p><span className="label">重量:</span><span className="value">{product.netWeight}g</span></p>
                        <p><span className="label">農藥紀錄:</span><span className="value">{product.pesticideRecord}</span></p>
                        <p><span className="label">上架時間:</span><span className="value">{new Date(product.timestamp).toLocaleString()}</span></p>
                      </div>
                    </div>

                    <div className="button-group">
                      <button onClick={() => { setEditProduct({
                          ...product,
                          imageBase64: product.imageBase64 || ''
                        });
                        setShowEditModal(true);
                      }}><Pencil /></button>
                      <button onClick={() => product.productId && setDeleteProductId(product.productId)}><Delete /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Button to open the modal */}
          <button onClick={() => setShowAddProductModal(true)} className="open-modal-button">
            新增產品
          </button>

          {/* Modal for adding a product */}
          {showAddProductModal && (
            <div className="modal">
              <div className="modal-content">
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
                <div className="modal-buttons">
                  <button onClick={handleAddProduct}>新增</button>
                  <button onClick={() => setShowAddProductModal(false)}>取消</button>
                </div>
              </div>
            </div>
          )}
          {/* <div className="add-product">
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
          </div> */}

          {/* Order Section */}
          <div className="order-list">
          <h3>{seller?.name} 的客人訂單</h3>
            {orders.length > 0 ? (
              <table className="order-sheet">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>數量</th>
                    <th>總金額</th>
                    <th>購買者</th>
                    <th>聯絡方式</th>
                    <th>下訂日期</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.orderId}>
                      <td>{order.productName}</td>
                      <td>{order.quantity}</td>
                      <td>${order.totalAmount}</td>
                      <td>{order.buyerName}</td>
                      <td>{order.buyerContact}</td>
                      <td>{new Date(order.orderDate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>目前沒有訂單。</p>
            )}
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
                <button onClick={handleEditProduct}>確認修改</button>
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
  
