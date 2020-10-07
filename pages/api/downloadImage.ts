import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import axios from "axios";

// unsplash does not seem to give a fe app a good way to download a photo
// so here we are downloading the image and then sending it to the fe
// this can probably done better, but I burned a lot of time with axios munging
// the downloaded image on the clientside
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const imageURL = body.imageURL;
  const fileName = body.photoId;
  const imagePath = path.resolve(process.cwd(), `${fileName}.jpeg`);
  await axios({
    url: imageURL,
    responseType: "stream",
  })
    .then((response) => {
      // const readStream = fs.createReadStream(filePath);
      res.writeHead(200, {
        "Content-Type": "image/jpeg",
      });
      response.data.pipe(res);
      // return new Promise((resolve, reject) => {
      //   response.data
      //     .pipe(fs.createWriteStream(imagePath))
      //     .on("finish", () => {
      //       return resolve();
      //     })
      //     .on("error", () => {
      //       return reject();
      //     });
      // });
    })
    .catch((error) =>
      console.error("Unable to write image to temporary directory", error)
    );
  // read and write file
  // const filePath = path.resolve(process.cwd(), imagePath);
  // const stat = fs.statSync(filePath);
  // res.writeHead(200, {
  //   "Content-Type": "image/jpeg",
  //   "Content-Length": stat.size,
  // });
  // // read the image and send
  // const readStream = fs.createReadStream(filePath);
  // readStream.pipe(res);
  // clean up
  // fs.unlink(filePath, (err) => {
  //   if (err) {
  //     console.error("Unable to delete temporary image");
  //   }
  // });
};

export default handler;
