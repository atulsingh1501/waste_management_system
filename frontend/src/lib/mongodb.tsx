// MongoDB connection setup
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://atulsingh05540_db_user:LNxH6xulgs5vP90O@wms.ixcxwbi.mongodb.net/?retryWrites=true&w=majority&appName=wms";
let client;
let clientPromise;

declare global {
	// eslint-disable-next-line no-var
	var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!globalThis._mongoClientPromise) {
	client = new MongoClient(uri);
	globalThis._mongoClientPromise = client.connect();
}
clientPromise = globalThis._mongoClientPromise;

export default clientPromise;
