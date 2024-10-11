
import React, { useEffect, useState, useRef,memo }from 'react';

import BZ1 from '../img/BZ/BZ11.jpg';
import BZ2 from '../img/BZ/BZ2.jpg';
import BZ3 from '../img/BZ/BZ3.jpg';

const images = [BZ1, BZ2];

const Carousel = memo(() => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState(new Array(images.length).fill(false));
    const carouselRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000); // 每10秒切换一次图片
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.dataset.index);
                    setLoadedImages((prev) => {
                        const newLoadedImages = [...prev];
                        newLoadedImages[index] = true; // 标记图片已加载
                        return newLoadedImages;
                    });
                    observer.unobserve(entry.target); // 停止观察
                }
            });
        });

        const imagesToLoad = carouselRef.current.querySelectorAll('.carousel-img');

        imagesToLoad.forEach((img, index) => {
            img.dataset.index = index; // 给每个图片添加索引
            observer.observe(img); // 开始观察
        });

        return () => {
            imagesToLoad.forEach((img) => {
                observer.unobserve(img); // 清除观察
            });
        };
    }, []);

    return (
        <div className="carousel" ref={carouselRef}>
            {images.map((img, index) => (
                <img
                    key={index}
                    src={loadedImages[index] ? img : undefined} // 懒加载
                    alt={`Image ${index + 1}`}
                    className="carousel-img"
                    style={{ display: currentIndex === index ? 'block' : 'none' }} // 仅显示当前图片
                />
            ))}
        </div>
    );
});

export default Carousel;
