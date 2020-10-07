import { NextApiRequest, NextApiResponse } from "next";
import mongodb from "mongodb";

import { connectToDatabase } from "../../../utils/mongodb";
import { List } from "../../../utils/types";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case "GET": {
      if (Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, errorMessage: "Id must a string" });
      }
      // Update full list document or create new document in database
      const result = await getListById(id);
      return res.status(200).json(result);
    }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export const getListById = async (id: string) => {
  const { db } = await connectToDatabase();
  const filter = { _id: new mongodb.ObjectID(id) };
  const result = await db.collection<List>("list").findOne(filter);
  console.log(result);
  return result;
};

export default handler;
