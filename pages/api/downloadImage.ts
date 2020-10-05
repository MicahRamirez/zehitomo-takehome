import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const imageURL = body.imageURL;
  const fileName = body.photoId;
  const imagePath = `images_tmp/${fileName}.jpeg`;
  await axios({
    url: imageURL,
    responseType: "stream",
  })
    .then((response) => {
      return new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(imagePath))
          .on("finish", () => {
            console.log("finished writing the stream");
            return resolve();
          })
          .on("error", () => reject());
      });
    })
    .catch(() => console.log("error"));
  // read and write file
  const filePath = path.resolve(process.cwd(), imagePath);
  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    "Content-Type": "image/jpeg",
    "Content-Length": stat.size,
  });
  const readStream = fs.createReadStream(filePath);

  console.log("buffer done");
  readStream.pipe(res);
  // clean up
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log("error");
    }
  });
};

export default handler;
