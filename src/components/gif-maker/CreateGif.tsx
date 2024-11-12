import React, { useState } from "react";
import styles from "../grayscale/Create.module.scss";

interface CreateGifProps {
  listImageUrls: string[];
  gifDelay: number;
}

const CreateGifButton = ({ listImageUrls, gifDelay }: CreateGifProps) => {
  const [loading, setLoading] = useState(false);
  const [gif, setGif] = useState(undefined);

  const create = () => {
    const body = {
      listImageUrls,
      gifDelay
    };

    setLoading(true);
    setGif(undefined);

    fetch("/api/gif", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then(
        (result) => {
          const { gifUrl } = result;
          setGif(gifUrl);
          setLoading(false);
        },
        (error) => {
          console.error("An error occurred:", error);
          setLoading(false);
        }
      );
  };

  const renderFinalGif = () => {
    if (!gif) return null;
    return (
      <>
        <div className={styles.header}>Final gif using the above images:</div>
        <img src={gif} alt="GIF Final" className={styles.image} />
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.description}>
        The slideshow above is a preview of what your GIF will look like after
        using this tool. To create your final GIF, click the button below:
      </div>
      {loading ? (
        "Loading ..."
      ) : (
        <input type="button" value="Make Gif" onClick={create} />
      )}
      {renderFinalGif()}
    </div>
  );
};

export default CreateGifButton;
