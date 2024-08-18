import React, { useState } from 'react';
import axios from 'axios';
import './css/Fertilizer.css';  // Import the CSS file

const Fertilizer: React.FC = () => {
  const [param1, setParam1] = useState<string>('空心菜'); // Default to '空心菜'
  const [param2, setParam2] = useState<number | ''>('');
  const [param3, setParam3] = useState<number | ''>('');
  const [plotUrl, setPlotUrl] = useState<string | null>(null); // State for the plot image

  const handleCalculate = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/auth/calculate', { values: [param1, param2, param3] });
      if (response.data.result) {
        setPlotUrl(response.data.result);
      }
      console.log("Result:", response.data.result);
      console.log("Plot url:", plotUrl);
    } catch (error) {
      console.error('Error calculating:', error);
    }
  };

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

  return (
    <section className="fertilizer-container">
      <h2>肥料與資源</h2>
      <p>輸入以下參數，以比較「原始農法」及「固碳農法」的成本效益。</p>
      <p>Quick Reminder: 訂購橄欖石，還沒做</p>

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
          Fertilizer amount (g): 
          <input
            type="number"
            value={param2}
            onChange={(e) => setParam2(Number(e.target.value) || '')}
          />
        </label>
      </div>

      <div className="input-group">
        <label>
          Olivine amount (g): 
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
    </section>
  );
}

export default Fertilizer;
