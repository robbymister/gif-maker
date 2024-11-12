import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { createCanvas, loadImage } from "canvas";
import {
  downloadFileFromUrl,
  getNameAndExtensionFromUrl,
  makeTempFilePath,
  uploadFileFromLocalPath,
} from "@/helpers/files";

type ResponseData = {
  gifUrl: string;
};

const DEFAULT_GIF_OUTPUT_LOCAL_PATH = "new-gif-output.gif";
const GifEncoder = require('gif-encoder');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { body } = req;
  const { listImageUrls, gifDelay } = body;

  const localInputListImageUrls = await downloadFilesFromListImageUrls(listImageUrls);

  if (localInputListImageUrls.length == listImageUrls.length) { // successfully downloaded all files
    const localOutputPathForGif = makeTempFilePath(DEFAULT_GIF_OUTPUT_LOCAL_PATH);
    await createGif(localInputListImageUrls as string[], localOutputPathForGif, gifDelay);

    const { basename } = getNameAndExtensionFromUrl(listImageUrls[0]);
    const uploadedUrl = await uploadFileFromLocalPath(
      localOutputPathForGif,
      `${basename}_gif.gif`,
      true
    );

    // return the image back to the client
    if (uploadedUrl) {
      return res.status(200).json({ gifUrl: uploadedUrl });
    } else {
      return res.status(500); 
    }
  } else {
    return res.status(500);
  }
}

const downloadFilesFromListImageUrls = async (listImageUrls: string[]) => {
  const localInputListImageUrls = await Promise.all(
    listImageUrls.map(async (imageUrl: string) => {
      return await downloadFileFromUrl(imageUrl);
    })
  );
  
  return localInputListImageUrls;
};

const createGif = async (imagePaths: string[], outputPath: string, delay = 1000) => {
  return new Promise<void>(async (resolve, reject) => {
    // Initialize the GIF encoder with the given width and height
    const encoder = new GifEncoder(640, 480, {
    highWaterMark: 5 * 1024 * 1024 // 5MB
  });
    
    // Create a writable stream to the output file
    const gifStream = fs.createWriteStream(outputPath);
    
    // Pipe the encoder to the writable stream
    encoder.pipe(gifStream);

    encoder.writeHeader();
    encoder.setRepeat(0); // 0 for repeat forever, -1 for no repeat
    encoder.setDelay(delay); // Delay between frames in ms
    encoder.setQuality(10); // Image quality (lower number = better quality)

    // Create a canvas to draw images on
    const canvas = createCanvas(640, 480);
    const ctx = canvas.getContext('2d');

    try {
      // Loop through each image path and load all images sequentially
      for (let imagePath of imagePaths) {
        const image = await loadImage(imagePath); // Load image using canvas's loadImage
        ctx.clearRect(0, 0, 640, 480); // Clear the canvas before drawing a new image
        ctx.drawImage(image, 0, 0, 640, 480); // Draw the image on the canvas

        // Get RGBA pixel data from the canvas
        const frameData = ctx.getImageData(0, 0, 640, 480).data;

        // Add the frame to the encoder
        encoder.addFrame(frameData); // Ensure frame is added before moving to the next one
      }

      // Finish encoding the GIF
      encoder.finish();

      // Listen for the 'finish' event to resolve the promise
      gifStream.on('finish', () => {
        resolve();
      });

      // Handle any errors in the file stream
      gifStream.on('error', (err) => {
        console.error('Error during GIF encoding:', err);
        reject(err);
      });

    } catch (error) {
      reject(error);
    }
  });
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "100mb",
    },
  },
};
