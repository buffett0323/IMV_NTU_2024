import React from 'react';
import './css/AboutUs.css';
import Veg_pic from './img/gen_veg.png';
import Econ_pic from './img/gen_econ.png';
import Fresh_pic from './img/gen_fresh.png';

const Home: React.FC = () => {
  return (
    <section className="about-us">
      {/* <h2>About Us</h2> */}
      <div className="content-container">
        <div className="text-image-pair">
          <div className="text">
            <h3 className="highlight">我們與氣候變遷的距離</h3>
            <p>
              聚焦於「千分之四倡議」與「2050淨零碳排目標」，碳索者團隊著眼於借助科學技術與資訊科技，重新定義農業部門中既定的消費與生產關係，並提出在氣候變遷時代下的新世紀農業景象，自始，不論是農友或是市民朋友皆能在淨零生態圈的循環中協助農業部門邁向淨零目標。
            </p>
          </div>
          <div className="image">
            <img src={Veg_pic} alt="Description 1" />
          </div>
        </div>
        <div className="text-image-pair">
          <div className="image">
            <img src={Econ_pic} alt="Description 2" />
          </div>
          <div className="text">
            <h3 className="highlight">農田裡的隱形經濟</h3>
            <p>
              奠基於科學實驗與知識，碳索者團隊推出兼具商業價值與固碳功效的「固碳農法」，搭配各式輔助工具，農田不僅只是種植作物，更可吸收、儲存大氣中的溫室氣體，在經過碳盤查之後，可透過碳交易市場獲得經濟收益，採行「固碳農法」的農田不只能改善種植環境，還很吸金。
            </p>
          </div>
        </div>
        <div className="text-image-pair">
          <div className="text">
            <h3 className="highlight">不只是餐桌上的新鮮蔬菜</h3>
            <p>
              一站式的採買網頁，不只貼合繁忙的都會節奏，更能令關注環境議題的你在享受實惠且本地產製的新鮮蔬菜之餘，為生活環境盡一份心力，對抗氣候變遷不再是宣傳口號，固碳成效可以看的見也經得起考驗。
            </p>
          </div>
          <div className="image">
            <img src={Fresh_pic} alt="Description 3" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
