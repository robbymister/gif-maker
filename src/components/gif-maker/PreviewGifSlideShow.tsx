import React, { useEffect, useState } from "react";
import styles from "./PreviewGifSlideshow.module.scss";

interface GifPreviewSlideShowProps {
  listImageUrls: string[];
  slideShowSpeed: number;
}

const GifPreviewSlideShow = ({ listImageUrls, slideShowSpeed }: GifPreviewSlideShowProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSlideshowActive, setIsSlideshowActive] = useState(false);

  const handleGenerateGif = () => {
    setIsSlideshowActive((prevState) => !prevState);
  };

  useEffect(() => {
    if (!isSlideshowActive) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % listImageUrls.length);
    }, slideShowSpeed); // 1 second delay

    return () => clearInterval(interval);
  }, [isSlideshowActive, listImageUrls.length]);

  return (
    <div className={styles.slideshowContainer}>
      <div className={styles.buttonWrapper}>
        <button className={styles.generateButton} onClick={handleGenerateGif}>
          Toggle GIF preview using these images as a slideshow
        </button>
      </div>

      {isSlideshowActive && (
      <div className={styles.slideshowWrapper}>
        <div className={styles.slideshowContainer}>
          <img
            src={listImageUrls[currentIndex]}
            alt={`Slideshow image ${currentIndex + 1}`}
            className={styles.slideshowImage}
          />
        </div>
      </div>
    )}
    </div>
  );
};

export default GifPreviewSlideShow;