import { NextApiRequest, NextApiResponse } from "next";
import mongodb from "mongodb";

import { connectToDatabase } from "../../utils/mongodb";
import {
  ListPUTBody,
  ListPOSTBody,
  ListPATCHBody,
  List,
} from "../../utils/types";

const isListPATCHBody = (x: any): x is ListPATCHBody => {
  return (
    typeof x === "object" &&
    typeof x.id === "string" &&
    (typeof x.title === "string" ||
      typeof x.description === "string" ||
      typeof x.photos === "object")
  );
};

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
    case "PATCH": {
      if (!isListPATCHBody(body)) {
        return res.status(400).json({ success: false });
      }
      await updateListById(body);
      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader("Allow", ["PUT", "POST", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export const updateListById = async (listPATCHBody: ListPATCHBody) => {
  const { db } = await connectToDatabase();
  const filter = { _id: new mongodb.ObjectID(listPATCHBody.id) };
  let updateDocument: {
    $set?: object;
    $addToSet?: object;
  } = {};

  if (listPATCHBody.description) {
    updateDocument["$set"] = {
      description: listPATCHBody.description,
    };
  }
  if (listPATCHBody.title) {
    updateDocument["$set"] = {
      ...updateDocument["$set"],
      title: listPATCHBody.title,
    };
  }
  if (listPATCHBody.photos) {
    updateDocument.$addToSet = { photos: listPATCHBody.photos };
  }
  const result = await db.collection("list").updateOne(filter, updateDocument);
  return result;
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
