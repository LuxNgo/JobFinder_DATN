import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import testimonials from './testimonials';

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isHovered, setIsHovered] = useState(null);
  const itemsPerPage = isSmallScreen ? 1 : 3;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  const getVisibleTestimonials = () => {
    const end = currentIndex + itemsPerPage;
    if (end > testimonials.length) {
      return [...testimonials.slice(currentIndex), ...testimonials.slice(0, end - testimonials.length)];
    }
    return testimonials.slice(currentIndex, end);
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 titleT animate-fade-in">
            What Our Users Say
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="w-16 h-1 bg-primary-600 rounded-full"></div>
            <div className="w-4 h-1 bg-primary-400 rounded-full"></div>
            <div className="w-2 h-1 bg-primary-300 rounded-full"></div>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12
                     bg-white/80 hover:bg-primary-500 text-primary-600 hover:text-white p-5 rounded-full 
                     shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110 z-10
                     border border-primary-100 hover:border-primary-400"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>

          <div className="overflow-hidden px-2">
            <div className="flex gap-8 transition-transform duration-500 ease-out">
              {getVisibleTestimonials().map((testimonial, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 w-full md:w-[380px] transform transition-all duration-500"
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <div className={`h-full bg-white rounded-2xl p-8 shadow-card 
                               transition-all duration-300 border border-neutral-100
                               ${isHovered === index ? 'shadow-2xl border-primary-100' : 'hover:shadow-xl'}`}>
                    <div className="flex items-center gap-5 mb-8">s
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-primary-100 p-1">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-full h-full rounded-full object-cover transform transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-primary-500 p-2 rounded-full shadow-lg">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-1">
                          {testimonial.name}
                        </h3>
                        <p className="text-primary-600 text-sm font-medium">
                          {testimonial.position} • {testimonial.company}
                        </p>
                      </div>
                    </div>
                    <blockquote className="relative">
                      <div className="absolute -top-4 -left-2 text-primary-200 text-4xl">"</div>
                      <p className="text-neutral-600 leading-relaxed text-lg pl-4">
                        {testimonial.text}
                      </p>
                      <div className="absolute -bottom-4 -right-2 text-primary-200 text-4xl">"</div>
                    </blockquote>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12
                     bg-white/80 hover:bg-primary-500 text-primary-600 hover:text-white p-5 rounded-full 
                     shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-110 z-10
                     border border-primary-100 hover:border-primary-400"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;

