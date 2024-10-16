import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './css/Fertilizer.css';  // Import the CSS file
import { useSeller } from './pages/UserContext';

const Fertilizer: React.FC = () => {
  const { seller } = useSeller();
  const [param1, setParam1] = useState<string>('空心菜'); // Default to '空心菜'
  const [param2, setParam2] = useState<number | ''>('');  // Fertilizer amount
  const [param3, setParam3] = useState<number | ''>('');  // Olivine amount
  const [param4, setParam4] = useState<number | ''>('');  // Fertilizer order quantity
  const [param5, setParam5] = useState<number | ''>('');  // Olivine order quantity
  const [plotUrl, setPlotUrl] = useState<string | null>(null);  // State for the plot image
  const [orderMessage, setOrderMessage] = useState<string | null>(null);  // Order confirmation message
  const [totalAmount, setTotalAmount] = useState<number>(0);  // Total amount of the order
  const [orderHistory, setOrderHistory] = useState<any[]>([]);  // State for storing order history

  // Handle the calculation request
  const handleCalculate = async () => {
    if (!param2 || !param3) {
      alert('請輸入基礎肥料重量和橄欖石重量！'); // Add this in the handleCalculate function to check param2 and param3
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/calculate`, { values: [param1, param2, param3] });
      if (response.data.result) {
        setPlotUrl(response.data.result);
      }
      console.log("Result:", response.data.result);
      console.log("Plot url:", plotUrl);
    } catch (error) {
      console.error('Error calculating:', error);
    }
  };

  // Handle calculating total amount
  useEffect(() => {
    const calculatedAmount = (param4 || 0) * 333 + (param5 || 0) * 7;
    setTotalAmount(calculatedAmount);
  }, [param4, param5]);

  // Handle downloading the plot
  const handleDownload = () => {
    if (plotUrl) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${plotUrl}`;
      link.download = 'generated_plot.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle placing an order for fertilizer
  const handleOrder = async () => {
    if (param4 && param5 && totalAmount > 0 && seller) {
      const fertilizerData = {
        username: seller.username,
        order_time: new Date().toISOString(),
        fertilizer_amount: param4,
        olivine_amount: param5,
        total_amount: totalAmount,
      };
      try {
        await axios.post(`${process.env.REACT_APP_SERVER_URL}/api/auth/fertilizer`, fertilizerData);
        setOrderMessage(`You have successfully ordered ${param4} fertilizer package(s) and ${param5} olivine package(s). Total cost is ${totalAmount} NTD.`);
        
        // Fetch order history after placing the order
        fetchOrderHistory();
      } catch (error) {
        console.error('Error placing order:', error);
      }
    } else {
      setOrderMessage('Please fill in all required fields and enter valid quantities.');
    }
  };

  // Fetch order history from the backend
  // Memoize the fetchOrderHistory function using useCallback
  const fetchOrderHistory = useCallback(async () => {
    if (seller) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/fertilizer/${seller.username}`);
        setOrderHistory(response.data);
      } catch (error) {
        console.error('Error fetching order history:', error);
      }
    }
  }, [seller]);  // Add seller as a dependency


  // Fetch order history on page load if seller is logged in
  useEffect(() => {
    if (seller) {
      fetchOrderHistory();
    }
  }, [seller, fetchOrderHistory]);  // Add fetchOrderHistory to the dependency array
  

  if (!seller) {
    return (
      <section className="fertilizer-container">
        <h2>請先註冊賣家會員</h2>
      </section>
    );
  };

  return (
    <section className="fertilizer-container">
      <h2>肥料與資源</h2>
        <h3>「科技耕種，橄石作力—減碳滿分，收成翻倍」</h3>
      <p>應用科學與科技於吸收大氣中的溫室氣體，同時改善土壤品質與提升作物產量。</p>
      <p className='highlighted'>數學公式：淨效益 = 農產品價格 + 碳權價格 - 總成本。</p>
      <p>輸入以下參數，比較「原始農法」及「固碳農法」的成本效益，下訂前調配比例以查看淨收益。</p>
      <p>P.S.肥料和橄欖石的用量以「公斤」為單位，適用於「每公頃」的農田，每包為10公斤。</p>
      <p>範例輸入：農作物：空心菜，基礎肥料重量：1800公斤，橄欖石重量：5000公斤。</p>

      <section className="fertilizer-inputs">
        <div className="input-group">
          <label className="label">農作物：</label>
          <select className="value" value={param1} onChange={(e) => setParam1(e.target.value)}>
            <option value="空心菜">空心菜</option>
            <option value="高麗菜">高麗菜</option>
            <option value="花椰菜">花椰菜</option>
          </select>
        </div>

        <div className="input-group">
          <label className="label">基礎肥料重量（公斤）：</label>
          <input
            className="value"
            type="number"
            value={param2}
            onChange={(e) => setParam2(Number(e.target.value) || '')}
          />
        </div>

        <div className="input-group">
          <label className="label">橄欖石重量（公斤）：</label>
          <input
            className="value"
            type="number"
            value={param3}
            onChange={(e) => setParam3(Number(e.target.value) || '')}
          />
        </div>

        <div className="input-group">
          <label className="label">基礎肥料訂購包數（每包10公斤，333元）：</label>
          <input
            className="value"
            type="number"
            value={param4}
            onChange={(e) => setParam4(Number(e.target.value) || '')}
          />
        </div>

        <div className="input-group">
          <label className="label">橄欖石訂購包數（每包10公斤，7元）：</label>
          <input
            className="value"
            type="number"
            value={param5}
            onChange={(e) => setParam5(Number(e.target.value) || '')}
          />
        </div>

        <div className="input-group">
          <label className="label">訂購總額：</label>
          <span className="value">{totalAmount} 元</span>
        </div>

        <button className="calculate-button" onClick={handleCalculate}>模擬數值並作圖</button>
        <button className="calculate-button" onClick={handleOrder}>立即訂購</button>
        {orderMessage && <p className="order-message">{orderMessage}</p>}
      </section>

      {plotUrl && (
        <div className="plot-container">
          <img src={`data:image/png;base64,${plotUrl}`} alt="Generated Plot" />
          <button className="download-button" onClick={handleDownload}>下載成本效益比較圖</button>
        </div>
      )}

      {/* Fertilizer Information */}
      <section className="fertilizer-info">
        <h3>肥料資訊</h3>
        <p><span className="label">產品名稱：</span><span className="value">減碳肥料包</span></p>
        <p><span className="label">重量：</span><span className="value">每包 10 公斤</span></p>
        <p><span className="label">價格：</span><span className="value">每包基礎肥料售價為 333 元，每包橄欖石售價為 7 元</span></p>
        <p><span className="label">內容物：</span><span className="value">基礎肥料、橄欖石（Mg₂SiO₄）</span></p>
        <p><span className="label">基礎肥料：</span><span className="value">全氮 (N)、水溶性磷酐 (P₂O₅)、水溶性氧化鉀 (K₂O)</span></p>
        
        <p><span className="label">提升土壤 pH 值：</span><span className="value">在酸性土壤中 pH 值可從 4.1 提升至 4.6</span></p>
        <p><span className="label">促進植物生長：</span><span className="value">植物生長量可增加至最多 217.4%</span></p>
        <p><span className="label">二氧化碳吸收量：</span><span className="value">每公頃可吸收 1973.4 公斤的二氧化碳</span></p>
      </section>

      {/* Order History Section */}
      <section className="order-history">
        <h3>訂購紀錄</h3>
        {orderHistory.length > 0 ? (
          <table className="order-table">
            <thead>
              <tr>
                <th>訂購時間</th>
                <th>基礎肥料數量</th>
                <th>橄欖石數量</th>
                <th>總金額</th>
                <th>操作</th> {/* Added column for delete button */}
              </tr>
            </thead>
            <tbody>
              {orderHistory.map((order, index) => (
                <tr key={index}>
                  <td>{new Date(order.order_time).toLocaleString()}</td>
                  <td>{order.fertilizer_amount}</td>
                  <td>{order.olivine_amount}</td>
                  <td>{order.total_amount} NTD</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={async () => {
                        const confirmDelete = window.confirm('確定要刪除此訂單嗎？');
                        if (confirmDelete) {
                          try {
                            await axios.delete(`${process.env.REACT_APP_SERVER_URL}/api/auth/fertilizer/delete/${order._id}`);
                            // After deletion, refetch the order history
                            fetchOrderHistory();
                          } catch (error) {
                            console.error('Error deleting the order:', error);
                          }
                        }
                      }}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>尚無訂購紀錄</p>
        )}
      </section>

    </section>
  );
};

export default Fertilizer;
