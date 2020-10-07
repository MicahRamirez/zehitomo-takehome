import { NextApiRequest, NextApiResponse } from "next";
import mongodb from "mongodb";

import { connectToDatabase } from "../../utils/mongodb";
import { ListPUTBody, ListPOSTBody, List } from "../../utils/types";

const isListPUTBody = (x: any): x is ListPUTBody => {
  return (
    typeof x === "object" &&
    typeof x.title === "string" &&
    typeof x.description === "string" &&
    Array.isArray(x.photos)
  );
};

const isListPOSTBody = (x: any): x is ListPOSTBody => {
  return typeof x === "object" && Array.isArray(x.listIds);
};

type ERROR = { success: boolean; errorMessage: string };
const DB_ERROR = { success: false, errorMessage: "Unable to access DB" };

export interface PutResponse {
  id: string; // id of created List
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { body, method } = req;

  switch (method) {
    case "PUT": {
      // Update full list document or create new document in database
      if (!isListPUTBody(body)) {
        return res.status(400).json({ success: false });
      }
      const result = await createList(body);
      return res.status(201).json(result);
    }
    case "POST": {
      // send an array of ids that were saved in local storage on the client
      // get the full documents for each
      if (!isListPOSTBody(body)) {
        return res.status(400).json({ success: false });
      }
      const result = await getListByIds(body.listIds);
      return res.status(200).json({ lists: result });
    }
    default:
      res.setHeader("Allow", ["PUT", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export const getListByIds = async (listIds: string[]) => {
  const { db } = await connectToDatabase();
  const cursor = db.collection<List>("list").find({
    _id: {
      $in: listIds.map((listId) => new mongodb.ObjectID(listId)),
    },
  });
  let result: List[] = [];
  await cursor.forEach((listDoc) => {
    result.push(listDoc);
  });
  return result;
};

export const createList = async (
  listPUTBody: ListPUTBody
): Promise<PutResponse | ERROR> => {
  let mongodb;
  try {
    mongodb = await connectToDatabase();
  } catch (e) {
    console.error("unable to connect to db");
  }
  if (!mongodb) {
    return DB_ERROR;
  }
  let result;
  try {
    result = await mongodb.db
      .collection<Omit<List, "id">>("list")
      .insertOne(listPUTBody);
  } catch (error) {
    return { success: false, errorMessage: "Unable to create list" };
  }
  return { id: result.insertedId.toString() };
};

export default handler;
