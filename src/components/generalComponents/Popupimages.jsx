import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import "../../style/generalStyle/Popupimages.css";

const ArrowRight = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Popupimages = ({
  images = [],
  colorbackgroundTitleSousTitle = "rgba(255, 255, 255, 0.8)",
  onClose,
  initialIndex = 0  // Propriété ajoutée avec valeur par défaut
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex); // Utiliser initialIndex
  const [isMobile, setIsMobile] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState("next");
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const goToPrevious = () => {
    if (images.length <= 1) return;
    setTransitionDirection("prev");
    setIsZoomed(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
      setIsZoomed(false);
    }, 150);
  };

  const goToNext = () => {
    if (images.length <= 1) return;
    setTransitionDirection("next");
    setIsZoomed(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
      setIsZoomed(false);
    }, 150);
  };

  const goToImage = (index) => {
    if (images.length <= 1) return;
    setTransitionDirection(index > currentIndex ? "next" : "prev");
    setIsZoomed(true);

    setTimeout(() => {
      setCurrentIndex(index);
      setIsZoomed(false);
    }, 150);
  };

  if (images.length === 0) return null;

  return (
    <div className="popup-blur-background">
      <div className="popup-container">
        <div
          className="popup-header"
          style={{ backgroundColor: colorbackgroundTitleSousTitle }}
        >
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="popup-content-wrapper">
          {!isMobile && images.length > 1 && (
            <>
              <button
                className="desktop-nav-button left-nav-button"
                onClick={goToPrevious}
              >
                <ArrowLeft />
              </button>

              <button
                className="desktop-nav-button right-nav-button"
                onClick={goToNext}
              >
                <ArrowRight />
              </button>
            </>
          )}

          <div className="popup-content">
            {!isMobile && (
              <div className="desktop-gallery">
                <div className="image-wrapper main-image">
                  <img
                    src={images[currentIndex]}
                    alt="Main"
                    className={`${isZoomed ? "zoom-out" : "zoom-in"} slide-${transitionDirection}`}
                    key={currentIndex}
                  />
                </div>
              </div>
            )}

            {isMobile && (
              <div className="mobile-gallery">
                <div className="mobile-image-wrapper">
                  <img
                    src={images[currentIndex]}
                    alt="Mobile view"
                    className={`${isZoomed ? "zoom-out" : "zoom-in"} slide-${transitionDirection}`}
                    key={currentIndex}
                  />

                  {images.length > 1 && (
                    <>
                      <div className="mobile-arrow left" onClick={goToPrevious}>
                        <ArrowLeft />
                      </div>
                      <div className="mobile-arrow right" onClick={goToNext}>
                        <ArrowRight />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {images.length > 1 && (
          <div className="navigation-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`indicator ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => goToImage(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popupimages;