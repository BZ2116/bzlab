import React from 'react';
import Carousel from './Carousel';
import '../styles/style.css';

const About = () => {
    return (
        <section id="about" className="intro-section">
            <div className="intro-container">
                <Carousel />
                <div className="info-panel">
                    <h1 className="chinese-name">
                        赵耀 <span className="accent">/ Bruce Zhao</span>
                    </h1>
                    <h3 className="hometown">四川省成都市</h3>
                    <p className="school">重庆邮电大学 · 软件工程学院（2022-2026）</p>
                    <div className="contact-info">
                        <p><strong>邮箱</strong> bzy1621@outlook.com</p>
                        <p><strong>电话</strong> (+86) 13548240116</p>
                    </div>
                </div>
            </div>

            <div className="bio">
                <h3>个人介绍</h3>
                <p>我是重庆邮电大学软件工程学院<strong>英语+软件特色班</strong>的本科生。</p>
                <p>专注于计算机科学和技术的研究。研究方向涵盖<strong>人工智能</strong>和<strong>机器学习</strong>，尤其对图像处理和计算机视觉有深入了解。我热爱学习新技术并参与各种项目研究。</p>
                <p>如果你对我的工作感兴趣，或者想与我合作，请随时联系我。谢谢你的关注！</p>
            </div>
        </section>
    );
};

export default About;
