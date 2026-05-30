import { MongoClient } from 'mongodb';

let clientPromise;

export function getMongoClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured.');
  }

  if (!clientPromise) {
    const client = new MongoClient(process.env.MONGODB_URI);
    clientPromise = client.connect();
  }

  return clientPromise;
}

export async function getDb() {
  const client = await getMongoClient();
  return client.db(process.env.MONGODB_DB || 'resumetai');
}

export async function getUsersCollection() {
  if (!process.env.MONGODB_URI) return null;
  return (await getDb()).collection('users');
}

export async function getInterviewsCollection() {
  return (await getDb()).collection('interviews');
}
