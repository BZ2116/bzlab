import React, { useState, useEffect } from 'react';
import logo from "../img/BZ_logo.png"

const Navbar = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleMenu = () => {
        setIsActive(!isActive);
    };

    const handleMenuClick = (event) => {
        if (event.target.tagName === 'A') {
            setIsActive(false);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const navbar = document.querySelector('.navbar');
            if (window.pageYOffset > 0) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };

        const handleClickOutside = (event) => {
            const menu = document.querySelector('.nav-menu');
            const menuIcon = document.querySelector('.mobile-menu-icon');
            if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
                setIsActive(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`navbar ${isActive ? 'scrolled' : ''}`}>
            <nav>
                <div className="nav-container">
                <a href="#" className="logo">
                        <img src={logo} alt="Logo" />
                    </a>
                    <div className="mobile-menu-icon" onClick={toggleMenu}>
                        <span>☰</span>
                    </div>
                    <ul className={`nav-menu ${isActive ? 'active' : ''}`} onClick={handleMenuClick}>
                        <li><a href="#about">个人简介</a></li>
                        <li><a href="#education">学习经历</a></li>
                        <li><a href="#research">科研项目</a></li>
                        <li><a href="#competitions">学科竞赛</a></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
