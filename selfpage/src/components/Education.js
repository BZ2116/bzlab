import React from 'react';

const Education = () => {
    return (
        <section id="education">
            <div className="section-header">
                <span className="section-number">01</span>
                <h2>学习经历</h2>
            </div>
            <div className="education-section">
                <div className="education-card">
                    <span className="edu-year">2022 - 2026</span>
                    <div className="edu-content">
                        <h3>重庆邮电大学 · 软件工程学院</h3>
                        <p className="subtitle">英语+软件特色班 · GPA: 3.5/4</p>
                        <p>
                            主修课程包括数据结构、算法设计、计算机网络、操作系统、
                            数据库系统等核心软件工程课程。同时选修人工智能、机器学习、
                            计算机视觉等前沿技术课程。
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Education;
