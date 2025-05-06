import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import testimonials from './testimonials';

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const itemsPerPage = isSmallScreen ? 1 : 3;

  useEffect(() => {
    const checkScreenSize = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const end = currentIndex + itemsPerPage;
    return end > testimonials.length
      ? [...testimonials.slice(currentIndex), ...testimonials.slice(0, end - testimonials.length)]
      : testimonials.slice(currentIndex, end);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 animate-fade-in">
            Đánh Giá Người Dùng
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-[300px] h-1 bg-primary-600 rounded-full" />
          </div>
        </div>

        <div className="relative">
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6
              bg-white/90 hover:bg-primary-600 text-primary-600 hover:text-white p-4 rounded-full 
              shadow-md backdrop-blur-sm transition-transform duration-300 hover:scale-110 z-10
              border border-primary-200 hover:border-primary-400"
            aria-label="Lùi lại"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>

          <div className="overflow-hidden">
            <div className="flex gap-8 transition-transform duration-500 ease-out justify-center ">
              {getVisibleTestimonials().map((t, index) => (
                <div key={index} className="flex-shrink-0 w-full md:w-[360px] h-[300px] flex items-center">
                  <div className="bg-white rounded-2xl  h-[250px] p-6 md:p-8 border border-neutral-100 shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full border-2 border-primary-200 overflow-hidden">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-neutral-900">{t.name}</h3>
                        <p className="text-primary-600 text-sm font-medium">
                          {t.position} • {t.company}
                        </p>
                      </div>
                    </div>
                    <p className="text-neutral-600 text-base leading-relaxed relative">
                      <span className="absolute text-primary-300 text-2xl left-[-10px] top-[-8px]">“</span>
                      {t.text}
                      <span className="absolute text-primary-300 text-2xl right-[-10px] bottom-[-8px]">”</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6
              bg-white/90 hover:bg-primary-600 text-primary-600 hover:text-white p-4 rounded-full 
              shadow-md backdrop-blur-sm transition-transform duration-300 hover:scale-110 z-10
              border border-primary-200 hover:border-primary-400"
            aria-label="Tiếp theo"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
