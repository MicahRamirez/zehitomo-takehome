import { NextApiRequest, NextApiResponse } from "next";
import { getLists } from "../../models/lists";

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("invoking handler");
    const result = await getLists();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
