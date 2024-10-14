import React from 'react';
import './css/Plan.css'; // Import your CSS file

const Plan: React.FC = () => {
  return (
    <section className="plan">
      {/* Section title */}
      <h2>碳固定計畫</h2>
      <h3>固碳農法: ⽣態農業新紀元</h3>

      {/* Container for the PDF viewer */}
      <div className="pdf-container">
        {/* Embedding Google Drive PDF viewer using iframe */}
        <iframe
          title="Google Drive PDF Viewer"
          src="https://drive.google.com/file/d/1YN9hT-Y6q8d001QIrDTkPY7YHDPY4wNU/preview"
          width="100%"
          height="780"
          allow="autoplay"
          style={{ border: 'none' }}
        ></iframe>
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
