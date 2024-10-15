import React, { useState } from 'react';
import axios from 'axios';
import './css/Fertilizer.css';  // Import the CSS file

const Fertilizer: React.FC = () => {
  const [param1, setParam1] = useState<string>('空心菜'); // Default to '空心菜'
  const [param2, setParam2] = useState<number | ''>('');
  const [param3, setParam3] = useState<number | ''>('');
  const [plotUrl, setPlotUrl] = useState<string | null>(null); // State for the plot image
  const [orderQuantity, setOrderQuantity] = useState<number | ''>(''); // Order quantity
  const [orderMessage, setOrderMessage] = useState<string | null>(null); // Order confirmation message

  // Handle the calculation request
  const handleCalculate = async () => {
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
    if (orderQuantity && orderQuantity > 0) {
      try {
        // Simulate order placement (Replace this with your order API request if needed)
        setOrderMessage(`You have successfully ordered ${orderQuantity} package(s) of fertilizer.`);
      } catch (error) {
        console.error('Error placing order:', error);
      }
    } else {
      setOrderMessage('Please enter a valid quantity.');
    }
  };

  return (
    <section className="fertilizer-container">
      <h2>肥料與資源</h2>
      <h3>「科技耕種，橄石作力—減碳滿分，收成翻倍」</h3>
      <p>突出科技在農業中的應用，以及橄欖石肥料如何科學地提升土壤質量，同時達到減碳和增產的目標。</p>
      <p>輸入以下參數，以比較「原始農法」及「固碳農法」的成本效益。</p>

      <div className="input-group">
        <label>
          農作物： 
          <select value={param1} onChange={(e) => setParam1(e.target.value)}>
            <option value="空心菜">空心菜</option>
            <option value="高麗菜">高麗菜</option>
            <option value="花椰菜">花椰菜</option>
          </select>
        </label>
      </div>

      <div className="input-group">
        <label>
          Fertilizer amount (g)：
          <input
            type="number"
            value={param2}
            onChange={(e) => setParam2(Number(e.target.value) || '')}
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          Olivine amount (g)：
          <input
            type="number"
            value={param3}
            onChange={(e) => setParam3(Number(e.target.value) || '')}
          />
        </label>
      </div>

      <button className="calculate-button" onClick={handleCalculate}>Calculate</button>
      
      {plotUrl && (
        <div className="plot-container">
          <img src={`data:image/png;base64,${plotUrl}`} alt="Generated Plot" />
          <button className="download-button" onClick={handleDownload}>Download Figure</button>
        </div>
      )}

      {/* Fertilizer Information */}
      <section className="fertilizer-info">
        <h3>肥料資訊</h3>
        <p>產品名稱：減碳肥料包</p>
        <p>價格與包裝：每包售價 400 新台幣，重量為 10 公斤。</p>
        <p>內容物：全氮 (N)、水溶性磷酐 (P₂O₅)、水溶性氧化鉀 (K₂O)、橄欖石（Mg₂SiO₄）。</p>
        <p>提升土壤 pH 值：在酸性土壤中 pH 值可從 4.1 提升至 4.6。</p>
        <p>促進植物生長：植物生長量可增加至最多 217.4%。</p>
        <p>二氧化碳吸收量：每公頃可吸收 1973.4 公斤的二氧化碳。</p>
      </section>

      {/* Order Section */}
      <section className="order-section">
        <h3>訂購肥料</h3>
        <label>
          訂購數量 (包)： 
          <input
            type="number"
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(Number(e.target.value) || '')}
          />
        </label>
        <button className="order-button" onClick={handleOrder}>立即訂購</button>
        {orderMessage && <p className="order-message">{orderMessage}</p>}
      </section>
      {/* Section for additional information */}
      <div className="other-info">
        {/* <h3>其他資訊</h3> */}
        <p>
          For more details, please visit the{' '}
          <a
            href="https://www.remineralize.org/2023/01/crash-course-on-enhanced-rock-weathering-for-carbon-removal/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Crash Course on Enhanced Rock Weathering for Carbon Removal
          </a>.
        </p>
      </div>
    </section>
  );
}

export default Fertilizer;
