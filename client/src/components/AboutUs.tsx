import React from 'react';
import './css/AboutUs.css';

const Home: React.FC = () => {
  return (
    <section className="about-us">
      <h2>About Us</h2>
      <p>
        本提案藉由「碳索者農業網」及「智慧碳勘者」聊天機器人平台，提供農業從業者即時天氣預報、成本效益分析等關鍵資訊。此外，會員服務還包括碳農法的廣範指導、農業碳認證代辦以及作物直銷通路支持，這些智慧化解決方案旨在提升技術的可及性和使用便利性，推動農業產業朝向更永續的方向發展。
      </p>
      {/* <img src="path_to_image" alt="Carbon-Neutral Agricultural Ecosystem" /> */}
      <p>
        碳淨零農業生態圈整合固碳農法與創新科技，致力於達成聯合國的永續發展目標（SDGs），尤其強調永續城鄉建設、氣候行動，以及保護陸地生態系。
      </p>
    </section>
  );
}

export default Home;