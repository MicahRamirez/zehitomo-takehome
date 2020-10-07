import { NextApiRequest, NextApiResponse } from "next";
import mongodb from "mongodb";

import { connectToDatabase } from "../../../utils/mongodb";
import { ListPATCHBody } from "../../../utils/types";

const isListPATCHBody = (x: any): x is ListPATCHBody => {
  return (
    typeof x === "object" &&
    (typeof x.title === "string" ||
      typeof x.description === "string" ||
      typeof x.photos === "object")
  );
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
    body,
    method,
  } = req;

  switch (method) {
    case "GET": {
      if (Array.isArray(id)) {
        return res
          .status(400)
          .json({ success: false, errorMessage: "Id must a string" });
      }

      const result = await getListById(id);
      return res.status(200).json(result);
    }
    case "PATCH": {
      if (!isListPATCHBody(body) || Array.isArray(id)) {
        return res.status(400).json({ success: false });
      }
      await updateListById(body, id);
      return res.status(200).json({ success: true });
    }
    default:
      res.setHeader("Allow", ["GET", "PATCH"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

// get the list by id
export const getListById = async (id: string) => {
  const { db } = await connectToDatabase();
  const filter = { _id: new mongodb.ObjectID(id) };
  const result = await db.collection("list").findOne(filter);
  return { ...result, id: result._id };
};

// updates a list title or description property. Can add a new photo to a list
// if the photo to add's id is not already in the list
export const updateListById = async (
  listPATCHBody: ListPATCHBody,
  id: string
) => {
  const { db } = await connectToDatabase();
  const filter = { _id: new mongodb.ObjectID(id) };
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

export default handler;
