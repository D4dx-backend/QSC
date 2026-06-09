import React, { useState, useEffect } from "react";

const AutoCarousel = ({ interval = 3000, Data }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev === Data.length - 1 ? 0 : prev + 1));
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isPaused, interval, Data.length]);

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-bg-gray rounded-2xl p-8">
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-text-main">Countless Events, One AI-Powered Platform</h2>
        </div>
        <button className="text-sm font-bold text-primary-base hover:text-primary-dark">Book Demo?</button>
      </div>

      {/* Carousel container */}
      <div className="relative h-[530px] overflow-hidden rounded-lg" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
        {Data.map((slide, index) => (
          <div
            key={index}
            className="absolute flex flex-col justify-center items-center w-full h-full transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${100 * (index - currentSlide)}%)`,
            }}
          >
            {/* Video */}
            <video className="w-[80%] rounded-lg mb-6" src={slide.img} autoPlay muted playsInline controlsList="nodownload" poster="https://eventhex.ai/wp-content/uploads/2024/09/Image-27-09-24-at-4.32 AM-scaled.jpeg" />

            {/* Content */}
            <div className="w-full text-center space-y-2">
              <h3 className="text-xl font-semibold text-text-main">{slide.Content}</h3>
              <p className="text-text-sub text-sm max-w-lg mx-auto">{slide.Subcontent}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex items-center justify-center gap-2 mt-6">
        {Data.map((_, index) => (
          <button key={index} onClick={() => setCurrentSlide(index)} className={`transition-all duration-300 rounded-full ${index === currentSlide ? "w-6 h-2 bg-primary-base" : "w-2 h-2 bg-stroke-soft hover:bg-stroke-sub"}`} aria-label={`Go to slide ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default AutoCarousel;
