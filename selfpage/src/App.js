import React from 'react';
import './styles/style.css';
import Navbar from './components/Navbar';
import About from './components/About';
import Education from './components/Education';
import Research from './components/Research';
import Competitions from './components/Competitions';

const Gateway = () => {
    const jumpToProfile = () => {
        document.querySelector('#profile')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="gateway" className="gateway">
            <div className="signal-map" aria-hidden="true">
                <span className="signal-node node-a">AI</span>
                <span className="signal-node node-b">CV</span>
                <span className="signal-node node-c">SEC</span>
                <span className="signal-node node-d">CODE</span>
                <span className="signal-node node-e">BZ</span>
            </div>

            <div className="gateway-grid">
                <div className="hero-copy">
                    <p className="eyebrow">Bruce Zhao / BZ2116</p>
                    <h1>把个人主页做成一个可进入的信号站</h1>
                    <p className="hero-lead">
                        这里是一个不太正经的入口：把软件工程、人工智能、计算机视觉和网络安全这些坐标，
                        连成一张关于我的地图。
                    </p>
                    <div className="hero-actions">
                        <button className="primary-action" onClick={jumpToProfile}>进入正常主页</button>
                        <a className="secondary-action" href="mailto:bzy1621@outlook.com">发送邮件</a>
                    </div>
                </div>

                <div className="terminal-panel" aria-label="profile terminal preview">
                    <div className="terminal-topbar">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className="terminal-body">
                        <p><span>$</span> whoami</p>
                        <strong>Bruce Zhao / 赵耀</strong>
                        <p><span>$</span> focus --list</p>
                        <ul>
                            <li>Software Engineering</li>
                            <li>Artificial Intelligence</li>
                            <li>Computer Vision</li>
                            <li>Cybersecurity</li>
                        </ul>
                        <p><span>$</span> open normal-homepage</p>
                        <em>入口已准备好，向下滚动或点击按钮进入。</em>
                    </div>
                </div>
            </div>

            <a className="scroll-cue" href="#profile" aria-label="Scroll to normal homepage">↓</a>
        </section>
    );
};

const App = () => {
    return (
        <div className="app-shell">
            <Navbar />
            <Gateway />
            <main id="profile">
                <About />
                <Education />
                <Research />
                <Competitions />
            </main>
        </div>
    );
};

export default App;
