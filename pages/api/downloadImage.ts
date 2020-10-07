import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body } = req;
  const imageURL = body.imageURL;
  try {
    const response = await axios({
      url: imageURL,
      responseType: "stream",
    });
    res.writeHead(200, {
      "Content-Type": "image/jpeg",
    });
    return response.data.pipe(res);
  } catch (error) {
    console.error("Unable to fetch image");
    res.status(400).json({ success: false });
  }
};

export default handler;
