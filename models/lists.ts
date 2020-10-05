import { connectToDatabase } from "../utils/mongodb";

interface GetListsResponse {}

export const getLists = async (): Promise<GetListsResponse> => {
  const { db } = await connectToDatabase();
  const col = db.collection("lists");
  const r = await col.insertMany([{ a: 1, c: 3 }]);
  console.log(r);
  const docs = await col.find({ a: 1 }).limit(2).toArray();
  return docs;
};

// interface CreateListParams {}

// interface CreateListResponse {

// }

// export const createList = async ({pictureId, title, description}: CreateListParams) => {

// }
