import { APIRoute, sanitizeKey } from "next-s3-upload";
import { nanoid } from "nanoid";
import {
  accessKeyId,
  secretAccessKey,
  bucket,
  region,
} from "@/helpers/credentials";

/*
 * The upload logic in this repo is handled by the next-s3-upload package
 * More information can be found here: https://next-s3-upload.codingvalue.com/
 *
 */
export default APIRoute.configure({
  accessKeyId,
  secretAccessKey,
  bucket,
  region,
  key(req, filename) {
    return `${nanoid(8)}-${sanitizeKey(filename)}`;
  },
});
