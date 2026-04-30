import React from 'react';

const Competitions = () => {
    return (
        <section id="competitions">
            <div className="section-header">
                <span className="section-number">03</span>
                <h2>学科竞赛</h2>
            </div>
            <div className="competitions-section">
                <div className="competitions-list">
                    <div className="competition-item">
                        <span className="comp-rank">Top 5%</span>
                        <div className="comp-info">
                            <h3>全国大学生数学建模竞赛</h3>
                            <span className="comp-type">省一等奖</span>
                        </div>
                    </div>
                    <div className="competition-item">
                        <span className="comp-rank">Top 10%</span>
                        <div className="comp-info">
                            <h3>ACM-ICPC 程序设计竞赛</h3>
                            <span className="comp-type">区域赛铜奖</span>
                        </div>
                    </div>
                    <div className="competition-item">
                        <span className="comp-rank">Top 15%</span>
                        <div className="comp-info">
                            <h3>全国大学生网络安全竞赛</h3>
                            <span className="comp-type">决赛入围</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Competitions;
