import React from 'react';

const Research = () => {
    return (
        <section id="research">
            <div className="section-header">
                <span className="section-number">02</span>
                <h2>科研项目</h2>
            </div>
            <div className="research-section">
                <div className="research-grid">
                    <div className="research-card">
                        <h3>AI图像处理研究</h3>
                        <p>
                            基于深度学习的图像去雾与增强算法研究，
                            使用GAN网络实现雾天图像的实时清晰化处理。
                        </p>
                        <div className="research-tags">
                            <span className="research-tag">Computer Vision</span>
                            <span className="research-tag">Deep Learning</span>
                            <span className="research-tag">GAN</span>
                        </div>
                    </div>
                    <div className="research-card">
                        <h3>网络安全工具开发</h3>
                        <p>
                            参与CTF竞赛相关工具的开发与优化，
                            研究漏洞检测与渗透测试的自动化方法。
                        </p>
                        <div className="research-tags">
                            <span className="research-tag">Cybersecurity</span>
                            <span className="research-tag">CTF</span>
                            <span className="research-tag">Python</span>
                        </div>
                    </div>
                    <div className="research-card">
                        <h3>机器学习应用</h3>
                        <p>
                            探索机器学习算法在网络安全领域的应用，
                            包括异常检测、入侵识别等场景的模型构建。
                        </p>
                        <div className="research-tags">
                            <span className="research-tag">ML</span>
                            <span className="research-tag">Anomaly Detection</span>
                            <span className="research-tag">TensorFlow</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Research;
