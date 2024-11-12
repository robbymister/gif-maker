import React, { useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Upload from "@/components/Upload";
import PreviewImageList from "@/components/gif-maker/PreviewImageList";
import GifPreviewSlideShow from "@/components/gif-maker/PreviewGifSlideShow";
import styles from "./GifMaker.module.scss";
import CreateGifButton from "@/components/gif-maker/CreateGif";

export default function GIFMaker() {
  const [listImageUrl, setImageUrlList] = useState<string[]>([]);
  const [slideshowSpeed, setSlideshowSpeed] = useState<number>(1000);

  const handleFinish = (uploadedUrls: Array<string>) => {
    setImageUrlList(prevArray => [...prevArray, ...uploadedUrls]);
    return;
  };

  const clearImageUrlQueue = () => {
    setImageUrlList([]);
  }

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSlideshowSpeed(Number(event.target.value)); // Update slideshow speed state
  };

  return (
    <>
      <Head>
        <title>Gif Maker</title>
        <meta
          name="description"
          content="This gif maker handles uploading multiple images, allows the user to preview the images playing one after another, and returns the a completed GIF."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="*******************" // TO-DO: update with correct favicon ico
        />
      </Head>
      <main className={styles.main}>
        <Navbar />
        <div className={styles.body}>
          <h1 className={styles.header}>GIF Maker</h1>
          <p>
            This GIF Maker allows the user to upload multiple files, preview the
            images together as a slideshow, and then create the final GIF. Warning:
             All images will be forced to a 640x480 size during final rendition, and
             they will maintain the same aspect ratio of the preview!
          </p>
          <div className={styles.uploader}>
            <Upload handleFinish={handleFinish} />
            <button onClick={clearImageUrlQueue}>Clear Image Queue</button>
          </div>

          {listImageUrl.length > 0 && (
            <div>
              <label htmlFor="speed"> GIF Speed: {slideshowSpeed} ms</label>
              <input
                id="speed"
                type="range"
                min="100"
                max="3000"
                step="100"
                value={slideshowSpeed}
                onChange={handleSpeedChange}
              />
            </div>
          )}

          {listImageUrl.length > 0 && (
            <div className={styles.tool}>
              <PreviewImageList listImageUrls={listImageUrl} />
              <GifPreviewSlideShow listImageUrls={listImageUrl} slideShowSpeed={slideshowSpeed} />
              <CreateGifButton listImageUrls={listImageUrl} gifDelay={slideshowSpeed} />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
