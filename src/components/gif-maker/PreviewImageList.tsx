import React from "react";
import styles from "./PreviewImageList.module.scss";

interface PreviewImageListProps {
  listImageUrls: string[];
}

const PreviewImageList = ({ listImageUrls }: PreviewImageListProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>Preview of images that will be used to generate a GIF in order:</div>
      <div className={styles.imageContainer}>
        {listImageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`GIF Image Preview ${index + 1}`}
            className={styles.image}
          />
        ))}
      </div>
    </div>
  );
};

export default PreviewImageList;