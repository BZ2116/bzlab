import React, { useEffect, useState, useRef, memo } from 'react';

import BZ1 from '../img/BZ/BZ11.jpg';
import BZ2 from '../img/BZ/BZ2.jpg';

const images = [BZ1, BZ2];

const Carousel = memo(() => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loadedImages, setLoadedImages] = useState(new Array(images.length).fill(false));
    const carouselRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const currentCarousel = carouselRef.current;
        if (!currentCarousel) {
            return undefined;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Number(entry.target.dataset.index);
                    setLoadedImages((prev) => {
                        const newLoadedImages = [...prev];
                        newLoadedImages[index] = true;
                        return newLoadedImages;
                    });
                    observer.unobserve(entry.target);
                }
            });
        });

        const imagesToLoad = currentCarousel.querySelectorAll('.carousel-img');

        imagesToLoad.forEach((img, index) => {
            img.dataset.index = index;
            observer.observe(img);
        });

        return () => {
            imagesToLoad.forEach((img) => {
                observer.unobserve(img);
            });
        };
    }, []);

    return (
        <div className="carousel" ref={carouselRef}>
            {images.map((img, index) => (
                <img
                    key={index}
                    src={loadedImages[index] ? img : undefined}
                    alt={`Bruce Zhao ${index + 1}`}
                    className="carousel-img"
                    style={{ display: currentIndex === index ? 'block' : 'none' }}
                />
            ))}
        </div>
    );
});

export default Carousel;
