import { MongoClient, Db } from "mongodb";

let uri = process.env.MONGODB_URI ? process.env.MONGODB_URI : "";
let dbName = process.env.MONGODB_DB ? process.env.MONGODB_DB : "";

let cachedClient: MongoClient | undefined;
let cachedDb: Db | undefined;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!dbName) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
