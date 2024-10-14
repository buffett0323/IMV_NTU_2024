import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './css/Plan.css'; // Import your CSS file

const Plan: React.FC = () => {
  // Initialize the default layout plugin for the PDF viewer
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <section className="plan">
      {/* Section title */}
      <h2>碳固定計畫</h2>
      <h3>固碳農法: ⽣態農業新紀元</h3>

      {/* Container for the PDF viewer */}
      <div className="pdf-container">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          {/* Reference the PDF file located in the public directory */}
          <Viewer
            fileUrl="/pdf/imv_propose.pdf"
            plugins={[defaultLayoutPluginInstance]}
          />
        </Worker>
      </div>

      {/* Section for additional information */}
      <div className="other-info">
        <h3>其他資訊</h3>
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
};

export default Plan;
